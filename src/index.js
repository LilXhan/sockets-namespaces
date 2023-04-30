const express = require('express');
const { createServer } = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_, res) => {
  res.sendFile(__dirname, '/public/index.html');
});

const teachers = io.of('teachers');
const students = io.of('students');


teachers.on('connection', socket => {
  socket.on('user', user => {
    socket.broadcast.emit('user connect', user);
  });

  socket.on('send message', data => {
    teachers.emit('user message', data);
  });
});

students.on('connection', socket => {
  socket.on('user', user => {
    socket.broadcast.emit('user connect', user);
  });

  socket.on('send message', data => {
    students.emit('user message', data);
  });
});

httpServer.listen(3000, () => {
  console.log('server running on port http://localhost:3000');
});