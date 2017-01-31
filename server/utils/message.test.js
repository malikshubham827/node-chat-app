const expect = require('expect');
let {
  generateMessage
} = require('./message');

describe('generateMessage', () => {
  it('should return the object with passed properties', () => {
    let from = 'jen',
      text = 'hii';
    let message = generateMessage(from, text);
    // expect(message.from).toBe(from);
    // expect(message.text).toBe(text);
    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({
      from,
      text
    });
  });

});
