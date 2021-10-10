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
    let uuid = UUID()
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
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
            db.collection('posts').doc(fields.id).set({
                id: fields.id,
                caption: fields.caption,
                location: fields.location,
                date: parseInt(fields.date),
                image_url: `https://firebasestorage.googleapis.com/v0/b/${ bucket.name }/o/${ uploaded_file.name }?alt=media&token=${ uuid }`,
            }).then(response=>{
                response.send('Post Added: ' + response)
            }).catch(err=>{
                response.send(err)
            });
        }
        // response.send("Done parsing form!")
    });
    request.pipe(busboy);
})
/* 
    listen
*/
    app.listen(process.env.PORT || 3000)