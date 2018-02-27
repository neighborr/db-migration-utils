import checkTableStatus from './check-table-status';

module.exports = (config) => {
  return {
    checkTableStatus: checkTableStatus(config),
  };
};

