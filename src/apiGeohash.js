const express = require('express');
const { encodeGeoHash, decodeGeohash } = require('./geohashUtil');
const router = express.Router();

router.get('/all', (req, res) => {

});

router.get('/:id', (req, res) => {

});

router.get('/encode', (req, res) => {
    const query = req.query;
    res.send(encodeGeoHash(query.lat, query.lng, query.zoom)); 
});

router.get('/decode', (req, res) => {
    const query = req.query;
    res.send(decodeGeohash(query.geohash));
});

router.post('/add', (req, res) => {

});

router.put('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {

});