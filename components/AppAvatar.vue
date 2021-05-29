<template>
  <v-avatar :size="size" v-if="noBadge">
    <v-img style="background-color: #000" :src="src"> </v-img>
  </v-avatar>
  <v-badge
    v-else
    bottom
    dot
    overlap
    color="#1f1"
    :offset-x="offsetX"
    :offset-y="offsetY"
    transition="scale-transition"
    :value="online"
  >
    <v-avatar :size="size" :to="!!to ? to : undefined">
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
    size: [String, Number],
    noBadge: Boolean,
    to: String
  }
};
</script>
