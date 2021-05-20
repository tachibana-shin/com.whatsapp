let interval;

export default socket => {
  clearInterval(interval);
  setInterval(() => {
    socket.emit("my online");
  }, 60000);
};
