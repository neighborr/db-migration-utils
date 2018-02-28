'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _awsSdk = require('aws-sdk');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (config) {
  var dynamodb = new _awsSdk.DynamoDB({
    region: config.REGION || 'us-east-1',
    endpoint: config.ENDPOINT || 'dynamodb.us-east-1.amazonaws.com'
  });

  return function checkTableStatus(TableName) {
    return new _bluebird2.default(function (res, rej) {
      dynamodb.describeTable({ TableName: TableName }, function (err, data) {
        console.log('describing table');

        if (err) {
          console.log('rejecting describeTable');
          return rej(err);
        }

        if (data.Table.TableStatus === 'ACTIVE') {
          console.log('table is ACTIVE');
          console.log(data.Table);
          console.log('exiting');

          return res();
        }

        setTimeout(function () {
          console.log('TableStatus: ' + data.Table.TableStatus);
          checkTableStatus(TableName).then(res).catch(rej);
        }, 3000);
      });
    });
  };
};