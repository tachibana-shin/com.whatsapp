<template>
  <v-card flat color="transparent" class="fill-height">
    <app-invite-friends v-if="false" />

    <app-list class="pa-0 mx-n2" :list="list" />

    <v-teleport to="fab">
      <v-fab-transition>
        <v-btn color="#00cc3f" fab absolute bottom right style="bottom: 16px">
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
  }
};
</script>
