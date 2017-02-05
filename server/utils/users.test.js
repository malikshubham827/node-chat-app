const {Users} = require('./users');
const expect = require('expect');

describe('Users', () => {

var userArray;

beforeEach(() => {
   userArray = new Users();
  userArray.users = [{
    id: '1',
    name: 'Shubham',
    room: 'the billionaire club'
  }, {
    id: '2',
    name: 'Siddhant',
    room: 'the millionaire club'
  }, {
    id: '3',
    name: 'Sarthak',
    room: 'the billionaire club'
  }, {
    id: '4',
    name: 'Rishabh',
    room: 'the millionaire club'
  }];
});

  it('should add a new user', () => {
    var user = {
      id: '123425252',
      name: 'hahahah',
      room: 'hehe'
    };
    var resUser = userArray.addUser(user.id, user.name, user.room);
    expect(userArray.users).toInclude(user);
  });

  it('should remove user', () => {
    let id = '2';
    let resUser = userArray.removeUser(id);
    expect(resUser).toExist();
    expect(resUser.id).toBe(id);
  });

  it('should not remove user', () => {
    let id = '5';
    let resUser = userArray.removeUser(id);
    expect(resUser).toNotExist();
  });

  it('should get user', () => {
    let id = '1';
    var resUser = userArray.getUser(id);
    expect(resUser).toEqual(userArray.users[0]);
  });

  it('should not get user', () => {
    let id = '12345';
    var resUser = userArray.getUser(id);
    expect(resUser).toNotExist();
  });

  it('should return user list', () => {
    var room = 'the billionaire club';
    var res = userArray.getUserList(room);
    expect(res.length).toBe(2);
  });

});
