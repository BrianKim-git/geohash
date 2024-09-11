const express = require('express');
const app = express();
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const geohashRouter = require('./apiGeohash');

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/api/geohash', geohashRouter);

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname,'./index.html'));
})

app.listen(8080, () => {console.log(`geohash server open`)})