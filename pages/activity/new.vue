<template>
  <v-card flat :color="backgroundColor" class="fill-height root" width="100%">
    <div
      class="textarea--wrapper"
      :style="{
        'font-family': $options.fontsFamily[indexFontFamily]
      }"
    >
      <app-textarea
        v-model="message"
        placeholder="Nhập một trạng thái"
        class="textarea"
      />
    </div>
    <div class="root--bottom mx-3 mb-3">
      <v-btn icon class="mr-3" dark @click="emojiPickerOn = !emojiPickerOn">
        <v-icon>
          {{ emojiPickerOn ? "mdi-keyboard" : "mdi-emoticon-outline" }}
        </v-icon>
      </v-btn>
      <v-btn icon dark class="mr-3" @click="changeFontFamily">
        <v-icon>
          mdi-format-color-text
        </v-icon>
      </v-btn>
      <v-btn icon dark @click="changeBackgroundColor">
        <v-icon>
          mdi-palette
        </v-icon>
      </v-btn>
    </div>

    <v-emoji-picker
      class="emoji-picker--bottom"
      v-if="emojiPickerOn"
      @select="
        $refs.textarea__inner.innerHTML += $event.data;
        message = $refs.textarea__inner.innerHTML;
      "
    ></v-emoji-picker>
    <v-teleport to="fab">
      <v-fab-transition>
        <v-btn
          color="success"
          dark
          fab
          absolute
          bottom
          right
          v-show="!!message"
          style="bottom: 16px"
          :loading="loading"
          @click="post"
        >
          <v-icon> mdi-send </v-icon>
        </v-btn>
      </v-fab-transition>
    </v-teleport>
  </v-card>
</template>

<script>
import { VEmojiPicker } from "v-emoji-picker";
import randomcolor from "randomcolor";

export default {
  components: {
    VEmojiPicker
  },
  meta: {
    navbar: false
  },
  fontsFamily: [
    "normal",
    "Roboto",
    "Stint Ultra Condensed",
    "Dancing Script",
    "Odibee Sans"
  ],
  data() {
    return {
      emojiPickerOn: false,

      indexFontFamily: 0,
      backgroundColor: randomcolor({
        luminosity: "dark",
        alpha: 0.5
      }),

      message: "",

      loading: false
    };
  },
  methods: {
    changeFontFamily() {
      if (this.indexFontFamily === this.$options.fontsFamily.length - 1) {
        this.indexFontFamily = 0;
      } else {
        this.indexFontFamily++;
      }
    },
    changeBackgroundColor() {
      this.backgroundColor = randomcolor({
        luminosity: "dark",
        alpha: 0.5
      });
    },
    async post() {
      if (!!this.message) {
        this.loading = true;
        await this.$axios.post(`/activity`, {
          content: this.message,
          "background-color": this.backgroundColor,
          "font-family": this.$options.fontsFamily[this.indexFontFamily]
        });
        this.loading = false;
        this.$router.back();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Dancing+Script&family=Odibee+Sans&family=Roboto&family=Stint+Ultra+Condensed&display=swap");

.root {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .textarea--wrapper {
    width: 100%;
    height: 100%;
    flex: 0 0 1;
    text-align: center;
    color: #fff;
    position: relative;
    .textarea {
      position: absolute;
      top: 50%;
      right: 0;
      left: 0;
      outline: none;
      border: 0;
      transform: translateY(-50%);
      min-height: 120px;
      font-size: 55px;
      max-height: 100%;
      color: #fff;
    }
  }
}

.emoji-picker--bottom {
  z-index: 1;
  position: relative;
  width: 100% !important;
}
</style>
