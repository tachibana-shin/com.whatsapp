<template>
  <v-card flat color="transparent" class="fill-height" width="100%">
    <app-invite-friends v-if="false" />

    <app-list class="pa-0 mx-n2" :list="list" />

    <v-teleport to="fab">
      <v-fab-transition>
        <v-btn color="green-light" dark fab absolute bottom right style="bottom: 16px">
          <v-icon> mdi-android-messages </v-icon>
        </v-btn>
      </v-fab-transition>
    </v-teleport>
  </v-card>
</template>

<script>
import AppInviteFriends from "~/components/AppInviteFriends";
import AppList from "../components/AppList.vue";

export default {
  components: {
    AppInviteFriends,
    AppList
  },
  async asyncData({ $axios }) {
    const { data } = await $axios.get("/chat");

    return {
      list: data
    };
  },
  sockets: {
    "new message"({ _id, body: { content, mysend } }) {
      /* --------------------------- find if exists chat -------------------------- */
      const chat = this.list.find(item => item._id === _id);

      if (chat) {
        /// update count message not read
        chat.count++;
        chat.lastMess = content;
        chat.mysend = mysend;
      } else {
        /* -------------------------------------------------------------------------- */
        this.$socket.client.emit("give me information chat", _id);
      }
    },
    "new chat"(body) {
      if (this.list.some(item => item._id === body._id) === false) {
        this.lists.unshift(body);
      }
    }
  }
};
</script>
