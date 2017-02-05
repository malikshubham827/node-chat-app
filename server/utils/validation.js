const _ = require('lodash');

var isRealString = (str) => {
  return typeof str === 'string' && str.trim().length > 0 && Number.isNaN(_.toNumber(str));
};

module.exports = {
  isRealString
}
