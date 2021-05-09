<template>
  <v-card flat color="transparent">
    <app-invite-friends v-if="false" />

    <v-list color="transparent">
      <v-list-item>
        <v-list-item-avatar size="55px">
          <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
        </v-list-item-avatar>
        <v-list-item-content class="mt-1">
          <v-list-item-title class="status-activity font-weight-medium">
            Trạng thái của tôi
          </v-list-item-title>
          <v-list-item-subtitle class="content-activity mt-1">
            Nhấn để thêm cập nhật trạng thái
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

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

export default {
  components: {
    AppInviteFriends
  }
};
</script>
