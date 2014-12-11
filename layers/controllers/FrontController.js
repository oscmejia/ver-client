var FrontController = function() {};
var fs = require('fs');

FrontController.prototype.print = function(req, res) {
  var data      = req.body.data;
  var path      = '';
  var printName = req.body.printD+'.txt';
  var filename  = path+printName;
  fs.writeFile(filename, data, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });
  res.status(200).send('Succes');
};

module.exports.create = function() {
  return new FrontController();
};
module.exports._class = FrontController;
