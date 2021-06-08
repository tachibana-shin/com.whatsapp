<template>
  <div class="textarea" :class="{ fillClass }">
    <div
      class="textarea__inner"
      contenteditable
      @input="message = $event.target.innerHTML"
      ref="textarea__inner"
      :style="{
        height:
          fill && !!messageReal && $refs.textarea__inner
            ? `${$refs.textarea__inner.scrollHeight}px`
            : undefined
      }"
      @keydown.exact.enter.prevent.stop="$emit(`submit`)"
      @keydown.exact.enter.shift="$emit(`new-line`)"
      @focus="$emit(`fucus`)"
      @blur="$emit(`blur`)"
    />
    <label class="placeholder" v-show="!message">
      {{ placeholder }}
    </label>
  </div>
</template>

<script>
function setParagrapToBr() {
  try {
    document.execCommand("defaultParagraphSeparator", false, "br");
  } catch {
    console.warn(`Browser not support default-paragraph-separator`);
  }
}

function decodeHTML(message) {
  return decodeURIComponent(
    message
      .replace(/<(?:div|p)>/g, "<br>")
      .replace(/<\/(?:div|p)>/g, "")
      .replace(/<\/? ?br>/gi, "\n")
  )
    .replace(/\&[^\s;]{1,};/g, template => {
      const div = document.createElement("div");
      div.innerHTML = template;

      return div.innerText;
    })
    .replace(/^\s+|\s+$/g, "");
}

let count = 0;

export default {
  props: {
    fill: {
      type: Boolean,
      default: false
    },
    fillClass: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    },
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      message: this._props.value || "",
      id: count++
    };
  },
  watch: {
    messageReal(newValue) {
      this.$emit("input", newValue);
    },
    value(newValue) {
      if (
        decodeHTML(this.$refs.textarea__inner.innerHTML) !==
        decodeHTML(newValue)
      ) {
        this.$refs.textarea__inner.innerHTML = newValue;
        this.message = newValue;
      }
    }
  },
  computed: {
    messageReal() {
      return decodeHTML(this.message);
    }
  },
  mounted() {
    setParagrapToBr();
  }
};
</script>

<style lang="scss" scoped>
.textarea {
  flex: 0 0 1;
  width: 100%;
  position: relative;
  z-index: 1;
  color: #000;
  padding: {
    top: 7.5px;
    bottom: 7.5px;
  }
  &:not(.fill) {
    min-height: 32px;
    max-height: 137px;
  }
  &.fill {
    height: 100%;
  }

  &:not(.fill) {
    .textarea__inner {
      min-height: (32px - 7.5 * 2);
      max-height: (137px - 7.5 * 2);
    }
  }

  &__inner {
    width: 100%;
    height: 100%;
    outline: none;
    overflow: hidden auto;
    word-wrap: break-word;

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
    // color: #a5a5a5;
    opacity: 0.5;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    pointer-events: none;
    user-select: none;
  }
}
</style>
