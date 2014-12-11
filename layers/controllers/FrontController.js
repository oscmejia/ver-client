var FrontController = function() {};
var fs = require('fs');

FrontController.prototype.print = function(req, res) {
  var data      = req.body.data;
  var path      = G.path+'/temp/';
  var printName = req.body.printD+'.txt';
  var filename  = path+printName;
  fs.writeFile(filename, data, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });
  var printer = require ('printer-lp');
  var options = {
    destination: G.settings.printer_name,
  };
  var jobFile = printer.printFile(filename, options, 'Impresion '+ printName);
  var onJobEnd = function () {
    console.log(this.identifier + ', job send to printer queue');
  };
  var onJobError = function (message) {
    console.log(this.identifier + ', error: ' + message);
  };
  jobFile.on('end', onJobEnd);
  jobFile.on('error', onJobError);
  res.status(200).send('Succes');
};

module.exports.create = function() {
  return new FrontController();
};
module.exports._class = FrontController;
