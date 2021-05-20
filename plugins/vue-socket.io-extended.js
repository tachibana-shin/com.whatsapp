import Vue from "vue";
import VueSocketIOExtended from "vue-socket.io-extended";
import io from "socket.io-client";

const socket = io(process.env.WSL_URL || process.env.API_URL, {
  debug: process.env.NODE_ENV === "development"
});

export default ({ store }) => {
  Vue.use(VueSocketIOExtended, socket, { store });
};
