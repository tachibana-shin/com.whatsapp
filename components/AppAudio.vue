<template>
  <div class="audio">
    <audio
      :src="src"
      @loadedmetadata="$emit(`loadedmetadata`)"
      controls
      ref="audio"
    />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.audio {
  position: relative;
  display: block;
  width: 100%;
}
</style>
