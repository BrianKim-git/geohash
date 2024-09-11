const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const { encodeGeoHash, decodeGeohash } = require('./geohashUtil');

router.get('/all', async (req, res) => {
    try {
        const pointRef = db.collection('point');
        const snapshot = await pointRef.get();

        let points = [];
        snapshot.forEach(doc => {
            points.push({id: doc.id, ...doc.data()});
        })
        res.status(200).json(points);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching points: ' + error.message)
    }
});

router.get('/search', async (req, res) => {
    try {
        const query = req.query;
        const pointRef = db.collection('point');
        const doc = await pointRef.where('geohash', '>=', query.geohash).where('geohash', '<=', query.geohash + '\uf8ff').get();

        let points = [];
        snapshot.forEach(doc => {
            points.push({id: doc.id, ...doc.data()});
        })
        res.status(200).json(points);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching users: ' + error.message)
    }
});

router.get('/encode', (req, res) => {
    const query = req.query;
    res.send({encode: encodeGeoHash(query.lat, query.lng, query.zoom)}); 
});

router.get('/decode', (req, res) => {
    const query = req.query;
    res.send({decode: decodeGeohash(query.geohash)});
});

router.get('/:id', async (req, res) => {
    try {
        const pointRef = db.collection('point');
        const doc = await pointRef.doc(req.params.id).get();

        if (!doc.exists) {
            res.status(404).send('No Point Matching with Id: ' + req.params.id);
        } else {
            res.status(200).json(doc);
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching users: ' + error.message)
    }
});

router.post('/add', async (req, res) => {
    try {
        const body = req.body;
        const pointRef = await db.collection('point').add(body);
        res.send(`point with the id: ${pointRef.id} adding success`);
    } catch (error) {
        res.status(400).send('Error creating point: ' + error.message);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const param = req.params;
        const body = req.body;
        await db.collection('point').doc(param.id).update(body);
        res.send(`point update success`);
    } catch (error) {
        res.status(400).send('Error updating point: ' + error.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const param = req.params;
        const body = req.body;
        const pointRef = await db.collection('point').doc(param.id).delete();
        res.send(`point delete success`);
    } catch (error) {
        res.status(400).send('Error updating point: ' + error.message);
    }
});

module.exports = router;