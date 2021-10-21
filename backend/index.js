/*
    depedencies
*/
    const express = require('express')
    const admin = require('firebase-admin')
    let inspect = require('util').inspect
    let Busboy = require('busboy')
    let path = require('path')
    let os = require('os') //allows us to get access in the temp folder
    let fs = require('fs') //allows us to right the file in temp folder
    let UUID = require('uuid-v4')
    let webpush = require('web-push')
/* 
    config - process
*/
    const app = express()
/*
    config - firebase firestore
*/
    const serviceAccount = require('./serviceAccountKey.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'picturegram-e8afe.appspot.com'
    });

    const db = admin.firestore();
    const bucket = admin.storage().bucket();
/*
    config - web push
*/
    webpush.setVapidDetails(
        'mailto:test@test.com',
        'BLftgvikd86kLw7Y2l_E91eWgvZRboeBSugrFLGInK3nTb8HWTrfKYkwDumHBCOibMEzGUCs7SgxGeGYzidYvIY', //public key 
        'lWKUF_-cvKhiKKjq5P0g1HWXakQ3YN5Yb1hiRdCK1Lw' // private key
    );
/*
    endpoint - posts
*/
    app.get('/posts', (request, response) => {
        response.set('Access-Control-Allow-Origin', '*')
        var posts = [];
        db.collection('posts').orderBy('date', 'desc').get().then(snapshot=>{
            // console.log(snapshot);
            snapshot.forEach((doc) => {
                // console.log(doc.data());
                posts.push(doc.data())
            });
            response.send(posts)
        });
    })
/*
    endpoint - createPost
*/
app.post('/createPost', (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')
    var busboy = new Busboy({ headers: request.headers });
    let fields = {}
    let file_data = {}
    let image_url

    let uuid = UUID()
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        // console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    // /tmp/uid.png
        let filepath = path.join(os.tmpdir(), filename)
        file.pipe(fs.createWriteStream(filepath))
        file_data = { filepath, mimetype }
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        fields[fieldname] = val
    });

    busboy.on('finish', function() {
        bucket.upload(
            file_data.filepath, 
            {
                upload_type: 'media',
                metadata:{
                    metadata:{
                        content_type: file_data.mimetype,
                        firebaseStorageDownloadTokens: uuid
                    }
                }
            },
            (err, uploaded_file)=>{
                if(!err){
                    createDocument(uploaded_file)
                }
            }
        )
        function createDocument(uploaded_file){
            image_url = `https://firebasestorage.googleapis.com/v0/b/${ bucket.name }/o/${ uploaded_file.name }?alt=media&token=${ uuid }`
            db.collection('posts').doc(fields.id).set({
                id: fields.id,
                caption: fields.caption,
                location: fields.location,
                date: parseInt(fields.date),
                image_url: image_url,
            }).then(response=>{
                sendPushNotification()
                response.send('Post Added: ' + response)
            }).catch(err=>{
                response.send(err)
            });
        } 

        function sendPushNotification(){
            var subscriptions = [];
            console.log("here dito");
            db.collection('subscription').get().then(snapshot=>{
                // console.log(snapshot);
                snapshot.forEach((doc) => {
                    subscriptions.push(doc.data())
                });
                return subscriptions
            }).then(subscriptions=>{
                console.log(subscriptions);
                subscriptions.forEach(subscription=>{
                    const pushSubscription = {
                        endpoint: subscription.endpoint,
                        keys: {
                            auth: subscription.keys.auth,
                            p256dh: subscription.keys.p256dh
                        }
                    }
                    let pushContent = {
                        title: "New post has been added!",
                        body: "New post has been added! Check it out!",
                        open_url: '/',
                        image_url: image_url
                    }
                    webpush.sendNotification(pushSubscription, JSON.stringify(pushContent) );
                })
            })
        }
    });
    request.pipe(busboy);
})
/*
    endpoint - createSubscription
*/
app.post('/createSubscription', (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')
    // console.log(request)
    db.collection('subscription').add(request.query).then(docRef=>{
        response.send({
            message: 'Subscription added! ',
            post_data: request.query
        })
    })
})
/* 
    listen
*/
    app.listen(process.env.PORT || 3000)