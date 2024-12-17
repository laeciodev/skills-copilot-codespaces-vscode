// Create web server
// Accept comments and store them in a file
// Display comments on the page

var http = require('http');
var fs = require('fs');
var qs = require('querystring');

function serveStaticFile(res, path, contentType, responseCode) {
  if (!responseCode) responseCode = 200;
  fs.readFile(__dirname + path, function(err, data) {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 - Internal Error');
    } else {
      res.writeHead(responseCode, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

http.createServer(function(req, res) {
  var url = req.url.split('?');
  console.log(url);
  var params = qs.parse(url[1]);
  console.log(params);
  if (req.method === 'POST') {
    var body = '';
    req.on('data', function(data) {
      body += data;
    });
    req.on('end', function() {
      var params = qs.parse(body);
      console.log(params);
      fs.appendFile('public/comments.txt', '\n' + params.name + ': ' + params.comment, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Data written to file');
        }
      });
    });
  }

  switch (url[0]) {
    case '/':
      serveStaticFile(res, '/public/home.html', 'text/html');
      break;
    case '/about':
      serveStaticFile(res, '/public/about.html', 'text/html');
      break;
    case '/img/logo.png':
      serveStaticFile(res, '/public/img/logo.png', 'image/png');
      break;
    case '/img/logo.jpg':
      serveStaticFile(res, '/public/img/logo.jpg', 'image/jpeg');
      break;
    case '/public/comments.txt':
      serveStaticFile(res, '/public/comments.txt', 'text/plain');
      break;
    default:
      serveStaticFile(res, '/public/404.html', 'text/html', 404);
      break;
  }
}).listen(3000);

console.log('Server started on localhost:3000; press Ctrl-C to terminate....');