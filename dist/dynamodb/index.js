'use strict';

var _checkTableStatus = require('./check-table-status');

var _checkTableStatus2 = _interopRequireDefault(_checkTableStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (config) {
  return {
    checkTableStatus: (0, _checkTableStatus2.default)(config)
  };
};