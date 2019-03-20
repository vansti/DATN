var fs = require('fs');
var files = fs.readdirSync('./file_upload');

console.log(files[0]);