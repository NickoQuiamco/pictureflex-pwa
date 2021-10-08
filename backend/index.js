/*
    depedencies
*/
    const express = require('express')
    const admin = require('firebase-admin');
/* 
    config - process
*/
    const app = express()
/*
    config - firebase firestore
*/
    const serviceAccount = require('./serviceAccountKey.json');

    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    });

    const db = admin.firestore();
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
app.get('/createPost', (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')
    var posts = [];
    response.send(posts)
})
/* 
    listen
*/
    app.listen(process.env.PORT || 3000)