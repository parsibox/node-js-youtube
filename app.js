var http = require("http");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var youtubedl = require('youtube-dl');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
 

var fs = require('fs');
app.use('/static', express.static(__dirname + '/static'))


// Running Server Details.
var server = app.listen(8102, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("app listening at %s:%s Port", host, port)
});
 
 
app.get('/', function (req, res) {
  var html='';
  html +="<body>";
  html += "<form action='/dl'  method='post' name='form1'>";
  html += "yuetube url:</p><input type= 'text' name='url'>";
  html += "<input type='submit' value='submit'>";
  html += "<INPUT type='reset'  value='reset'>";
  html += "</form>";
  html += "</body>";
  res.send(html);
});
 
app.post('/dl', urlencodedParser, function (req, res){
  
  var output = 'myvideo.mp4';



  
  var downloaded = 0;
  if (fs.existsSync(output)) {
    downloaded = fs.statSync(output).size;
  }

  var url =  req.body.url;

  var options = {
    // Write automatic subtitle file (youtube only)
    auto: false,
    // Downloads all the available subtitles.
    all: false,
    // Languages of subtitles to download, separated by commas.
    lang: 'en',
    // The directory to save the downloaded files in.
    cwd: __dirname + '/static',
  };

  var video = youtubedl(url,
 
  // Optional arguments passed to youtube-dl.
  ['--format=18'],
 
  // start will be sent as a range header
  { start: downloaded, cwd: __dirname + '/static' });

  video.on('info', function(info) {
  //  console.log('Download started');
 //   console.log('filename: ' + info._filename);
    var total = info.size + downloaded;
  //  console.log('size: ' + total);
  });
video.pipe(fs.createWriteStream('static/'+output, { flags: 'a' }));

video.on('end', function() {
  console.log('finished downloading!');
  var reply='';
  reply += "start download " + req.body.url+" <br /><a href='/static/"+output+"' >Download</a>";
  res.send(reply);
});


 });