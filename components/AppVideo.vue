<template>
  <vue-media
    kind="video"
    controls
    :src="src"
    @loadedmetadata="$emit(`loadedmetadata`)"
  />
</template>

<script>
import VueMedia from "@dongido/vue-viaudio";

export default {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  components: {
    VueMedia
  }
};
</script>
