let users = [];

// join user to chat

const userJoin = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

// get current user
const getCurrentUser = (id) => users.find((el) => el.id === id);

// user leaves the chat

const userLeave = (id) => {
  const newUsers = users.filter((el) => el.id !== id);
  console.log(newUsers);
  return (users = newUsers);
};

// get room users
const getRoomUsers = (room) => users.filter((el) => el.room === room);

module.exports = {
  userJoin,
  getCurrentUser,
  getRoomUsers,
  userLeave,
};
