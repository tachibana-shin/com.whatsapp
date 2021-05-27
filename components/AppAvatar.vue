<template>
  <v-badge
    bottom
    dot
    overlap
    color="#1f1"
    :offset-x="offsetX"
    :offset-y="offsetY"
    transition="scale-transition"
    :value="online"
  >
    <v-avatar :size="size">
      <v-img style="background-color: #000" :src="src"> </v-img>
    </v-avatar>
  </v-badge>
</template>

<script>
export default {
  props: {
    offsetX: Number,
    offsetY: Number,
    src: String,
    online: Boolean,
    size: [String, Number]
  }
};
</script>
