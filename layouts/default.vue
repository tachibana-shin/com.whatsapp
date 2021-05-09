<template>
  <v-app dark>
    <v-app-bar app fixed height="56px" color="#075e55">
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
    <v-main>
      <v-container>
          <nuxt />
      </v-container>
    </v-main>

    <v-teleport-location name="root" />
    <v-teleport-location name="fab" />
  </v-app>
</template>
