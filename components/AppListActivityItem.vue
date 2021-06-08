<template>
  <v-list-item :to="to">
    <v-list-item-avatar :size="55 + 5 + 4">
      <app-avatar
        :offset-x="12"
        :offset-y="12"
        :size="55"
        :src="
          lastActivity && lastActivity.body.image ? lastActivity.body.image : srcAvatar
        "
        :online="online"
      />
      <canvas ref="canvas" width="58px" height="58px" v-if="count > 0" />
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="font-weight-medium">
        {{ name }}
      </v-list-item-title>
      <v-list-item-subtitle class="mt-1">
        <slot name="time" />
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
// let rotate = 0;
function drawLine(canvas, count, isActive = -1) {
  const ctx = canvas.getContext("2d");
  const RADIUS = canvas.width / 2;
  const OFFSET_ALPHA = (6 * Math.PI) / 180;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(RADIUS, RADIUS);
  //   ctx.rotate(rotate);
  //   rotate += (3 * Math.PI) / 180;

  ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const points = [];
  for (let index = 0; index < count; index++) {
    const alpha = (index / count) * Math.PI * 2;
    points.push(alpha);

    // ctx.beginPath();
    // ctx.arc(
    //   RADIUS + RADIUS * Math.sin(alpha),
    //   RADIUS - RADIUS * Math.cos(alpha),
    //   3,
    //   0,
    //   Math.PI * 2
    // );
    // ctx.fillStyle = "red";
    // ctx.fill();
    // ctx.closePath();
  }

  points.forEach((point, index) => {
    const pointNext = points[index === points.length - 1 ? 0 : index + 1];

    ctx.beginPath();
    ctx.arc(
      0,
      0,
      RADIUS,
      point - Math.PI / 2 + OFFSET_ALPHA,
      pointNext - Math.PI / 2 - OFFSET_ALPHA,
      false
    );
    ctx.strokeStyle = isActive === index ? "#1fbca5" : "#babdc4";
    ctx.stroke();
    ctx.closePath();
  });
  ctx.restore();

  //   requestAnimationFrame(() => drawLine(...arguments));
}

export default {
  props: {
    name: {
      type: String,
      required: true
    },
    srcAvatar: {
      type: String
    },
    count: {
      type: Number,
      default: 0,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    lastActivity: {
      type: Object
    },
    to: {
      type: String
    },
    online: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    count(newValue, oldValue) {
      if (newValue > 0 && newValue !== oldValue) {
        this.draw();
      }
    }
  },
  methods: {
    draw() {
      if (this.$refs.canvas) {
        drawLine(this.$refs.canvas, this.count, this.active ? 0 : -1);
      }
    }
  },
  mounted() {
    this.draw();
  }
};
</script>

<style lang="scss" scoped>
canvas {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
</style>
