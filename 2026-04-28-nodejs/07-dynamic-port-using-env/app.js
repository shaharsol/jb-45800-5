const port = process.env.PORT || 3000
require('http').createServer((request, response) => response.end('<h3>hello world</h3>')).listen(port);
