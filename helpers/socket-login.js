export default (socket, token) => {
  socket.emit("auth", token);
};
