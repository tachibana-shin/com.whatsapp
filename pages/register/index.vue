<template>
  <v-card
    color="transparent"
    class="mx-4 pa-4 my-auto mx-auto"
    width="100%"
    max-width="450px"
    :loading="loading"
    flat
  >
    <template v-slot:progress>
      <v-progress-linear
        color="blue"
        height="3px"
        width="100%"
        rounded
        indeterminate
      />
    </template>

    <v-card-text class="font-weight-regular mx-auto fill-height pb-0">
      <v-avatar class="d-block mx-auto" size="90px">
        <v-img :src="require(`~/assets/icon.png`)"></v-img>
      </v-avatar>

      <h1 class="text-body-1 font-weight-regular text-center">
        Tạo tài khoản mới
      </h1>
    </v-card-text>

    <v-stepper v-model="step" alt-labels style="box-shadow: none" flat>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card-text class="font-weight-regular mx-auto fill-height">
            <v-form @submit.prevent="register" ref="formRegister">
              <div style="margin-top: 35px">
                <v-text-field
                  label="Tên người dùng"
                  prepend-icon="mdi-account"
                  required
                  type="text"
                  name="name"
                  :rules="[rules.required]"
                  v-model="name"
                  autocomplete="false"
                >
                </v-text-field>
                <v-text-field
                  label="E-mail"
                  prepend-icon="mdi-email-outline"
                  type="email"
                  name="Username"
                  required
                  :rules="[rules.required, rules.email]"
                  v-model="email"
                  autocomplete="false"
                ></v-text-field>
                <v-text-field
                  label="Password"
                  prepend-icon="mdi-lock-outline"
                  required
                  name="password"
                  :rules="[rules.required]"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  v-model="password"
                  autocomplete="false"
                ></v-text-field>
              </div>

              <div class="mx-1 mt-4 text-right">
                <v-btn max-width="300px" color="green-main" type="submit" dark>
                  Next
                </v-btn>
              </div>
            </v-form>

            <div
              style="margin-top: 14px"
              class="text-center text-caption text--secondary"
            >
              Có tài khoản? Login
            </div>
          </v-card-text>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-form @submit.prevent="done" ref="formDone">
            <div style="margin-top: 35px">
              <v-text-field
                label="OTP"
                prepend-icon="mdi-clover"
                type="text"
                required
                :rules="[rules.required, rules.length(5)]"
                v-model="otp"
                centered
                hint="Check your email and find password"
                class="text-center"
              ></v-text-field>
            </div>

            <div class="mx-1 mt-4 text-right">
              <v-btn max-width="300px" color="green-main" type="submit" dark>
                Done
              </v-btn>
            </div>
          </v-form>
        </v-stepper-content>
      </v-stepper-items>

      <v-stepper-header class="d-flex flex-nowrap">
        <v-stepper-step :complete="step > 1" step="1">
          Send OTP
        </v-stepper-step>
        <v-stepper-step :complete="step > 2" step="2">
          Complete
        </v-stepper-step>
      </v-stepper-header>
    </v-stepper>
  </v-card>
</template>

<script>
import rules from "~/rules";

export default {
  auth: "guest",
  watchQuery: ["token"],
  meta: {
    navbar: false
  },
  data() {
    return {
      name: "",
      email: "",
      password: "",
      loading: false,
      otp: "",
      rules,
      showPassword: false
    };
  },
  async asyncData({ query: { token } }) {
    return {
      step: token ? 2 : 1
    };
  },
  methods: {
    async register() {
      try {
        this.loading = true;

        const {
          data: { token }
        } = await this.$axios.post("/auth/register", {
          email: this.email,
          password: this.password,
          name: this.name
        });

        this.$router.push({
          ...this.$route,
          query: {
            token
          }
        });

        this.step = 2;
      } catch (e) {
        /// e.response.data.message
        this.$toast.error(e.response.data.message || "REGISTER_FAILED");
      } finally {
        this.loading = false;
      }
    },
    async done() {
      try {
        this.loading = true;

        const {
          data: { message }
        } = await this.$axios.post("/auth/valid-account", {
          token: this.$route.query.token,
          otp: this.otp
        });

        this.$toast.success(message);

        this.$router.push("/login");
      } catch (e) {
        /// e.response.data.message
        this.$toast.error(e.response.data.message || "REGISTER_FAILED");
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
