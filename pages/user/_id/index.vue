<template>
  <v-row class="fill-height mt-n12 pt-4" style="background-color: #efefef">
    <v-app-bar
      fixed
      color="#6A76AB"
      dark
      shrink-on-scroll
      :src="avatar || require(`~/assets/default-avatar-300x300.png`)"
      fade-img-on-scroll
      app
      :scroll-threshold="$vuetify.breakpoint.width"
      :height="($vuetify.breakpoint.width * 202) / 360"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
        ></v-img>
      </template>

      <v-btn icon>
        <v-icon> mdi-arrow-left </v-icon>
      </v-btn>

      <v-app-bar-title>
        {{ name }}
        <div class="text-caption">
          <template v-if="isOnline">
            Đang trực tuyến
          </template>
          <template v-else>
            lần cuối thấy lúc
            <vue-timeagojs :time="lastOnline" :delay="60000" />
          </template>
        </div>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-on="on" v-bind="attrs">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>Chia sẻ</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Sửa</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Xem trong danh bạ</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Xác minh mã bảo mật</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <div style="width: 100%" class="pb-10">
      <v-card
        background-color="white"
        class="px-3 py-4"
        v-if="files.length > 0"
      >
        <div class="mb-2 green-main--text">
          Tệp phương tiện, liên kết và tài liệu
        </div>

        <div class="mt-5 d-flex mx-n1">
          <template v-for="({ file }, index) in files">
            <div :key="index" class="d-inline mx-1">
              <v-img
                v-if="typeofFile(file) === `image`"
                :src="file.src"
                width="72px"
                max-width="72px"
                aspect-ratio="1"
                style="background-color: #000"
              />
              <v-responsive
                :aspect-ratio="1"
                v-else-if="typeofFile(file) === `video`"
                width="100%"
              >
                <video
                  :src="file.src"
                  style="width: 72px; display: block"
                  controls
                ></video>
              </v-responsive>
              <audio
                v-else-if="typeofFile(file) === `audio`"
                :src="file.src"
                style="width: 72px; display: block"
                controls
              ></audio>
              <div class="preview-file-other" v-else>
                <span
                  class="fiv-viv"
                  :class="`fiv-icon-${getIconExt(file.name)}`"
                  style="font-size: 72px"
                ></span>
              </div>
            </div>
          </template>
        </div>
      </v-card>

      <v-card class="mt-4">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title> Tắt âm thông báo </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-switch
                hide-details
                dense
                inset
                color="green-main"
                :input-value="!notify"
                @change="notify = !$event"
              />
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title> Thông báo tùy chỉnh </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                Hiển thị tệp đa phương tiện
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>

      <v-card class="mt-4">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                Tin nhắn tự hủy
              </v-list-item-title>
              <v-list-item-subtitle>
                Tắt
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon color="green-main">
                <v-icon> mdi-timer </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title> Mã hóa </v-list-item-title>
              <v-list-item-subtitle>
                Tin nhắn và cuộc gọi được mã hóa đầu cuối
                .</v-list-item-subtitle
              >
              <v-list-item-subtitle>
                Hãy nhấn để xác minh.
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon color="green-main">
                <v-icon> mdi-lock </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>

      <v-card class="mt-4">
        <v-list>
          <div class="green-main--text px-3 pt-2">
            Giới thiệu và số điện thoại
          </div>

          <v-list-item>
            <v-list-item-content>
              {{ description }}
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                +84 39 414 6080
              </v-list-item-title>
              <v-list-item-subtitle> Di Động </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <div>
                <v-btn icon color="green-main">
                  <v-icon> mdi-message-reply-text </v-icon>
                </v-btn>
                <v-btn icon color="green-main">
                  <v-icon> mdi-phone </v-icon>
                </v-btn>
                <v-btn icon color="green-main">
                  <v-icon> mdi-video </v-icon>
                </v-btn>
              </div>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>

      <v-card class="mt-4">
        <v-list>
          <div class="green-main--text px-3 pt-2">
            Các nhóm chung
          </div>
          <v-list-item v-for="(group, index) in commonGroup" :key="index">
            <v-list-item-avatar>
              <v-img :src="group.avatar" style="background-color: #000"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ group.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{
                  group.members
                    .map(item =>
                      item._id === $auth.user._id ? "Bạn" : item.name
                    )
                    .join(", ")
                }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>

      <v-card class="mt-4">
        <v-list>
          <div class="green-main--text px-3 pt-2">
            Điện thoại khác
          </div>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                +84 39 414 6080
              </v-list-item-title>
              <v-list-item-subtitle> Di Động </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <div>
                <v-btn icon color="green-main">
                  <v-icon> mdi-message-reply-text </v-icon>
                </v-btn>
                <v-btn icon color="green-main">
                  <v-icon> mdi-phone </v-icon>
                </v-btn>
                <v-btn icon color="green-main">
                  <v-icon> mdi-video </v-icon>
                </v-btn>
              </div>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>

      <v-card class="mt-4">
        <v-list class="pa-0">
          <v-list-item class="red--text text--lighten-1">
            <v-list-item-icon>
              <v-icon> mdi-block-helper </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Chặn </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>

      <v-card class="mt-4">
        <v-list class="pa-0">
          <v-list-item class="red--text text--lighten-1">
            <v-list-item-icon>
              <v-icon> mdi-thumb-down </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Báo cáo người liên hệ </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
  </v-row>
</template>

<script>
import typeofFile from "~/helpers/typeofFile";
import getIconExt, { _extname as extname } from "~/helpers/iconExtFile";

export default {
  meta: {
    navbar: false
  },
  async asyncData({ params: { id }, $axios }) {
    const {
      data: {
        description,
        avatar,
        "is-online": isOnline,
        _id,
        name,
        "last-online": lastOnline,
        files,
        commonGroup,
        "is-user": isUser,
        notify
      }
    } = await $axios.get(`/personal/${id}`);

    return {
      description,
      avatar,
      isOnline,
      _id,
      name,
      lastOnline,
      files,
      commonGroup,
      isUser,
      notify
    };
  },
  watch: {
    async notify(newValue) {
      if (newValue) {
        await this.$axios.put(`/chat/${this.$route.params.id}/notify`, {
          turn: true
        });
      } else {
        await this.$axios.put(`/chat/${this.$route.params.id}/notify`, {
          turn: false
        });
      }
    }
  },
  methods: {
    typeofFile,
    getIconExt,
    extname
  }
};
</script>
