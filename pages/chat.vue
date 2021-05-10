<template>
  <v-card flat color="transparent" class="fill-height" width="100%">
    <div class="chat--background"></div>

    <v-app-bar app fixed height="56px" color="green-main">
      <v-btn icon>
        <v-icon> mdi-arrow-left </v-icon>
      </v-btn>
      <v-avatar size="35px">
        <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
      </v-avatar>
      <nuxt-link
        tag="div"
        to="/user/2"
        class="ml-3 my-n1 d-flex flex-column justify-space-between"
        style="max-width: 300px; width: 100%; height: 100%; padding: 4px 0;"
        v-ripple
      >
        <div
          class="font-weight-regular text--white text-truncate"
          style="font-size: 18px; line-height: 1"
        >
          Michael Jackon
        </div>
        <div
          class="font-weight-regular text-truncate status"
          style="font-size: 13.2px; line-height: 1; color: #e4e7f6; margin-top: 3px;"
        >
          2:02 CH
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

    <div
      class="chat--frame my-n3"
      :style="{
        'padding-bottom': `${keyboardHeight}px`
      }"
    >
      <div class="time">12:10 CH</div>
      <template v-for="item in ~~(100 + 1)">
        <div
          class="message"
          :class="{
            'my-message': item % 2 == 0
          }"
          :key="item"
        >
          <div class="message--inner">
            <section class="inner">Hello {{ item }}</section>
            <span class="time"> 11:54 SA </span>
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
            <v-btn icon class="icon" v-show="!message" key="2">
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
                  !!message && $refs.textarea__inner
                    ? `${$refs.textarea__inner.scrollHeight}px`
                    : undefined
              }"
            ></div>
            <label for="textarea" class="placeholder" v-show="!message">
              Nhập tin nhắn
            </label>
          </div>
        </div>
        <div class="btn--send__slot">
          <v-btn rounded dark color="green-main" class="btn">
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

let keyboardHeight = 175;

export default {
  components: {
    VEmojiPicker
  },
  meta: {
    navbar: false
  },
  data() {
    return {
      keyboardHeight,
      message: "",
      emojiPickerOn: false
    };
  },
  mounted() {
    if (process.isClient) {
      window.addEventListener(
        "load",
        () => {
          let height = innerHeight;

          window.addEventListener("keydown", () => {
            keyboardHeight = height - innerHeight;
          });
        },
        {
          once: true
        }
      );
    }
  }
};
</script>

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
      display: inline-flex;
      justify-content: space-between;

      .inner {
        word-break: break-all;
        font-weight: 400;
      }

      .time {
        color: #666666;
        margin-top: auto;
        margin-bottom: 0;
        white-space: nowrap;
        height: auto;
        margin-left: 18px;
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
