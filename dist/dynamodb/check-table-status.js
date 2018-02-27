'use strict';

var _awsSdk = require('aws-sdk');

module.exports = function (config) {
  var dynamodb = new _awsSdk.DynamoDB({
    region: config.REGION || 'us-east-1',
    endpoint: config.ENDPOINT || 'dynamodb.us-east-1.amazonaws.com'
  });

  return function (TableName, next) {
    return new Promise(function (res, rej) {
      dynamodb.describeTable({ TableName: TableName }, function (err, data) {
        console.log('describing table');

        if (err) {
          console.log('rejecting describeTable');
          return rej(new Error(err));
        }

        if (data.Table.TableStatus === 'ACTIVE') {
          res();

          console.log('table is ACTIVE');
          console.log(data.Table);
          console.log('exiting');
          return next();
        }

        setTimeout(function () {
          checkStatus(next);
        }, 3000);
      });
    });
  };
};