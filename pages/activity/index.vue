<template>
  <v-card flat color="transparent" class="fill-height" width="100%">
    <!-- <app-list class="pa-0 mx-n2" /> -->
    <v-list class="pa-0 mx-n2" color="transparent" multiple>
      <app-list-activity-item
        name="Trạng thái của tôi"
        :count="i[`count-activity`]"
        :src-avatar="i[`avatar`]"
        :last-activity="i[`last-activity`]"
        :to="`/activity/${i._id}`"
        v-if="i[`last-activity`]"
      >
        <vue-timeagojs
          :time="i[`last-activity`].created"
          :delay="60000"
          slot="time"
        />
      </app-list-activity-item>
      <app-list-activity-item
        name="Trạng thái của tôi"
        :count="i[`count-activity`]"
        :src-avatar="i[`avatar`]"
        v-else
      >
        <template v-slot:time>
          Nhấn để thêm trạng thái
        </template>
      </app-list-activity-item>
      <app-list-activity-item
        v-for="(item, index) in other"
        :key="index"
        :name="item[`name`]"
        :count="item[`count-activity`]"
        :src-avatar="item[`avatar`]"
        :online="item[`is-online`]"
        :to="`/activity/${item._id}`"
        :last-activity="item[`last-activity`]"
      >
        <vue-timeagojs
          :time="item[`last-activity`].created"
          :delay="60000"
          lang="vi_VN"
          slot="time"
        />
      </app-list-activity-item>
    </v-list>

    <v-teleport to="fab">
      <div>
        <v-fab-transition>
          <v-btn
            color="#00cc3f"
            fab
            absolute
            bottom
            right
            style="bottom: 16px"
            dark
            @click="postImage"
          >
            <v-icon> mdi-camera </v-icon>
          </v-btn>
        </v-fab-transition>

        <v-btn
          color="#edf5f7"
          fab
          absolute
          bottom
          right
          class="black--text"
          width="45px"
          height="45px"
          small
          style="bottom: 85px; right: 24px; transform: translateX(0%)"
          to="/activity/new"
        >
          <v-icon> mdi-pencil </v-icon>
        </v-btn>
      </div>
    </v-teleport>
  </v-card>
</template>

<script>
import selectFile from "~/helpers/selectFile";

function drawLine(canvas, size, count) {
  const ctx = canvas.getContext("2d");
  const RADIUS = size;
  const OFFSET_ALPHA = (6 * Math.PI) / 180;

  ctx.lineWidth = 3;
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
      RADIUS,
      RADIUS,
      RADIUS,
      point - Math.PI / 2 + OFFSET_ALPHA,
      pointNext - Math.PI / 2 - OFFSET_ALPHA,
      false
    );
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
  });
}

export default {
  async asyncData({ $axios }) {
    const {
      data: { i, other }
    } = await $axios.get(`/activity`);

    return {
      i,
      other
    };
  },
  methods: {
    async postImage() {
      const files = await selectFile("image/*");

      files.forEach(async file => {
        const form = new FormData();

        form.append("photo", file);

        await this.$axios.post(`/activity`, form);
      });
    }
  }
};
</script>
