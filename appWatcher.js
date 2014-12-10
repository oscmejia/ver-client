var fs = require('fs');
var chokidar = require('chokidar');

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
    fs.readFile(path, "utf8", function (err, data) {
      if(data){
        console.log('File contains data, checking keywords');
        if((data.search('Vendedor') !== -1) && (data.search('FACTURA') !== -1) && (data.search('T O T A L') !== -1) && (data.search('Fecha') !== -1)){
          console.log('All key words found, calling parseBill function');
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
  });
}

if(G.settings.path2){
  chokidar.watch(G.settings.path2, {ignored: /[\/\\]\./, persistent: true, useFsEvents: G.settings.useFs, ignoreInitial: true}).on('add', function(path) {
    console.log('Add file event detected on folder 2: '+path);
    fs.readFile(path, "utf8", function (err, data) {
      if(data){
        console.log('File contains data, checking keywords');
        if((data.search('Vendedor') !== -1) && (data.search('FACTURA') !== -1) && (data.search('T O T A L') !== -1) && (data.search('Fecha') !== -1)){
          console.log('All key words found, calling parseBill function');
          var url = G.settings.ip_address+':'+G.settings.port+'/parseBill';
          WebServices.doRequest(url, data, function(response) {

          });
        }else{
          console.log('Keyword  Vendedor search result: '+(data.search('Vendedor')));
          console.log('Keyword  FACTURA search result: '+(data.search('FACTURA')));
          console.log('Keyword  T O T A L search result: '+(data.search('T O T A L')));
          console.log('Keyword  Fecha search result: '+(data.search('Fecha')));
        }
      }
    });
  });
}
