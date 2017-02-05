class Users {
  constructor () {
    this.users = [];
  }
  addUser(id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }

  getUser(id) {
    return this.users.filter((usr) => usr.id === id)[0];
  }

  removeUser(id) {
    // also return the removed user
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((usr) => usr.id !== id);
    }

    return user;
  }

  getUserList(room) {
    var users = this.users.filter((user) => user.room === room);
    var arr = users.map((usr) => usr.name);
    return arr;
  }
};

module.exports = {Users};
