var fs = require('fs');
var pug = require('pug');

console.log(pug.render(fs.readFileSync('./template.pug'),
  {require: x=>require(x), }
));
