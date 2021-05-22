<template>
  <v-app dark>
    <v-app-bar
      app
      fixed
      height="56px"
      color="green-main"
      v-if="!$store.state.meta || $store.state.meta.navbar !== false"
      dark
    >
      <v-app-bar-title> WhatsApp </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon> mdi-magnify </v-icon>
      </v-btn>

      <v-menu left bottom transition="scroll-y-reverse-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon> mdi-dots-vertical </v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>Nhóm mới</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Danh sách nhận tin mới</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>WhatsApp Web</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Tin nhắn đã sao lưu</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Cài đặt</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <template v-slot:extension>
        <v-tabs color="#fff" dark slider-color="#fff">
          <v-tab
            :style="{
              'min-width': 0
            }"
            class="px-0"
            to="/camera"
          >
            <v-btn icon>
              <v-icon> mdi-camera </v-icon>
            </v-btn>
          </v-tab>
          <v-tab to="/">
            Trò chuyện
          </v-tab>
          <v-tab to="/activity">
            Trạng thái
          </v-tab>
          <v-tab to="/calls">
            Cuộc gọi
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main fill-height>
      <v-container fill-height>
        <nuxt />
      </v-container>
    </v-main>

    <client-only>
      <v-teleport-location name="root" />
      <v-teleport-location name="fab" class="fab" />
    </client-only>
    <vue-toast-group />
  </v-app>
</template>

<script>
import socketLogin from "~/helpers/socket-login";
import socketOnline from "~/helpers/socket-online";

export default {
  fetchOnServer: false,
  async fetch() {
    socketLogin(this.$socket.client, this.$auth.strategy.token.get());
    socketOnline(this.$socket.client);
  }
};
</script>

<style lang="scss" scoped>
.fab {
  position: fixed; /// くるってる
  bottom: 0;
  right: 0;
}
</style>
