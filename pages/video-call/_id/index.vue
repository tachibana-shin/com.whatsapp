<template>
  <v-row class="fill-height">
    <v-card
      flat
      color="transparent"
      width="100%"
      fill-height
      class="px-3 pt-15 pb-3 layer"
      dark
    >
      <template v-if="status === $options.STATUS_CODE[0]">
        <div>
          <app-avatar no-badge size="95px" style="border-radius: 50%" />
        </div>
        <div class="name">hacker</div>
        <div class="text--calling text-body-2 font-weight-light">Đang gọi</div>

        <div class="bottom">
          <div class="text-center">
            <v-btn fab size="58px" color="error" dark>
              <v-icon> mdi-phone-hangup </v-icon>
            </v-btn>
          </div>
          <div
            class="d-flex mx-8 justify-space-between"
            style="margin-top: 56px"
          >
            <v-btn
              fab
              color="transparent"
              class="no-shadow"
              @click="frontCamera = !frontCamera"
            >
              <v-icon> mdi-camera-party-mode </v-icon>
            </v-btn>
            <v-btn fab color="transparent" class="no-shadow" disabled>
              <v-icon> mdi-video-off </v-icon>
            </v-btn>
            <v-btn
              fab
              color="transparent"
              class="no-shadow"
              @click="disableMicro = !disableMicro"
              :input-value="disableMicro"
            >
              <v-icon> mdi-microphone-off </v-icon>
            </v-btn>
          </div>
        </div>
      </template>
      <template v-else-if="status === $options.STATUS_CODE[1]">
        <div>
          <app-avatar no-badge size="95px" style="border-radius: 50%" />
        </div>
        <div class="name">hacker</div>
        <div class="text--calling text-body-2 font-weight-light">Đang gọi</div>
        <div class="bottom">
          <div
            class="d-flex mx-15 mb-5 justify-space-between"
            style="margin-top: 56px"
          >
            <v-btn fab size="58px" color="secondary">
              <v-icon> mdi-close </v-icon>
            </v-btn>
            <v-btn fab size="58px" color="blue" @click="createNewPhoneRoll">
              <v-icon> mdi-video </v-icon>
            </v-btn>
          </div>
        </div>
      </template>
    </v-card>

    <video
      class="stream"
      ref="stream"
      @loadedmetadata="loadDone"
      muted
      :style="{
        'background-color':
          status === $options.STATUS_CODE[1] ? `#1b2227` : undefined
      }"
    />
  </v-row>
</template>

<script>
// import Peer from "peerjs"
/**
 * @WAITNG : waiting for reply;
 * @NO_ASWER : no answer;
 * @TALKING : talking;
 * @END : end video call
 */
const STATUS_CODE = ["WAITING", "NO_ASWER", "TALKING", "END"];

const API_URL = new URL(process.env.API_URL);
let peer;
export default {
  STATUS_CODE,
  meta: {
    navbar: false
  },
  data() {
    return {
      frontCamera: true,
      disableMicro: false,

      status: null
    };
  },
  sockets: {
    "i join video call"(chatId, id) {
      console.info(`${chatId}: ${message}`);
    },
    "join video call__ERROR"(chatId, message) {
      console.warn(`${chatId}: ${message}`);
    }
  },
  watch: {
    frontCamera: "createStream",
    disableMicro: "createStream",
    status(newValue) {
      if (newValue === STATUS_CODE[1]) {
        this.revokeAllStream();
      }
    }
  },
  async beforeMount() {
    return
    peer = new Peer(undefined, {
      path: "/video-call",
      host: API_URL.hostname,
      port: API_URL.port
    });
    await this.createNewPhoneRoll();
  },
  methods: {
    async createNewPhoneRoll() {
      this.status = STATUS_CODE[0];
      await this.createStream();
    },
    revokeAllStream() {
      this.$refs.stream?.srcObject?.getTracks().forEach(mediaObject => {
        mediaObject.stop();
      });
    },
    async createStream() {
      this.revokeAllStream();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: this.disableMicro === false,
        video: {
          width: innerWidth,
          height: innerHeight
        },
        facingMode: this.frontCamera ? "user" : "environment"
      });

      peer.on("call", call => {
        call.answer(stream);
        call.on("stream", userVideoStream => {
          console.log(userVideoStream);
        });
      });
      socket.on("i join video call", (chatId, userId) => {
        connectToNewUser(userId, stream);
        const call = peer.call(userId, stream);
        call.on("stream", userVideoStream => {
          console.log(userVideoStream);
        });
      });
      peer.on("open", id => {
        socket.emit("join video call", this.id);
      });

      if ("srcObject" in this.$refs.stream) {
        this.$refs.stream.srcObject = stream;
      } else {
        this.$refs.stream.src = URL.createObjectURL(stream);
      }

      // this.$socket.client.emit("join video call", this.$route.params.id);
    },
    loadDone({ target }) {
      target.play();
    }
  }
};
</script>

<style scoped lang="scss">
.stream {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #000000;
  z-index: 0;
}
.name {
  margin-top: (196px - 80 - 95);
  font-size: 22px;
}
.text--calling {
  margin-top: (243px - 205 - 35);
}
.layer {
  text-align: center;
  position: relative;
  z-index: 2;

  .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
.no-shadow {
  box-shadow: none !important;
  &.v-btn--disabled.theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
    background-color: transparent !important;
  }
}
</style>
