import io from 'socket.io-client';
// const socket = io('106.14.136.219:4005');
const socket = io('127.0.0.1:3000');
socket.on('err',function(data){
    alert(data);
});
export default socket;