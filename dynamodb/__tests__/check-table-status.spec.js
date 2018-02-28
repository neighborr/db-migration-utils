describe('checkTableStatus', () => {
  let checkTableStatus,
    mocks;

  beforeEach(() => {
    mocks = {
      config: {
        REGION: 'fake-aws-region',
        ENDPOINT: 'fake-aws-endpoint',
      },
      data: {
        Table: {
          TableStatus: 'ACTIVE',
        },
      },
    };

    mocks.describeTable = jest.fn((TableName, cb) => {
      if (mocks.err) return cb(mocks.err);

      cb(null, mocks.data);
    });

    jest.mock('aws-sdk', () => ({
      DynamoDB: () => ({
        describeTable: mocks.describeTable,
      }),
    }));

    const oldTimeout = global.setTimeout;

    mocks.setTimeout = jest.fn((cb, int) => {
      oldTimeout(cb, int);
    });

    global.setTimeout = mocks.setTimeout;

    checkTableStatus = require('../check-table-status');
  });

  it('describes a table', async () => {
    const TableName = 'Profiles';
    await checkTableStatus(mocks.config)(TableName, () => null);

    expect(mocks.describeTable).toBeCalled();

    const call = mocks.describeTable.mock.calls[0];
    expect(call[0]).toEqual({TableName});
  });

  it('polls Dynamo until it is Active', async () => {
    mocks.data.Table.TableStatus = 'CREATING';

    const TableName = 'Messages';

    setTimeout(() => {
      console.log('CHANGING STATUS');
      mocks.data.Table.TableStatus = 'ACTIVE';
    }, 0);

    await checkTableStatus(mocks.config)(TableName);

    expect(mocks.setTimeout.mock.calls.length).toBe(2);
  });

  it('errors out correctly is check fails', async () => {
    const TableName = 'TerribleThings';

    mocks.err = {
      code: '123',
      name: 'YouSuckException',
      message: 'You suck. Here is an error',
    };

    expect(checkTableStatus(mocks.config)(TableName))
      .rejects
      .toEqual(mocks.err);
  });
});

