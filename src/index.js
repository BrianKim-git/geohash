const express = require('express');
const path = require('path');
const admin = require('../serviceAccountKey.json');
const geohashRouter = require('./apiGeohash');
const app = express();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/api/geohash', geohashRouter);

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname,'./index.html'));
})

app.listen(8080, () => {console.log(`geohash server open`)})