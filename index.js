var request = require('request');
var fs = require('fs');
var moment = require('moment');
var config = {
    googleSpreadsheet: 'https://script.googleusercontent.com/a/macros/9gag.com/echo?user_content_key=5rB_V-GfLXa_VleYhJ17wJFhHzV7acDoGNlscBb4syuXE3rCLBGjRr4GTzZylfoFZxy1evj789I8hkXEF2MovbOq8QdZwM4wOJmA1Yb3SEsKFZqtv3DaNYcMrmhZHmUMi80zadyHLKAt-QELwJMLee8rPozBcotHtMyUQ50rEcTzW_eLHFbxIysVmuTfZaYEmUf1nKd3HdDN-fqX8Tw_b4mIOSv_1lOby1QSCbpxgpH5ispxt-K_YnyPKHFW471ddrx5_-y6IJwMC8qrsYZYetKv-L8akWNg7RE4Wg6mM2v8PXHli4Hd-rVpARzRnnDp&lib=M0klXLQOsKcIM4m86X8_CevqWUX6-vu4W'
  , sheetName: 'od1'
}

// JSON output of the spreadsheet result
request(config.googleSpreadsheet, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    obj = JSON.parse(body);
    
    arr = obj[config.sheetName];
    // for (i = 0; i < arr.length ; i++) {
    for (i = 0; i < 1 ; i++) {
      el = arr[i];
      var key = el.Start_Date + el.Tag;
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
        , 'Authorization': 'key=THIS IS A PLACE HOLDER'
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
            ""
          ]
        }
      };

      var apiCallback = function(err,httpResponse,body) {
        console.log(body);
      };
      request(options, apiCallback);
    }
  }
})

