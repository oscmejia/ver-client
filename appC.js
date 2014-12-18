var fs = require('fs');
var chokidar = require('chokidar');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var errorhandler = require('errorhandler');
var express = require('express');

G = {};
G.path = __dirname;

var WebServices = require(G.path+'/js/webServices');

if (fs.existsSync(G.path + '/config')) {
  try {
    G.settings = JSON.parse(fs.readFileSync(G.path + '/config', 'utf8'));
  }
  catch (e) {
    console.log('Cannot read config file');
  }
}

if(G.settings.path1){
  chokidar.watch(G.settings.path1, {ignored: /[\/\\]\./, persistent: true, useFsEvents: G.settings.useFs, ignoreInitial: true}).on('add', function(path) {
    console.log('Add file event detected on folder 1: '+path);
    setTimeout(function(){
      fs.readFile(path, "utf8", function (err, data) {
        if(data){
          console.log('File Content:\n');
          console.log(data);
          console.log('\n\nFile contains data, checking keywords');
          if((data.search('Vendedor') !== -1) && (data.search('FACTURA') !== -1) && (data.search('T O T A L') !== -1) && (data.search('Fecha') !== -1)){
            console.log('All key words found, calling parseBill function');
            var printD = new Date();
            printD = printD.toJSON().substring(0,10)+'-'+printD.toLocaleTimeString();
            var path      = G.path+'/temp/';
            var printName = printD;
            var filename  = path+printName;
            fs.writeFile(filename, data, function (err) {
              if (err) throw err;
              console.log('It\'s saved!');
            });
            var url = G.settings.ip_address+':'+G.settings.port+'/parseBill';
            WebServices.doRequest(url, data, function(response) {
              console.log(response);
            });
          }else{
            console.log('Keyword  Vendedor search result: '+(data.search('Vendedor')));
            console.log('Keyword  FACTURA search result: '+(data.search('FACTURA')));
            console.log('Keyword  T O T A L search result: '+(data.search('T O T A L')));
            console.log('Keyword  Fecha search result: '+(data.search('Fecha')));
          }
        }
      });
    }, 500);
  });
}

var app = express();
// Controllers
var frontController = require(G.path+'/layers/controllers/FrontController').create();

app.use(bodyParser.urlencoded({
  limit: '100kb',
  extended: true
}))
app.use(bodyParser.json({
  limit: '100kb',
  extended: true
}));

app.use(morgan('dev'));
//  before doing so, check that we are in dev
app.use(errorhandler());

app.get('/getPrintData', frontController.getPrintData);

app.post('/print', frontController.print);

console.log('Sever is runing');
app.listen(3030);
