<template>
  <v-card flat color="transparent" class="fill-height" width="100%">
    <div class="chat--background"></div>

    <v-app-bar app fixed height="56px" color="green-main" dark>
      <v-btn icon>
        <v-icon> mdi-arrow-left </v-icon>
      </v-btn>
      <v-avatar size="35px">
        <v-img
          background-color="black"
          :src="avatar || require(`~/assets/default-avatar-300x300.png`)"
        ></v-img>
      </v-avatar>
      <nuxt-link
        tag="div"
        :to="`/user/${id}`"
        class="ml-3 my-n1 d-flex flex-column justify-center"
        style="max-width: 300px; width: 100%; height: 100%; padding: 4px 0;"
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
          style="font-size: 13.2px; line-height: 1; color: #e4e7f6; margin-top: 3px;"
        >
          {{ wroting ? "Đang trả lời" : new Date(lastOnline).toLocaleTimeString() }}
        </div>
      </nuxt-link>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>
          mdi-video
        </v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>
          mdi-phone
        </v-icon>
      </v-btn>

      <client-only>
        <v-menu left bottom transition="scroll-y-reverse-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title>Xem người liên hệ</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title
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
                    <v-icon>
                      mdi-menu-right
                    </v-icon>
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

    <div class="chat--frame my-n3">
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
        v-for="({ content, mysend, created, sended, readed },
        index) in messages"
      >
        <div
          class="message"
          :class="{
            'my-message': mysend
          }"
          :key="index"
          ref="message"
        >
          <div class="message--inner">
            <section
              class="inner file"
              v-if="content.file"
              :class="{
                'other mb-0': isFileOther(content.file.type)
              }"
            >
              <v-img
                v-if="content.file.type.match(/image\//)"
                :src="content.file.src"
                :width="content.file.ratio < 1 ? 226 : 251"
                :aspect-ratio="
                  content.file.ratio < 1
                    ? 226 / 316
                    : Math.min(1, content.file.ratio)
                "
                background-color="black"
                class="d-block"
              />
              <v-responsive
                :aspect-ratio="
                  content.file.ratio < 1 ? 226 / 316 : content.file.ratio
                "
                v-else-if="content.file.type.match(/video\//)"
                width="100%"
              >
                <video
                  :src="content.file.src"
                  style="width: 100%; display: block"
                  controls
                ></video>
              </v-responsive>
              <audio
                v-else-if="content.file.type.match(/audio\//)"
                :src="content.file.src"
                style="width: 100%; display: block"
                controls
              ></audio>
              <div class="preview-file-other" v-else>
                <div class="d-flex align-center">
                  <div class="file--icon">
                    <span
                      class="fiv-viv"
                      :class="[
                        `fiv-icon-${
                          existsIcon(extname(content.file.name))
                            ? extname(content.file.name)
                            : 'blank'
                        }`
                      ]"
                    ></span>
                  </div>
                  <div class="file--name font-weight-regular ml-3">
                    {{ content.file.name }}
                  </div>
                </div>

                <div class="d-flex justify-space-between">
                  <span
                    class="time ml-0 text-uppercase"
                    style="text-align: left; float: none"
                  >
                    {{ extname(content.file.name) }}
                  </span>
                  <span class="time" style="float: none">
                    {{ moment(created).format("hh:mm") }}
                    <v-icon
                      size="16"
                      class="ml-1"
                      v-if="mysend"
                      :color="readed ? `blue` : undefined"
                    >
                      {{
                        sended
                          ? readed
                            ? "mdi-check-all"
                            : "mdi-check"
                          : "mdi-clock-outline"
                      }}
                    </v-icon>
                  </span>
                </div>
              </div>
            </section>
            <section class="inner" v-else>{{ content.body }}</section>
            <span
              class="time"
              v-if="!content.file || !isFileOther(content.file.type)"
            >
              {{ moment(created).format("hh:mm") }}
              <v-icon
                size="16"
                class="ml-1"
                v-if="mysend"
                :color="readed ? `blue` : undefined"
              >
                {{
                  sended
                    ? readed
                      ? "mdi-check-all"
                      : "mdi-check"
                    : "mdi-clock-outline"
                }}
              </v-icon>
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
            <v-menu :nudge-width="500" bottom key="1">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon class="icon" v-on="on" v-bind="attrs">
                  <v-icon> mdi-link-variant mdi-rotate-270 </v-icon>
                </v-btn>
              </template>
            </v-menu>
            <v-btn
              icon
              class="icon"
              v-show="!messageReal"
              key="2"
              @click="selectImage"
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
import FileToArrayBuffer from "file-to-array-buffer";
import moment from "moment";
import { socket } from "~/plugins/vue-socket.io-extended";
import socketIOFileClient from "socket.io-file-client";
import { extname } from "path";
import VueInfiniteLoading from "vue-infinite-loading";
import "file-icon-vectors/dist/file-icon-vivid.min.css";

const uploader = new socketIOFileClient(socket);

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
function sizeofImage(src) {
  const img = new Image();
  const promise = new Promise((resolve, reject) => {
    img.addEventListener(
      "load",
      () => {
        resolve({ width: img.width, height: img.height });
      },
      { once: true }
    );
    img.addEventListener(
      "error",
      () => {
        reject("GET_SIZEOF_IMAGE_ERROR");
      },
      { once: true }
    );

    setTimeout(() => resolve({}), 60000);
  });
  img.src = src;

  return promise;
}
function sizeofVideo(src) {
  const img = document.createElement("video");
  const promise = new Promise((resolve, reject) => {
    img.addEventListener(
      "loadedmetadata",
      () => {
        resolve({ width: img.videoWidth, height: img.videoHeight });
      },
      { once: true }
    );
    img.addEventListener(
      "error",
      () => {
        reject("GET_SIZEOF_VIDEO_ERROR");
      },
      { once: true }
    );

    setTimeout(() => resolve({}), 60000);
  });
  img.src = src;

  return promise;
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
      data: { _id, name, avatar, lastOnline, messages = [] }
    } = await $axios.get(`/chat/${id}`);

    return {
      id,
      name,
      avatar,
      lastOnline,
      messages,
      wroting: false
    };
  },
  data() {
    return {
      message: "",
      emojiPickerOn: false
    };
  },
  computed: {
    moment() {
      return moment;
    },
    messageReal() {
      const message = decodeURIComponent(
        this.message.replace(/<\/? ?br>/gi, "\n").replace(/^\s+|\s+$/g, "")
      )
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&");
      return message;
    }
  },
  sockets: {
    "send message__SUCCESS"({ uid, idMessage }) {
      const message = this.messages.find(item => item.uid === uid);

      if (message) {
        message.sended = true;
        this.$delete(message, "uid");
        this.$set(message, "_id", idMessage);
      } else {
        console.error(`${uid} not found`);
      }
    },
    "send message__ERROR"(message) {
      console.log("error", message);
    },
    "new message"({ body } = {}) {
      if (body) {
        this.messages.push(Object.assign({}, body));
        this.toEndPage();
      }
    },
    "user online"({ _id, lastOnline }) {
      if (this.id === _id) {
        this.lastOnline = lastOnline;
      }
    },
    "readed message"(toId) {
      this.readedMessageAfter(toId);
    },
    "enemy writing"(id) {
      console.log(`writing ${id}`);
      this.wroting = true;
    },
    "enemy writed"(id) {
      console.log(`writed ${id}`);
      this.wroting = false;
    }
  },
  methods: {
    onFocusEdit() {
      this.$socket.client.emit("focused", this.id);
      console.log("focused");
    },
    onBlurEdit() {
      this.$socket.client.emit("blured", this.id);
      console.log("blured");
    },
    async loadMoreOldMessage({ loaded, complete }) {
      // complete();
      const {
        data: { messages = [] }
      } = await this.$axios.get(`/chat/${this.id}`, {
        params: {
          beforeId: this.messages[0]._id
        }
      });

      if (messages.length === 0) {
        complete();
      } else {
        this.messages.unshift(...messages);
        loaded();
      }
    },
    extname(path) {
      return extname(path).replace(/^\./, "");
    },
    existsIcon(icon) {
      try {
        require(`file-icon-vectors/dist/icons/vivid/${icon}.svg`);

        return true;
      } catch (e) {
        return false;
      }
    },
    isFileOther(type) {
      return !(type || ``).match(/(?:image|video|audio)\//);
    },
    onEnter(event) {
      event.preventDefault();
      this.sendMessage();
    },
    onEnterShift(event) {},
    toEndPage() {
      this.$vuetify.goTo(document.body.scrollHeight, {
        duration: 333,
        easing: "linear"
      });
    },
    sendMessage() {
      const message = this.messageReal;

      if (message) {
        const uid = ++idMessageSend;

        this.messages.push({
          content: {
            body: message
          },
          created: new Date().toISOString(),
          mysend: true,
          readed: false,
          sended: false,
          uid
        });

        this.$socket.client.emit("send message", {
          _id: this.id,
          content: message,
          uid
        });

        this.$refs.textarea__inner.innerHTML = "";
        this.message = "";
      }

      this.toEndPage();

      return false;
    },
    readedMessageAfter(id) {
      this.messages.some(message => {
        if (message._id === id) {
          return true;
        }

        if (message.mysend === true && message.readed === false) {
          message.readed = true;
        }
      });
    },
    selectFile(accept) {
      const input = document.createElement("input");
      input.setAttribute("hidden", true);
      input.setAttribute("type", "file");
      input.setAttribute("accept", accept);

      const promis = new Promise((resolve, reject) => {
        input.addEventListener(
          "change",
          () => {
            resolve(input.files);
            input.remove();
          },
          { once: true }
        );
        input.addEventListener("blur", () => {
          if (input.files.length === 0) {
            reject();
          }
        });
      });

      document.body.appendChild(input);
      input.click();

      return promis;
    },
    toBase64(file) {
      const reader = new FileReader();
      const pro = new Promise((resolve, reject) => {
        reader.addEventListener(
          "load",
          () => {
            resolve(reader.result);
          },
          { once: true }
        );
        reader.addEventListener(
          "error",
          () => {
            reject();
          },
          { once: true }
        );
      });

      reader.readAsDataURL(file);

      return pro;
    },
    toBlobFile(file) {
      return URL.createObjectURL(file);
    },
    revokeBlob(blob) {
      URL.revokeObjectURL(blob);
    },
    async selectImage() {
      const files = await this.selectFile();
      const blobFile = this.toBlobFile(files[0]);
      const uid = ++idMessageSend;

      const { name, type } = files[0];
      let ratio;
      if (type.match(/image\//)) {
        /// image
        const { width, height } = await sizeofImage(blobFile);
        ratio = width / height;
      } else if (type.match(/video\//)) {
        /// video
        const { width, height } = await sizeofVideo(blobFile);
        ratio = width / height;
      }

      this.messages.push({
        content: {
          file: {
            src: blobFile,
            name,
            type,
            ...(ratio ? { ratio } : {})
          }
        },
        created: new Date().toISOString(),
        mysend: true,
        readed: false,
        sended: false,
        uid
      });

      setTimeout(() => {
        this.toEndPage();
      }, 70);

      uploader.upload(
        { files },
        {
          data: {
            _id: this.id,
            uid
          }
        }
      );

      return;
      this.$socket.client.emit("send message", {
        _id: this.id,
        file: {
          buffer: await FileToArrayBuffer(files[0]),
          name,
          type
        },
        uid
      });
    }
  },
  created() {
    if (process.isClient) {
      this.$socket.client.emit("join to room 2 private", this.id);
      this.toEndPage();
    }
  },
  beforeDestroy() {
    if (process.isClient) {
      this.$socket.client.emit("left join to room 2 private", this.id);
      window.removeEventListener("scroll", onScroll);
    }
  },
  updated() {
    if (onScroll) {
      onScroll();
    }
  },
  mounted() {
    try {
      document.execCommand("defaultParagraphSeparator", false, "br");
    } catch (e) {
      console.warn(`Browser not support default-paragraph-separator`);
    }
    this.toEndPage();
    window.addEventListener(
      "scroll",
      (onScroll = () => {
        const refMessages = Array.isArray(this.$refs.message)
          ? this.$refs.message
          : [this.$refs.message];

        refMessages.forEach((message, index) => {
          if (isInViewport(message)) {
            const { _id, mysend, readed } = this.messages[index];

            if (mysend !== true && readed === false) {
              this.$socket.client.emit("readed message", {
                _id: this.id,
                beforeId: _id
              });

              this.readedMessageAfter(_id);
            }
          }
        });
      })
    );
    onScroll();

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

      .inner {
        word-break: break-word;
        font-weight: 400;
        text-align: left;
        white-space: pre-wrap;
        display: inline;
        &.file:not(.other) {
          margin: -0 -5px;
          display: block;
          overflow: hidden;
          white-space: nowrap;

          + .time {
            position: absolute;
            bottom: 5px;
            right: (5px + 5px);
            color: #fff;
            background-image: radial-gradient(
              rgba(0, 0, 0, 0.33),
              rgba(0, 0, 0, 0.27)
            );
            box-shadow: 0 0 20px 10px rgb(0 0 0 / 33%);
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
      }
    }

    + .message {
      margin-top: 4px;
    }
    + .my-message {
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
