<template>
  <v-card flat color="transparent">
    <v-list color="transparent" two-line class="pa-0 mx-n2">
      <v-list-item>
        <v-list-item-avatar size="55px" style="overflow: visible">
          <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"> </v-img>
          <div class="addon">
            <v-icon size="15px"> mdi-plus </v-icon>
          </div>
        </v-list-item-avatar>
        <v-list-item-content class="ml-1">
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
      <div>
        <v-fab-transition>
          <v-btn color="#00cc3f" fab absolute bottom right style="bottom: 16px">
            <v-icon> mdi-camera </v-icon>
          </v-btn>
        </v-fab-transition>

        <v-btn
          color="#edf5f7"
          fab
          absolute
          bottom
          right
          class="black--text"
          width="45px"
          height="45px"
          small
          style="bottom: 85px; right: 24px; transform: translateX(0%)"
        >
          <v-icon> mdi-pencil </v-icon>
        </v-btn>
      </div>
    </v-teleport>
  </v-card>
</template>

<style lang="scss" scoped>
.status-activity {
  font-size: 17px;
  font-weight: 400;
}
.content-activity {
  font-size: 15px;
  color: #757575 !important;
  margin-top: 4px;
}
.addon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgb(0, 204, 63);
  border-color: rgb(0, 204, 63);
  position: absolute;
  bottom: -5px;
  right: 0;
}
</style>
