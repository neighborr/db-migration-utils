'use strict';

import BbPromise from 'bluebird';
import { DynamoDB } from 'aws-sdk';

module.exports = (config) => {
  const dynamodb = new DynamoDB({
    region: config.REGION || 'us-east-1',
    endpoint: config.ENDPOINT || 'dynamodb.us-east-1.amazonaws.com',
  });

  return function checkTableStatus(TableName) {
    return new BbPromise((res, rej) => {
      dynamodb.describeTable({TableName}, (err, data) => {
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

        setTimeout(() => {
          console.log(`TableStatus: ${data.Table.TableStatus}`);
          checkTableStatus(TableName).then(res).catch(rej);
        }, 3000);
      });
    });
  };
};

