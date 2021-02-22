const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// get username and room from url

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const socket = io();

// join chatRoom
socket.emit('joinRoom', { username, room });

// get rooms and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// receiving request from server

socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// MESSAGE SUBMUT
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // we have selected only the form so to get the input element we have to do e.target.elements.msg.value
  const msg = e.target.elements.msg.value;
  //   console.log(msg);

  // Emit message to server
  socket.emit('chatMessage', msg);
  // clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// OUTPUT message to DOM
const outputMessage = (message) => {
  const div = document.createElement('div');
  div.classList.add('message');
  const { username, text, time } = message;
  div.innerHTML = ` <p class="meta">${username} <span>${time}</span></p>
  <p class="text">
     ${text}
  </p>`;

  document.querySelector('.chat-messages').appendChild(div);
};

// add room name to DOM
const outputRoomName = (room) => {
  roomName.innerText = room;
};

// add user to DOm
const outputUsers = (users) => {
  userList.innerHTML = `


    ${users.map((el) => `<li>${el.username}</li>`).join('')}
    `;
};
