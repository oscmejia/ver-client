var request = require('request');

function doRequest(url, data, callback) {
  request.post({
    url : url,
    json: true,
    body : {data : data}
  }, function(error, response, body) {
    callback(body);
  });
}

exports.doRequest = doRequest;
