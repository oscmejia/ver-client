var FrontController = function() {};
var fs = require('fs');
var printer = require ('printer-lp');
var WebServices = require(G.path+'/js/webServices');

FrontController.prototype.print = function(req, res) {
  var data      = req.body.data;
  var path      = G.path+'/temp/';
  var printName = data.printD;
  var filename  = path+printName;
  fs.writeFile(filename, data.stringFile, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');

    var options = {
      // destination: G.settings.printer_name,
    };
    var jobFile = printer.printFile(filename, options, 'Impresion '+ printName);

    jobFile.on('end', function () {
      console.log(this.identifier + ', job send to printer queue');
    });

    jobFile.on('error', function (message) {
      console.log(this.identifier + ', error: ' + message);
    });

    res.status(200).send(true);
  });
};

FrontController.prototype.getPrintData = function(req, res) {
  var today = new Date();
  var data = {
    'date'    : req.query.date,
    'storeId' : req.query.storeId,
    'storeN'  : req.query.storeN,
    'User'    : req.query.userN,
    'printD'  : today.toJSON().substring(0,10)+'-'+today.toLocaleTimeString()
  };
  var url = G.settings.ip_address+':'+G.settings.port+'/printRemote';
  WebServices.doRequest(url, data, function(response) {
    url = 'http://localhost:3030/print';
    WebServices.doRequest(url, response.body.data, function(responseP) {
      if(responseP){
        var closeTab = '<script>window.close()</script>';
        res.status(200).send(closeTab);
      }
    });
  });
};

module.exports.create = function() {
  return new FrontController();
};
module.exports._class = FrontController;
