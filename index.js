var request = require('request');
var fs = require('fs');
var moment = require('moment');
var config = require('./config.js');

// JSON output of the spreadsheet result
console.log('Current time: ' + moment().format());
request(config.googleSpreadsheet, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    obj = JSON.parse(body);
    
    arr = obj[config.sheetName];
    for (i = 0; i < arr.length ; i++) {
      el = arr[i];
      var key = el.Start_Date + el.Tag;
      if (!moment(el['Start_Date']).isAfter()) {
        console.log('Skipping ' + el['Start_Date']);
        continue;
      }
      var dayOfWeek = moment(el['Start_Date']).format('ddd');
      if (dayOfWeek.indexOf('Sat') === 0) {
        dayOfWeek = '星期六';
      } else if (dayOfWeek.indexOf('Wed') === 0) {
        dayOfWeek = '星期三';
      } else {
        dayOfWeek = '';
      }

      var options = {
        url: 'https://android.googleapis.com/gcm/send'
      , headers: {
          'Content-Type': 'application/json'
        , 'Authorization': 'key=' + config.gcmAuth
        }
      , method: 'POST'
      , json: true
      , body: {
          data: {
            title: el['Start_Date'].substr(0, 10) + dayOfWeek + el['Tag'] + '賣旗機構'
          , orgName: el['Headline']
          , description: el['Text']
          , orgLink: el['Media_Caption']
          }
        , registration_ids: [
            config.devRegId
          ]
        }
      };

      var apiCallback = function(err,httpResponse,body) {
        console.log(body);
      };
      request(options, apiCallback);

      // currently only send the nearest event
      break;
    }
  }
})

