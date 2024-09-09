const express = require('express');
const path = require('path');
const app = express();

app.listen(3001, () => {console.log(`geohash server open`)})

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname,'./index.html'));
})

app.post('/api/geohash', (req, res) => {
    const response = {geohash: getGeoHashByLatLng(req.body?.coordinate)}
    console.log(response);
    res.send(response);
})

function getGeoHashByLatLng(param){
    return getGeoHash(param[0], param[1], 10);
}

function getGeoHash(lat, lng, hashLength) {
    const base32Symbol = '0123456789bcdefghjkmnpqrstuvwxyz';
    const binaryCordinate = getBinaryCordinate(lat, lng, hashLength);

    let geohash = '';
    for (let i = 0; i<hashLength; i++) {
        let start = 5 * i;
        let target = binaryCordinate.substring(start, start+5); 
        geohash += base32Symbol.charAt(parseInt(target, 2));
    }

    return geohash;
}

function getBinaryCordinate(lat, lng, hashLength) {
    let binary = '';
    let left = -180;
    let right = 180;
    let top = 90;
    let bottom = -90;

    const endCount = hashLength * 5;
    let count = 0;
    let verticalDivider;
    let horizontalDivider;

    while(true) {
        verticalDivider = (left + right) / 2;
        if (lng >= verticalDivider) {
            binary += '1';
            left = verticalDivider;
        } else {
            binary += '0';
            right = verticalDivider;
        }

        count++;

        if (count == endCount) {
            break;
        }

        horizontalDivider = (top + bottom) / 2;
        if (lat >= horizontalDivider) {
            binary += '1';
            bottom = horizontalDivider;
        } else {
            binary += '0';
            top = horizontalDivider;
        }

        count++;
        if (count == endCount) {
            break;
        }
    }
    return binary;
}