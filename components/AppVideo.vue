<template>
  <div class="video" @mousemove="show = true">
    <video
      :src="src"
      @loadedmetadata="$emit(`loadedmetadata`)"
      @play="playing = true"
      @pause="playing = false"
      ref="video"
    />
    <v-fade-transition>
      <div class="addons" v-show="!playing || show">
        <v-btn icon class="btn--play" @click="toggle">
          <v-scale-transition leave-absolute>
            <v-icon color="white" size="32" v-if="!playing"> mdi-play </v-icon>
            <v-icon color="white" size="32" v-else> mdi-pause </v-icon>
          </v-scale-transition>
        </v-btn>
      </div>
    </v-fade-transition>
  </div>
</template>

<script>
let timeout;

export default {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      playing: false,
      show: false
    };
  },
  watch: {
    playing(newValue) {
      if (newValue) {
        this.show = true;
      }
    },
    async show(newValue) {
      if (newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.show = false;
        }, 3000);
      }
    }
  },
  methods: {
    toggle() {
      try {
        if (this.playing) {
          this.$refs.video.pause();
          this.$refs.video.exitFullscreen();
        } else {
          this.$refs.video.play();
          this.$refs.video.requestFullscreen();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.video {
  position: relative;
  display: block;
  width: 100%;
  background-color: #000;

  .addons {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9e99;

    .btn--play {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      outline: none;
      background-color: transparent;
      border: none;
      border-radius: 0;
    }
  }
  video {
    width: 100%;
    display: block;
  }
}
</style>
