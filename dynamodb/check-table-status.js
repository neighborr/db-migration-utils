'use strict';

import { DynamoDB } from 'aws-sdk';

module.exports = (config) => {
  const dynamodb = new DynamoDB({
    region: config.REGION || 'us-east-1',
    endpoint: config.ENDPOINT || 'dynamodb.us-east-1.amazonaws.com',
  });

  return (TableName, next) => new Promise((res, rej) => {
    dynamodb.describeTable({TableName}, (err, data) => {
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

      setTimeout(() => {
        checkStatus(next);
      }, 3000);
    });
  });
};

