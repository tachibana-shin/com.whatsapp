<template>
  <v-list color="transparent" two-line>
    <v-list-item  v-for="(item, index) in list" :key="index" :to="`/chat/${item._id}`">
      <v-list-item-avatar size="55px" style="overflow: visible">
        <v-img :src="item.avatar || require(`~/assets/default-avatar-300x300.png`)"> </v-img>
        <div class="addon" v-if="false">
          <v-icon size="15px"> mdi-plus </v-icon>
        </div>
      </v-list-item-avatar>
      <v-list-item-content class="ml-1">
        <v-list-item-title class="status-activity font-weight-medium">
          {{ item.name }}
        </v-list-item-title>
        <v-list-item-subtitle class="content-activity mt-1">
          {{ item.lastMess }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <span class="status-time"> {{ new Date(item.time).toLocaleTimeString() }} </span>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true
    }
  }
}
</script>

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

.status-time {
  font-size: 14px;
  color: #757575 !important;
}
</style>
