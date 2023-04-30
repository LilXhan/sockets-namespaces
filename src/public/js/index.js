const user = prompt('Write your user');

const teachers = ['RetaxMaster', 'JuanDC', 'GNDX'];

let socketNamespace, group;

const chat = document.querySelector('#chat');
const namespace = document.querySelector('#namespace');

if (teachers.includes(user)) {
  socketNamespace = io('/teachers');
  group = 'teachers';
} else {
  socketNamespace = io('/students');
  group = 'students';
}

socketNamespace.on('connect', () => {
  namespace.textContent = group;
  socketNamespace.emit('user', user);
});

socketNamespace.on('user connect', user => {
  const li = document.createElement('li');
  li.textContent = `${user} has connected`
  chat.appendChild(li);
});

// Programming the logic of message delivery

const form = document.querySelector('#form');
form.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  if (data.get('message')) {
    socketNamespace.emit('send message', {message: data.get('message'), user});
  }
});

socketNamespace.on('user message', data => {
  const { message, user } = data;
  const li = document.createElement('li');
  li.textContent = `${user}: ${message}`
  chat.appendChild(li);
});