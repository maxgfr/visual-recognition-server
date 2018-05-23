const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');

const http = require('http');
const multer  = require('multer');
const sps = require( 'string.prototype.startswith' );
const sizeOf =  require( 'image-size' );
const exphbs =  require( 'express-handlebars' );
const fs = require('fs');
const formidable = require('express-formidable');
const fileUpload = require('express-fileupload');
const cors = require('cors');
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

    var classifier_ids = ["default", "Paris_2018_41173930"];

    var params = {
        images_file: fs.createReadStream(req.file.path),
        classifier_ids: classifier_ids
    };

    visualRecognition.classify(params, function(err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(JSON.stringify(res, null, 2));
            result.status(200).send(JSON.stringify(res)); //send a JSON
        }
    });
});

app.post('/api/upload', upload.single('image'), function( req, res ) {

    var classifier_ids = ["default", "Paris_2018_41173930"];

    var params = {
        images_file: fs.createReadStream(req.file.path),
        classifier_ids: classifier_ids
    };

    visualRecognition.classify(params, function(err, success) {
        if (err) {
            res.json(err);
        } else {
            res.json(success);
        }
    });
});

/* SET PORT AND CREATE SERVER */
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
var server = http.createServer(app);
server.listen(port);
function normalizePort(val) { //Normalize a port into a number, string, or false.
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

/* ALLOW TO USE THESE DIRECTORIES */
app.use('/bower_components', express.static('bower_components'));
app.use('/vendor', express.static('vendor'));
app.use('/assets', express.static('assets'));
