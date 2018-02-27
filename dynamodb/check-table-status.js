'use strict';

import { DynamoDB } from 'aws-sdk';

module.exports = (config) => {
  const dynamodb = new DynamoDB({
    region: config.REGION || 'us-east-1',
    endpoint: config.ENDPOINT || 'dynamodb.us-east-1.amazonaws.com',
  });

  return function checkTableStatus(TableName, next) {
    return new Promise((res, rej) => {
      dynamodb.describeTable({TableName}, (err, data) => {
        console.log('describing table');

        if (err) {
          console.log('rejecting describeTable');
          return rej(new Error(err));
        }

        if (data.Table.TableStatus === 'ACTIVE') {
          console.log('table is ACTIVE');
          console.log(data.Table);
          console.log('exiting');

          next();
          return res();
        }

        setTimeout(() => {
          console.log(`TableStatus: ${data.Table.TableStatus}`);
          checkTableStatus(TableName, next).then(res).catch(rej);
        }, 3000);
      });
    });
  };
};

