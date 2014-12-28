/**
Downloads images from Image object array and writes IPTC title, caption
data to image metadata fields. Tested to copy title/caption suitable for WordPress

Tim Sullivan
*/

//NodeJS Requirements
var fs = require('fs');
var path = require('path');
var request = require('request');
var child_process = require('child_process');

var topLevel = "https://www.timatooth.com";

var Image = function(){
  alt: "",
  src: "",
  title: ""
};

var download = function(image, callback){
  request.head(topLevel + image.src, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    callback['imageObject'] = image;
    request(topLevel + image.src).pipe(fs.createWriteStream("images/" +path.basename(image.src))).on('close', function(){
      callback(image, this);
    });
  });
};

var imgThumbs = new Array();
var current_img = 0;

////////////////////////////////////////////////////////////////////////////////
//Image Object Data Array

imgThumbs[0] = new Image();
imgThumbs[0].src = "/static/images/bg1.jpg";
imgThumbs[0].title = "Background Image 1";
imgThumbs[0].alt = "An example image caption of a background image";


//////////////////////////////////////////////////////////////////////////////////////////
for(var i = 0; i < imgThumbs.length; i += 1){
  //async request image, save to disk, then apply IPTC metadata for title/caption for WordPress
  download(imgThumbs[i], function(image, fsObject){
    var python = child_process.spawn(
      'python',
      [__dirname + '/iptc.py', fsObject.path, image.title, image.alt]
    );

    python.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    python.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    python.on('close', function(code){
      if(code == 0){
        console.log("iptc.py done");
      } else {
        console.log("python iptc.py errored out with code: " + code);
      }

    });
  });
}
