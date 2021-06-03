<template>
  <v-card flat color="transparent" class="fill-height" width="100%">
    <div class="chat--background"></div>

    <v-app-bar app fixed height="56px" color="green-main" dark>
      <v-btn icon @click="$router.back()">
        <v-icon> mdi-arrow-left </v-icon>
      </v-btn>
      <app-avatar
        :src="avatar"
        :online="isOnline"
        :size="37"
        :to="`/user/${id}`"
      />
      <nuxt-link
        tag="div"
        :to="`/user/${id}`"
        class="ml-3 my-n1 d-flex flex-column justify-center"
        style="max-width: 300px; width: 100%; height: 100%; padding: 4px 0"
        v-ripple
      >
        <div
          class="font-weight-regular text--white text-truncate"
          style="font-size: 18px; line-height: 1"
        >
          {{ name }}
        </div>
        <div
          class="font-weight-regular text-truncate status"
          style="
            font-size: 13.2px;
            line-height: 1;
            color: #e4e7f6;
            margin-top: 3px;
          "
        >
          <template v-if="peopleComposing.length > 0">
            {{
              isPrivate
                ? "Đang trả lời"
                : peopleComposing.map(item => item.name).join(", ") +
                  " đang trả lời"
            }}
          </template>
          <template v-else>
            <template v-if="isOnline">
              Online
            </template>
            <template v-else>
              <vue-timeagojs
                v-if="isPrivate"
                :time="lastOnline"
                locale="vi-VN"
                :delay="60000"
              />
              <template v-else>
                You and {{ members.length }} members other.
              </template>
            </template>
          </template>
        </div>
      </nuxt-link>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon> mdi-video </v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon> mdi-phone </v-icon>
      </v-btn>

      <client-only>
        <v-menu left bottom transition="scroll-y-reverse-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item :to="`/user/${id}`">
              <v-list-item-title>Xem người liên hệ</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title :to="`/user/${id}/media`"
                >Tệp phương tiện, liên kết và tài liệu</v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Tìm kiếm</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Tắt âm thông báo</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Hình nền</v-list-item-title>
            </v-list-item>
            <v-menu left bottom transition="scroll-y-reverse-transition">
              <template v-slot:activator="{ on, attrs }">
                <v-list-item v-on="on" v-bind="attrs">
                  <v-list-item-title> Thêm </v-list-item-title>
                  <v-list-item-action>
                    <v-icon> mdi-menu-right </v-icon>
                  </v-list-item-action>
                </v-list-item>
              </template>

              <v-list>
                <v-list-item>
                  <v-list-item-title>Báo cáo</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Chặn</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Xóa cuộc trò chuyện</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Xuất cuộc trò chuyện</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Thêm lối tắt</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list>
        </v-menu>
      </client-only>
    </v-app-bar>

    <div class="chat--frame ma-n3 px-3">
      <client-only>
        <vue-infinite-loading
          direction="top"
          @infinite="loadMoreOldMessage"
          spinner="circles"
        >
          <span slot="no-more"></span>
          <span slot="no-results"></span>
        </vue-infinite-loading>
      </client-only>

      <div
        class="time"
        :style="{
          color: $vuetify.theme.isDark
            ? `rgba(255, 255, 255, 0.8)`
            : `rgba(0, 0, 0, 0.8)`
        }"
      >
        12:10 CH
      </div>
      <template
        v-for="({ body, created, endorsed, sender, isend, sent = true },
        index) in messages"
      >
        <div
          class="message"
          :class="{
            'my-message': isend
          }"
          :key="index"
          ref="message"
        >
          <div class="message--inner">
            <div class="sender" v-if="isend === false">
              {{ getNameSender(sender) }}
            </div>
            <section
              class="inner file"
              v-if="body.file && isEmpty(body.file) === false"
              :class="{
                'other mb-0': isFileOther(body.file.type)
              }"
            >
              <v-img
                v-if="typeofFile(body.file) === `image`"
                :src="body.file.src"
                :width="body.file.ratio < 1 ? 226 : 251"
                :aspect-ratio="
                  body.file.ratio < 1 ? 226 / 316 : Math.min(1, body.file.ratio)
                "
                @load="revokeBlob(body.file.src)"
                style="background-color: #000"
                class="d-block"
              />
              <v-responsive
                :aspect-ratio="
                  body.file.ratio < 1 ? 226 / 316 : body.file.ratio
                "
                v-else-if="typeofFile(body.file) === `video`"
                width="100%"
              >
                <app-video
                  :src="body.file.src"
                  style="width: 100%; display: block"
                  controls
                  @loadedmetadata="revokeBlob(body.file.src)"
                ></app-video>
                <span class="time time-video">
                  <span class="time--box">
                    <v-icon size="1.5em"> mdi-video </v-icon>
                    {{ moment(body.file.duration * 1000).format("mm:ss") }}
                  </span>
                </span>
              </v-responsive>
              <app-audio
                v-else-if="typeofFile(body.file) === `audio`"
                :src="body.file.src"
                style="width: 100%; display: block"
                controls
                @loadedmetadata="revokeBlob(body.file.src)"
              ></app-audio>
              <div class="preview-file-other" v-else>
                <div class="d-flex align-center">
                  <div class="file--icon">
                    <span
                      class="fiv-viv"
                      :class="`fiv-icon-${getIconExt(body.file.name)}`"
                    ></span>
                  </div>
                  <div class="file--name font-weight-regular ml-3">
                    {{ body.file.name }}
                  </div>
                </div>

                <div class="d-flex justify-space-between">
                  <span
                    class="time ml-0 text-uppercase"
                    style="text-align: left; float: none"
                  >
                    <template v-if="body.file.size">
                      {{ filesize(body.file.size || 0) }} •
                    </template>
                    {{ extname(body.file.name) }}
                  </span>
                  <span class="time" style="float: none">
                    {{ moment(created).format("hh:mm") }}
                    <v-icon
                      size="16"
                      class="ml-1"
                      v-if="isend"
                      :color="endorsed.length > 0 ? `blue` : undefined"
                    >
                      {{
                        sent
                          ? endorsed.length > 0
                            ? "mdi-check-all"
                            : "mdi-check"
                          : "mdi-clock-outline"
                      }}
                    </v-icon>
                  </span>
                </div>
              </div>
            </section>
            <section class="inner" v-else>{{ body.content }}</section>

            <span
              class="time"
              v-if="!body.file || !isFileOther(body.file.type)"
            >
              <span class="time--box">
                {{ moment(created).format("hh:mm") }}
                <v-icon
                  size="16"
                  class="ml-1"
                  v-if="isend"
                  :color="endorsed.length > 0 ? `blue` : undefined"
                >
                  {{
                    sent
                      ? endorsed.length > 0
                        ? "mdi-check-all"
                        : "mdi-check"
                      : "mdi-clock-outline"
                  }}
                </v-icon>
              </span>
            </span>
            <div class="clearfix"></div>
          </div>
        </div>
      </template>
    </div>

    <div class="textbox--bottom pb-1">
      <div class="chat--background"></div>
      <div class="d-flex justify-space-between">
        <div
          class="d-flex align-center justify-space-between input__slot white"
        >
          <v-btn
            icon
            class="icon order-0"
            @click="emojiPickerOn = !emojiPickerOn"
          >
            <v-icon>
              {{ emojiPickerOn ? "mdi-keyboard" : "mdi-emoticon-outline" }}
            </v-icon>
          </v-btn>

          <transition-group
            name="transition--group__slide"
            class="d-flex order-2 mt-auto mb-0"
            tag="div"
          >
            <v-menu
              :nudge-width="500"
              width="340px"
              absolute
              offset-overflow
              key="1"
              content-class="toolbox"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon class="icon" v-on="on" v-bind="attrs">
                  <v-icon> mdi-link-variant mdi-rotate-270 </v-icon>
                </v-btn>
              </template>

              <v-card flat color="white">
                <v-card-text>
                  <v-row class="text-center">
                    <v-col cols="4" v-ripple @click="sendFiles()">
                      <v-avatar size="54px">
                        <v-img :src="require(`~/assets/attach_document.png`)" />
                      </v-avatar>
                      <div class="name">Tài liệu</div>
                    </v-col>
                    <v-col cols="4" v-ripple @click="sendFiles(`image/*`)">
                      <v-avatar size="54px">
                        <v-img :src="require(`~/assets/attach_camera.png`)" />
                      </v-avatar>
                      <div class="name">Camera</div>
                    </v-col>
                    <v-col cols="4" v-ripple>
                      <v-avatar size="54px">
                        <v-img :src="require(`~/assets/attach_gallery.png`)" />
                      </v-avatar>
                      <div class="name">Bộ sưu tập</div>
                    </v-col>
                    <v-col cols="4" v-ripple @click="sendFiles(`audio/*`)">
                      <v-avatar size="54px">
                        <v-img :src="require(`~/assets/attach_audio.png`)" />
                      </v-avatar>
                      <div class="name">Âm thanh</div>
                    </v-col>
                    <v-col cols="4" v-ripple>
                      <v-avatar size="54px">
                        <v-img :src="require(`~/assets/attach_video.png`)" />
                      </v-avatar>
                      <div class="name">Phòng họp mặt</div>
                    </v-col>
                    <v-col cols="4" v-ripple>
                      <v-avatar size="54px">
                        <v-img :src="require(`~/assets/attach_location.png`)" />
                      </v-avatar>
                      <div class="name">Vị trí</div>
                    </v-col>
                    <v-col cols="4" v-ripple>
                      <v-avatar size="54px">
                        <v-img :src="require(`~/assets/attach_contact.png`)" />
                      </v-avatar>
                      <div class="name">Liên hệ</div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-menu>
            <v-btn
              icon
              class="icon"
              v-show="!messageReal"
              key="2"
              @click="sendFiles(`image/*`, false)"
            >
              <v-icon> mdi-camera </v-icon>
            </v-btn>
          </transition-group>

          <div class="textarea order-1" id="textarea">
            <div
              class="textarea__inner"
              contenteditable
              @input="message = $event.target.innerHTML"
              ref="textarea__inner"
              :style="{
                height:
                  !!messageReal && $refs.textarea__inner
                    ? `${$refs.textarea__inner.scrollHeight}px`
                    : undefined
              }"
              @keydown.exact.enter.prevent.stop="onEnter"
              @keydown.exact.enter.shift="onEnterShift"
              @focus="onFocusEdit"
              @blur="onBlurEdit"
            ></div>
            <label for="textarea" class="placeholder" v-show="!message">
              Nhập tin nhắn
            </label>
          </div>
        </div>
        <div class="btn--send__slot">
          <v-btn
            rounded
            dark
            color="green-main"
            class="btn"
            @click="!!message ? sendMessage() : void 0"
          >
            <v-scale-transition origin="center center" mode="out-in">
              <v-icon key="1" v-if="!message"> mdi-microphone </v-icon>
              <v-icon key="2" v-else> mdi-send </v-icon>
            </v-scale-transition>
          </v-btn>
        </div>
      </div>
      <client-only>
        <v-emoji-picker
          class="emoji-picker--bottom"
          v-if="emojiPickerOn"
          @select="
            $refs.textarea__inner.innerHTML += $event.data;
            message = $refs.textarea__inner.innerHTML;
          "
        ></v-emoji-picker>
      </client-only>
    </div>
  </v-card>
</template>

<script>
import { VEmojiPicker } from "v-emoji-picker";
import moment from "moment";
import { socket } from "~/plugins/vue-socket.io-extended";
import socketIOFileClient from "socket.io-file-client";
import VueInfiniteLoading from "vue-infinite-loading";
import isOnline from "~/helpers/isOnline";
import lastOnline from "~/helpers/lastOnline";
import setIOnline from "~/helpers/setIOnline";
import setIOffline from "~/helpers/setIOffline";
import {
  sizeofImage,
  sizeofVideo,
  durationAudio
} from "~/helpers/sizeofSocial";
import { isInViewport } from "~/helpers/offsetElement";
import selectFile from "~/helpers/selectFile";
import isEmpty from "lodash.isempty";
import getIconExt, { _extname as extname } from "~/helpers/iconExtFile";
import typeofFile, {
  isFileOther,
  REGEXP_IMAGE,
  REGEXP_VIDEO,
  REGEXP_AUDIO
} from "~/helpers/typeofFile";
import filesize from "filesize";
import "file-icon-vectors/dist/file-icon-vivid.min.css";

const uploader = new socketIOFileClient(socket);

function setParagrapToBr() {
  try {
    document.execCommand("defaultParagraphSeparator", false, "br");
  } catch {
    console.warn(`Browser not support default-paragraph-separator`);
  }
}
let onScroll;

let idMessageSend = -1;

export default {
  components: {
    VEmojiPicker,
    VueInfiniteLoading
  },
  meta: {
    navbar: false
  },
  async asyncData({ $axios, params: { id } }) {
    const {
      data: {
        _id,
        roomId,
        members,
        private: isPrivate,
        name,
        avatar,
        messages = [],
        notify
      }
    } = await $axios.get(`/chat/${id}`);

    return {
      id: _id,
      roomId,
      members,
      isPrivate,
      name,
      avatar,
      messages,
      notify
    };
  },
  data() {
    return {
      message: "",
      emojiPickerOn: false,
      focusing: []
    };
  },
  computed: {
    messageReal() {
      const message = decodeURIComponent(
        this.message.replace(/<\/? ?br>/gi, "\n")
      )
        .replace(/\&[^\s;]{1,};/g, template => {
          const div = document.createElement("div");
          div.innerHTML = template;

          return div.innerText;
        })
        .replace(/^\s+|\s+$/g, "");
      return message;
    },
    isOnline() {
      return isOnline(this.members);
    },
    lastOnline() {
      return lastOnline(this.members);
    },
    peopleComposing() {
      return this.members.filter(item =>
        this.focusing.some(id => id === item._id)
      );
    }
  },
  watch: {
    messages() {
      setTimeout(() => {
        if (onScroll) {
          onScroll();
        }
      }, 70);
    }
  },
  sockets: {
    "send message__SUCCESS"(chatId, uid, messageID) {
      if (this.id === chatId) {
        const message = this.messages.find(
          item => "uid" in item && item.uid === uid
        );

        if (message) {
          this.$delete(message, "uid");
          message.sent = true;
          this.$set(message, "_id", messageID);
        }
      } else {
        console.log(`Invalid packet ${uid}`);
      }
    },
    "new message"(roomId, message) {
      if (this.roomId === roomId) {
        this.messages.push(message);
      }
      setTimeout(() => {
        this.toEndPage();
      }, 70);
    },
    "read message"(roomId, idSender, beforeId) {
      if (this.roomId === roomId) {
        for (
          let index = 0, length = this.messages.length;
          index < length;
          index++
        ) {
          const message = this.messages[index];

          if (
            (message.isend === true
              ? idSender !== this.$auth.user._id
              : true) &&
            message.endorsed.indexOf(idSender) === -1
          ) {
            message.endorsed.push(idSender);
          }

          if (message._id === beforeId) {
            break;
          }
        }
      }
    },
    "created chat"(id, roomId) {
      this.roomId = roomId;
    },
    "i online"(id) {
      setIOnline(this.members, id);
    },
    "i offline"(id, lastTime) {
      setIOffline(this.members, id, lastTime);
    },
    "i focus"(roomId, userId) {
      if (this.roomId === roomId) {
        if (this.focusing.every(item => item !== userId)) {
          this.focusing.push(userId);
        }
      }
    },
    "i blur"(roomId, userId) {
      if (this.roomId === roomId) {
        this.focusing = this.focusing.filter(item => item !== userId);
      }
    }
  },
  methods: {
    moment,
    isEmpty,
    getIconExt,
    extname,
    typeofFile,
    isFileOther,
    filesize,
    onFocusEdit() {
      this.$socket.client.emit("focused", this.id);
      console.log("focused");
    },
    onBlurEdit() {
      this.$socket.client.emit("blured", this.id);
      console.log("blured");
    },
    onEnter(event) {
      event.preventDefault();
      this.sendMessage();
    },
    onEnterShift(event) {},
    async loadMoreOldMessage({ loaded, complete }) {
      // complete();
      const {
        data: { messages = [] }
      } = await this.$axios.get(`/chat/${this.id}`, {
        params: {
          "before-id": this.messages[0]?._id
        }
      });

      if (messages.length === 0) {
        complete();
      } else {
        this.messages.unshift(...messages);
        loaded();
      }
    },
    toEndPage() {
      this.$vuetify.goTo(document.body.scrollHeight, {
        duration: 333,
        easing: "linear"
      });
    },
    addiMessageToLocal(uid, body) {
      this.messages.push({
        uid,
        endorsed: [],
        body,
        created: new Date().toISOString(),
        isend: true,
        sent: false,
        sender: this.$auth.user._id
      });
    },
    sendMessage() {
      const message = this.messageReal;

      if (message) {
        const uid = ++idMessageSend;

        this.addiMessageToLocal(uid, {
          content: message
        });

        this.$socket.client.emit("send message", this.id, message, uid);

        this.$refs.textarea__inner.innerHTML = "";
        this.message = "";
      }

      this.toEndPage();

      return false;
    },
    toBlobFile(file) {
      const blob = URL.createObjectURL(file);

      return blob;
    },
    revokeBlob(blob) {
      setTimeout(() => {
        if (blob.match(/^blob\:/)) {
          URL.revokeObjectURL(blob);
        }
      }, 70);
    },
    async sendFiles(accept) {
      const files = await selectFile(accept);
      files.forEach(async file => {
        try {
          const blobFile = this.toBlobFile(file);
          const uid = ++idMessageSend;

          const { name, type } = file;
          let ratio, duration;
          if (type?.match(REGEXP_IMAGE)) {
            /// image
            const { width, height } = await sizeofImage(blobFile);
            ratio = width / height;
          } else if (type?.match(REGEXP_VIDEO)) {
            /// video
            const { width, height, duration: _d } = await sizeofVideo(blobFile);
            ratio = width / height;
            duration = _d;
          }

          if (type?.match(REGEXP_AUDIO)) {
            const { duration: _d } = await durationAudio(blobFile);
            duration = _d;
          }

          this.addiMessageToLocal(uid, {
            file: {
              src: blobFile,
              name,
              type,
              size: file.size,
              ...(ratio ? { ratio } : {}),
              ...(duration ? { duration } : {})
            }
          });
          setTimeout(() => {
            this.toEndPage();
          }, 70);

          uploader.upload(
            { files: [file] },
            {
              data: {
                _id: this.id,
                uid
              }
            }
          );
        } catch (err) {
          console.log(err);
          console.error("FORMAT_FILE_ERROR");
        }
      });
    },
    getNameSender(id) {
      return this.members.find(item => item._id === id)?.name;
    }
  },
  beforeMount() {
    const _id = this.messages[this.messages.length - 1]?._id;

    if (_id) {
      this.$socket.client.emit("i read message", this.id, _id);
    }

    window.addEventListener(
      "scroll",
      (onScroll = () => {
        const refMessages = Array.isArray(this.$refs.message)
          ? this.$refs.message
          : this.$refs.message
          ? [this.$refs.message]
          : [];

        refMessages.reverse().some((message, index) => {
          if (isInViewport(message)) {
            const { _id: idMessage, isend, endorsed } = this.messages[index];

            if (
              isend !== true &&
              endorsed.indexOf(this.$auth.user._id) === -1
            ) {
              this.$socket.client.emit("i read message", this.id, idMessage);
              this.messages.some(message => {
                message.endorsed.push(this.$auth.user._id);
                if (message._id === idMessage) {
                  return true;
                }
              });
              /// if finded message not read then break forEach
              return true;
            }
          }
        });
      })
    );
  },
  beforeDestroy() {
    window.removeEventListener("scroll", onScroll);
    onScroll = null;
  },
  mounted() {
    setParagrapToBr();
    this.toEndPage();
    uploader.on("start", function(fileInfo) {
      console.log("Start uploading", fileInfo);
    });
    uploader.on("stream", function(fileInfo) {
      console.log("Streaming... sent " + fileInfo.sent + " bytes.");
    });
    uploader.on("complete", function(fileInfo) {
      console.log("Upload Complete", fileInfo);
    });
    uploader.on("error", function(err) {
      console.log("Error!", err);
    });
    uploader.on("abort", function(fileInfo) {
      console.log("Aborted: ", fileInfo);
    });
  }
};
</script>

<style lang="scss" scoped>
.preview-file-other {
  min-width: 226px;
  // height: 71px;

  .fiv-viv {
    font-size: 45px;
  }

  .file--name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

<style lang="scss" scoped>
.chat--background {
  background: {
    image: url("~/assets/chat_backgrounds/default.jpg");
    size: cover;
    position: center;
  }
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  pointer-events: none;
  left: 0;
  z-index: 0;
}

.status {
  overflow: hidden;
  span {
    transition: transform 1s ease;
  }
}
</style>

<style lang="scss">
.theme--dark {
  .chat--background {
    filter: invert(1);
  }
}
</style>

<style lang="scss" scoped>
$width-triangle: 10px;

.clearfix,
.clearfix::after {
  content: "";
  clear: both;
  display: table;
}

.chat--frame {
  position: relative;
  z-index: 1;
  > *:first-child {
    margin-top: 12px;
  }
  > *:last-child {
    margin-bottom: 12px;
  }
  padding: {
    left: $width-triangle;
    right: $width-triangle;
  }
  .time {
    height: 40px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
    font-weight: 400;
    pointer-events: none;
    user-select: none;
    &::v-deep > * {
      color: inherit;
    }
  }

  .message {
    $background-color: #fefefe;

    &::before {
      $width: $width-triangle;

      content: "";
      width: 0;
      height: 0;
      border-top: $width solid transparent;
      border-bottom: $width solid transparent;
      border-right: $width solid $background-color;
      position: absolute;
      top: 0;
      left: 0;
      border-radius: inherit;
      transform: rotate(-90deg) translate(($width / 2), -25%);
    }
    &.my-message::before {
      $width: $width-triangle;

      right: 0;
      left: auto;
      border-right: none;
      border-left: $width solid $background-color;
      transform: translate(5px, -25%) rotate(90deg);
    }
    &:not(.my-message) + .message:not(.my-message) {
      &::before {
        display: none;
      }
    }
    &.my-message + .my-message {
      &::before {
        display: none;
      }
    }
    position: relative;
    max-width: (238 / 360 * 100%);

    @media (min-width: 922px) {
      max-width: 660px;
    }

    .message--inner {
      background-color: $background-color;
      color: #000;
      padding: 5px 10px;
      border-radius: 7px;
      display: inline-block;
      text-align: left;
      position: relative;
      // width: 100%;
      // overflow: hidden;

      .sender {
        color: #b4c64c;
        + .file:not(.other) {
          margin-top: 5px !important;
        }
      }

      .inner {
        word-break: break-word;
        font-weight: 400;
        text-align: left;
        white-space: pre-wrap;
        display: inline;
        position: relative;
        box-sizing: border-box;
        &.file:not(.other) {
          margin: -0 -5px;
          display: block;
          overflow: hidden;
          white-space: nowrap;

          + .time,
          .time-video {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: 5px;
            overflow: hidden;
            .time--box {
              position: absolute;
              // bottom: 5px;
              // right: (5px + 5px);
              bottom: 0px;
              right: 5px;
              color: #fff;
              background-image: radial-gradient(
                rgba(0, 0, 0, 0.33),
                rgba(0, 0, 0, 0.27)
              );
              box-shadow: 0 0 20px 30px /* 10px */ rgb(0 0 0 / 22%);
              border-radius: 25%;
              &::v-deep .v-icon {
                color: inherit;
              }
            }
          }
        }
        &.file.other {
          overflow: hidden;
          white-space: initial;
          display: block;
          overflow: hidden;
          margin: (-5px + 11px) (-10px + 11px);
        }
      }

      .time {
        color: #666666;
        margin-top: auto;
        margin-bottom: 0;
        white-space: nowrap;
        height: auto;
        margin-left: 18px;
        float: right;
        line-height: 2;
        &.time-video .time--box {
          left: 5px;
          right: auto !important;
          bottom: -5px !important;
          font-size: 11px !important;
        }
      }
    }

    + .message {
      margin-top: 4px;
    }
    + .my-message {
      .sender {
        display: none;
      }
      margin-top: 12px;
      + .message {
        margin-top: 12px;
      }
      + .my-message {
        margin-top: 4px;
      }
    }
  }
  .my-message {
    $background-color: #ad7;

    margin-left: auto;
    text-align: right;

    &::before {
      border-left-color: $background-color !important;
    }

    .message--inner {
      background-color: $background-color;
    }
    + .my-message {
      margin-top: 4px;
    }
  }
}

.chat--frame {
  .enemy-wroting {
    position: absolute;
  }
}
</style>

<style lang="scss" scoped>
.textbox--bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

.chat--frame {
  margin-bottom: (47px + 4 + 12) !important;
}
</style>

<style lang="scss" scoped>
.textbox--bottom {
  top: auto;
  bottom: 0;
  z-index: 10;
  height: auto;
  padding: 4px 7px;
  margin: 0;
  overflow: hidden;
  .chat--background {
    position: absolute;
  }

  .input__slot {
    flex: 0 0 1;
    width: 100%;
    border-radius: 28px;
    // height: 47px;
    z-index: 1;
    overflow-x: hidden;

    .icon {
      color: #858b91;
      width: 47px;
      height: 47px;
      margin-top: auto;
      margin-bottom: 0;
    }

    .textarea {
      min-height: 32px;
      max-height: 137px;
      flex: 0 0 1;
      width: 100%;
      position: relative;
      z-index: 1;
      color: #000;
      padding: {
        top: 7.5px;
        bottom: 7.5px;
      }

      &__inner {
        width: 100%;
        height: 100%;
        outline: none;
        overflow: hidden auto;
        word-wrap: break-word;
        min-height: (32px - 7.5 * 2);
        max-height: (137px - 7.5 * 2);

        &::-webkit-scrollbar-track {
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          background-color: #f5f5f5;
          border-radius: 5px;
        }

        &::-webkit-scrollbar {
          width: 5px;
          background-color: #f5f5f5;
          border-radius: 5px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #000000;
          border: 2px solid #555555;
          border-radius: 5px;
        }
      }
      .placeholder {
        color: #a5a5a5;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        pointer-events: none;
        user-select: none;
      }
    }
  }
  .btn--send__slot {
    margin-left: 7px;
    margin: {
      top: auto;
      bottom: 0;
    }
    .btn {
      width: 47px;
      height: 47px;
      min-width: 0;
    }
  }

  .emoji-picker--bottom {
    z-index: 1;
    position: relative;
    width: 100%;
    margin-top: 2px;
  }
}
</style>

<style lang="scss">
.transition--group__slide {
  &-item {
    transition: all 0.3s ease;
  }

  &-leave-active {
    position: absolute;
  }
  &-enter,
  &-leave-to {
    // width: 0;
    transform: translateX(10%);
    opacity: 0;
  }
}
</style>

<style lang="scss">
.toolbox {
  top: auto !important;
  bottom: (52px + 5) !important;
  border-radius: 17.5px;
  box-shadow: none;
  .col {
    padding: {
      top: 10.5px;
      bottom: 10.5;
    }
    cursor: pointer;
  }
  .name {
    color: #8c8c8c !important;
    font-weight: 400;
    font-family: sans-serif;
  }
}
</style>
