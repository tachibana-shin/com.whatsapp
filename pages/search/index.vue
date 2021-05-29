<template>
  <v-row class="fill-height">
    <v-app-bar app fixed height="56px">
      <v-btn icon @click="$router.back()">
        <v-icon> mdi-arrow-left </v-icon>
      </v-btn>

      <v-text-field
        hide-details
        single-line
        placeholder="Tìm kiếm"
        tile
        :loading="loading"
        v-model="query_result"
      ></v-text-field>
    </v-app-bar>

    <v-card flat color="transparent" width="100%">
      <template v-if="!query_result">
        <div
          class="list-history-search mx-4 text-center"
          v-if="history && history[`history-search`].length > 0"
        >
          <v-subheader class="px-0"> Tìm kiếm gần đây </v-subheader>
          <v-row class="mx-n3 my-0">
            <v-col
              cols="3"
              class="pa-0 px-2"
              v-for="(item, index) in history[`history-search`]"
              :key="index"
            >
              <div class="item">
                <app-avatar size="58px" :src="item.avatar" no-badge />
                <div class="name text-truncate">{{ item.name }}</div>
              </div>
            </v-col>
          </v-row>
        </div>

        <v-list>
          <v-subheader> Gợi ý </v-subheader>
          <v-list-item
            v-for="(item, index) in hint"
            :key="index"
            v-ripple
            @click="redirectToUser(item._id)"
          >
            <v-list-item-avatar>
              <app-avatar no-badge :src="item.avatar" />
            </v-list-item-avatar>
            <v-list-item-content>
              {{ item.name }}
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
      <v-list v-else>
        <v-subheader> Kết quả </v-subheader>
        <v-list-item
          v-for="(item, index) in results"
          :key="index"
          v-ripple
          @click="redirectToUser(item._id)"
        >
          <v-list-item-avatar>
            <app-avatar no-badge :src="item.avatar" />
          </v-list-item-avatar>
          <v-list-item-content>
            {{ item.name }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-row>
</template>

<script>
import AppAvatar from "../../components/AppAvatar.vue";

let timeout;
export default {
  components: { AppAvatar },
  meta: {
    navbar: false
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    query_result: {
      get() {
        return this.$route.query.query_result || "";
      },
      set(value) {
        this.$router.push({
          ...this.$route,
          query: {
            ...this.$route.query,
            query_result: value
          }
        });
      }
    }
  },
  async asyncData({ $axios, query: { query_result } }) {
    const {
      data: { history, hint }
    } = await $axios.get(`/search`);

    if (!!query_result) {
      const { data: results } = await $axios.get(`/search`, {
        params: {
          query_result
        }
      });

      return {
        history,
        hint,
        results
      };
    }

    return {
      history,
      hint,
      results: []
    };
  },
  watch: {
    query_result(newValue) {
      clearTimeout(timeout);

      this.loading = true;
      timeout = setTimeout(async () => {
        const { data: results } = await this.$axios.get(`/search`, {
          params: {
            query_result: newValue
          }
        });
        this.loading = false;

        this.results = results;
      }, 1500);
    }
  },
  methods: {
    async redirectToUser(id) {
      await this.$axios.put("/history", {
        id
      });

      this.$router.push(`/chat/${id}`);
    }
  }
};
</script>
