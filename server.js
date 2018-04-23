const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');

const multer  = require('multer');
const sps = require( 'string.prototype.startswith' );
const sizeOf =  require( 'image-size' );
const exphbs =  require( 'express-handlebars' );
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');
const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
const apiKey = process.env.VISUAL_RECOGNITION_API_KEY;

var upload = multer( { dest: 'uploads/' } );

var visualRecognition = new VisualRecognitionV3({
    api_key: apiKey,
    version: '2016-05-20'
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/upload', upload.single( 'file' ), function( req, result, next ) {

    if ( !req.file.mimetype.startsWith( 'image/' ) ) {
        return res.status( 422 ).json( {
            error : 'The uploaded file must be an image'
        } );
    }

    var params = {
        images_file: fs.createReadStream(req.file.path)
    };

    visualRecognition.classify(params, function(err, res) {
        if (err) {
            console.log(err);
        } else {
            //console.log(JSON.stringify(res, null, 2));
            result.status(200).send(JSON.stringify(res)); //send a JSON
        }
    });
});

app.listen(3000, () => {
    console.log('I\'m listening on port 3000!');
});

app.use('/bower_components', express.static('bower_components'));
app.use('/vendor', express.static('vendor'));
app.use('/assets', express.static('assets'));
