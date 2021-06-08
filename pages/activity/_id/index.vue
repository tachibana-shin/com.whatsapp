<template>
  <v-card
    flat
    :color="activity.body[`background-color`] || `#000000`"
    class="fill-height pa-0 root"
    width="100%"
    v-if="activity"
    @mousedown="paused = true"
    @mouseup="paused = false"
    @touchstart="paused = true"
    @touchend="paused = true"
  >
    <v-fade-transition>
      <div v-show="paused === false">
        <div class="root--progress">
          <div
            class="root--progress-children"
            v-for="(item, index) in activitys.length"
            :key="item"
            :class="{
              active: indexSelectd === index
            }"
          >
            <span
              :style="{
                width: indexSelectd === index ? `${process}%` : undefined
              }"
            />
          </div>
        </div>
        <v-app-bar app height="56px" color="transparent" flat dark>
          <v-btn icon @click="$router.back()">
            <v-icon> mdi-arrow-left </v-icon>
          </v-btn>
          <app-avatar :size="37" :src="avatar" :online="isOnline" />
          <div
            class="ml-3 my-n1 d-flex flex-column justify-center"
            style="max-width: 300px; width: 100%; height: 100%; padding: 4px 0"
          >
            <div
              class="font-weight-medium text--white text-truncate"
              style="font-size: 18px; line-height: 1"
            >
              Trạng thái của tôi
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
              vừa xong
            </div>
          </div>
        </v-app-bar>
      </div>
    </v-fade-transition>

    <div class="text--container" v-if="activity.body.image">
      <v-img :src="activity.body.image" aspect-ratio="1" />
    </div>
    <div
      class="text--container"
      v-else
      :style="{
        'font-family': activity[`font-family`]
      }"
    >
      {{ activity.body.content }}
    </div>

    <v-fade-transition>
      <div v-show="paused === false">
        <div class="root--bottom">
          <v-btn icon dark>
            <v-icon> mdi-eye </v-icon>
          </v-btn>
          {{ activity.views }}
        </div>
      </div>
    </v-fade-transition>
  </v-card>
</template>

<script>
const TIMEOUT = 2000;
let idRequestFrame;
export default {
  meta: {
    navbar: false
  },
  async asyncData({ $axios, params: { id } }) {
    const {
      data: {
        _id,
        activitys,
        "is-online": isOnline,
        "last-online": lastOnline,
        name,
        avatar
      }
    } = await $axios.get(`/activity/${id}`);

    return {
      id: _id,
      activitys,
      isOnline,
      lastOnline,
      name,
      avatar
    };
  },
  data() {
    return {
      time: 0,

      paused: false,

      requestFrameRunning: true
    };
  },
  watch: {
    time(newValue) {
      if (newValue >= this.activitys.length * TIMEOUT) {
        this.requestFrameRunning = false;
        cancelAnimationFrame(idRequestFrame);
        this.$router.back();
      }
    },
    async activity(newValue) {
      if (newValue?._id) {
        await this.$axios.put(`/activity/${newValue._id}/read`);
      }
    },
    paused(newValue) {
      if (newValue) {
        this.stop();
      } else {
        this.start();
      }
    }
  },
  computed: {
    indexSelectd() {
      return ~~(this.time / TIMEOUT);
    },
    process() {
      return ((this.time % TIMEOUT) / TIMEOUT) * 100;
    },
    activity() {
      return this.activitys[this.indexSelectd];
    }
  },
  methods: {
    start() {
      cancelAnimationFrame(idRequestFrame);
      this.requestFrameRunning = true;
      let last = Date.now();

      const handle = () => {
        const now = Date.now();

        this.time += now - last;

        last = now;

        if (this.requestFrameRunning) {
          requestAnimationFrame(() => handle());
        }
      };

      requestAnimationFrame(() => handle());
    },
    stop() {
      cancelAnimationFrame(idRequestFrame);
      this.requestFrameRunning = false;
    }
  },
  beforeMount() {
    this.start();
  },
  beforeDestroy() {
    this.stop();
  }
};
</script>

<style lang="scss" scoped>
.root {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &--progress {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 2.4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-children {
      background-color: rgba($color: #eee, $alpha: 0.5);
      width: 100%;
      height: 100%;
      margin-right: 5px;
      &:last-child {
        margin-right: 0;
      }

      span {
        display: absolute;
        height: 100%;
        top: 0;
        bottom: 0;
        display: block;
        left: 0;
        background-color: #fff;
        width: 100%;
      }

      &.active ~ * span {
        width: 0%;
      }
    }
  }

  &--bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    color: #fff;
  }
}
</style>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Dancing+Script&family=Odibee+Sans&family=Roboto&family=Stint+Ultra+Condensed&display=swap");

.text--container {
  .image {
    width: 100%;
    margin: auto 0;
  }

  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  outline: none;
  border: 0;
  transform: translateY(-50%);
  min-height: 120px;
  font-size: 55px;
  text-align: center;
  color: #fff;
  max-height: 100%;
  white-space: pre-wrap;
}
</style>
