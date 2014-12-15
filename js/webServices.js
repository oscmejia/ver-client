var request = require('request');

function doRequest(url, data, callback) {
  request.post({
    url : url,
    json: true,
    body : {data : data}
  }, function(error, response, body) {
    var info = {
      error: error,
      response: response,
      body: body
    };
    callback(info);
  });
}

exports.doRequest = doRequest;
