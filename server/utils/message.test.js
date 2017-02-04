const expect = require('expect');
let {
  generateMessage,
  generateLocationMessage
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

describe('generateLocationMessage', () => {
  it('should return the location message object', () => {
    let latitude = 23.346322, longitude = 45.34525513;
    let from = 'Admin';
    let message = generateLocationMessage(from, latitude, longitude);
    expect(message.createdAt).toBeA('number');
    expect(message.from).toBe(from);
    expect(message.url).toBe('https://www.google.com/maps?q=23.346322,45.34525513');
  });
});
