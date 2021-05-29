<template>
  <v-card flat color="transparent" class="fill-height" width="100%">
    <app-invite-friends v-if="list.length === 0" />

    <v-list class="pa-0 mx-n2" color="transparent" multiple v-else>
      <v-list-item
        v-for="(item, index) in list"
        :key="index"
        :to="`/chat/${item._id}`"
      >
        <v-list-item-avatar size="55px" style="overflow: visible">
          <app-avatar
            :offset-x="12"
            :offset-y="12"
            :src="item.avatar"
            :online="isOnline(item.members)"
            :size="55"
          />
        </v-list-item-avatar>

        <v-list-item-content class="ml-1">
          <v-list-item-title class="status-activity font-weight-medium">
            <div class="d-flex align-center justify-space-between">
              {{ item.name }}

              <v-list-item-action-text>
                <vue-timeagojs
                  :time="getLastTime(item)"
                  locale="vi-VN"
                  :delay="60000"
                />
              </v-list-item-action-text>
            </div>
          </v-list-item-title>
          <v-list-item-subtitle
            class="content-activity mt-1"
            :class="
              item[`unread-count`] === 0
                ? undefined
                : $vuetify.theme.isDark
                ? `grey--text text-lighten-5`
                : `grey--text text--darken-4`
            "
          >
            <div class="d-flex align-center justify-space-between">
              <span class="text-truncate">
                <template v-if="item.wroting">
                  Đang soạn tin
                </template>
                <template v-else-if="isEmpty(item[`last-message`])">
                  {{ item.creator }} đã tạo nhóm
                </template>
                <template v-else>
                  {{ item[`last-message`].isend ? "You: " : "" }}
                  {{ item[`last-message`].body }}
                </template>
              </span>

              <span
                class="count-message-noread green-light"
                v-if="item[`unread-count`] > 0"
              >
                <v-list-item-action-text class="white--text">
                  {{ item[`unread-count`] }}
                </v-list-item-action-text>
              </span>
            </div>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-teleport to="fab">
      <v-fab-transition>
        <v-btn
          color="green-light"
          dark
          fab
          absolute
          bottom
          right
          style="bottom: 16px"
        >
          <v-icon> mdi-android-messages </v-icon>
        </v-btn>
      </v-fab-transition>
    </v-teleport>
  </v-card>
</template>

<script>
import { format } from "timeago.js";
import AppAvatar from "../components/AppAvatar.vue";
import isOnline from "~/helpers/isOnline";
import setIOnline from "~/helpers/setIOnline";
import setIOffline from "~/helpers/setIOffline";
import isEmpty from "lodash.isempty";

export default {
  components: { AppAvatar },
  sockets: {
    "new chat"(chat) {
      this.list.unshift(chat);
    },
    async "new message"(roomId, message) {
      const chatIndex = this.list.findIndex(item => item.roomId === roomId);
      const chat = this.list[chatIndex];

      if (chat) {
        chat["last-message"] = message;

        if (message.sender !== this.$auth.user._id) {
          chat["unread-count"] += 1;
        }

        if (chatIndex > 0) {
          this.list.splice(chatIndex, 1);
          this.list.unshift(chat);
        }
      } else {
        //// if this is new chat or old chat . request to server require information chat

        try {
          this.list.unshift(
            (await this.$axios.get(`/chat/${roomId}/info`)).data
          );
        } catch {
          console.log(
            `Warn: Can't find chat a parent message ${message._id} from chat id ${roomId}`
          );
        }
      }
    },
    "i online"(id) {
      this.list.forEach(({ members }) => {
        setIOnline(members, id);
      });
    },
    "i offline"(id, lastTime) {
      this.list.forEach(({ members }) => {
        setIOffline(members, id, lastTime);
      });
    }
  },
  async asyncData({ $axios }) {
    const { data } = await $axios.get("/chat");

    return {
      list: data
    };
  },
  methods: {
    isOnline,
    isEmpty,
    getLastTime(item) {
      return new Date(
        Math.max(
          ...[item.created, item[`last-message`]?.created]
            .filter(Boolean)
            .map(item => new Date(item).getTime())
        )
      ).getTime();
    }
  }
};
</script>

<style lang="scss" scoped src="~/scss/AppList.scss"></style>
