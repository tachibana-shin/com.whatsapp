<template>
  <div>
    <v-teleport to="fab" />
    <v-teleport to="root">
      <v-card flat color="transparent" class="web-cam-fixed">
        <div class="camera">
          <video class="preview" ref="preview">
            Video stream not available.
          </video>
          <canvas ref="canvas"></canvas>

          <v-layout class="buttons">
            <v-flex>
              <v-btn icon>
                <v-icon></v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </div>
      </v-card>
    </v-teleport>
  </div>
</template>

<script>
export default {
  async mounted() {
    const { preview, canvas } = this.$refs;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: parseFloat(getComputedStyle(preview).width),
        height: parseFloat(getComputedStyle(preview).height)
      }
    });
    if ("srcObject" in preview) {
      preview.srcObject = stream;
    } else {
      preview.src = URL.createObjectURL(stream);
    }
    preview.play();
  }
};
</script>

<style lang="scss" scoped>
.web-cam-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2048;
  background-color: #000 !important;
}

.camera {
  position: relative;
  width: 100%;
  height: 100%;
  .preview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
