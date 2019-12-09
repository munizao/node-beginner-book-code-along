const querystring = require('querystring');
const fs = require('fs');
const formidable = require('formidable');

function start(response, postData) {
  console.log('request handler "start" was called');

  const body = '<html>' +
  '<head>' +
  '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
  '</head>' +
  '<body>' +
  '<form action="/upload" enctype="multipart/form-data" method="post">' +
  '<input type="file" name="upload" multiple="multiple"/>' +
  '<input type="submit" value="Upload file">'
  '</form>' +
  '</body>' +
  '</html>';

  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(body);
  response.end();
}

function upload(response, request) {
  console.log('Request handler "upload" was called');
  const form = new formidable.IncomingForm();
  console.log('about to parse');
  form.parse(request, (error, fields, files) => {
    console.log('parsing done');
    fs.rename(files.upload.path, '/tmp/test.png', error => {
      if(error) {
        fs.unlink('/tmp/test.png');
        fs.rename(files.upload.path, '/tmp/test.png')
      }
    });
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('received image: <br/>');
    response.write('<img src="/show">');
    response.end();
  });
}

function show(response) {
  console.log('Request handler "show" was called');
  response.writeHead(200, {'Content-Type': 'image/png'});
  fs.createReadStream('/tmp/test.png').pipe(response);
}

exports.start = start;
exports.upload = upload;
exports.show = show;