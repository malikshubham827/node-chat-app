const {isRealString} = require('./validation');
const expect = require('expect');

describe('isRealString', () => {
  it('should return false for empty string with spaces', () => {
    var res = isRealString('     ');
    expect(res).toBe(false);
  });

  it('should return error for only number', () => {
    var res = isRealString('3');
    expect(res).toBe(false);
  });

  it('should allow special characters', () => {
    var res = isRealString('@#2');
    expect(res).toBe(true);
  });

  it('should return true for string values', () => {
    var res = isRealString('haha');
    expect(res).toBe(true);
  })
})
