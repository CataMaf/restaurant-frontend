
import { io } from 'socket.io-client';

const socket = io('http://192.168.0.101:4000', { autoConnect: false });


socket.on('connect', () => {
  console.log('Conexiune WebSocket inițializată din socket.js');
});

socket.on('disconnect', () => {
  console.log('Conexiune WebSocket întreruptă din socket.js');
});

export default socket;
