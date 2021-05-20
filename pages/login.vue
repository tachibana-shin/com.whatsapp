<template>
  <v-card
    color="transparent"
    class="mx-4 pa-4 my-auto mx-auto"
    width="100%"
    max-width="450px"
    :loading="loading"
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
    <v-card-text class="font-weight-regular mx-auto">
      <v-avatar class="d-block mx-auto" size="90px">
        <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
      </v-avatar>

      <v-form @submit.prevent="login" ref="formLogin">
        <div style="margin-top: 35px">
          <v-text-field
            label="Username"
            prepend-icon="mdi-email-outline"
            type="email"
            required
            :rules="[rules.required, rules.email]"
            v-model="email"
          ></v-text-field>
          <v-text-field
            label="Password"
            prepend-icon="mdi-lock-outline"
            required
            :rules="[rules.required]"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            v-model="password"
          ></v-text-field>
        </div>

        <div class="text-right font-weight-light text-caption">
          <nuxt-link
            to="/forgotpasword"
            class="text-decoration-none"
            style="color: inherit"
          >
            Forgot Password?
          </nuxt-link>
        </div>

        <div class="mx-1 mt-4">
          <v-btn
            large
            block
            max-width="300px"
            rounded
            class="mx-auto"
            color="green-main"
            type="submit"
          >
            Login
          </v-btn>
        </div>
      </v-form>

      <div class="text-center text-caption text--secondary divider--or my-4">
        or
      </div>

      <div class="login-with-social text-center">
        <v-btn
          class="mx-2"
          fab
          color="#3b5998"
          width="40px"
          height="40px"
          outlined
        >
          <v-icon> mdi-facebook </v-icon>
        </v-btn>
        <v-btn
          class="mx-2"
          fab
          color="#dd4b39"
          width="40px"
          height="40px"
          outlined
        >
          <v-icon> mdi-google-plus </v-icon>
        </v-btn>
      </div>

      <div
        style="margin-top: 14px"
        class="text-center text-caption font-weight-light text--secondary"
      >
        <nuxt-link
          to="/register"
          class="text-decoration-none"
          style="color: inherit"
        >
          Sign Up for an account?
        </nuxt-link>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  auth: "guest",
  meta: {
    navbar: false
  },
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      rules: {
        required: value => !!value || "Required.",
        counter: value => value.length <= 20 || "Max 20 characters",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        }
      },
      showPassword: false
    };
  },
  methods: {
    async login() {
      if (this.$refs.formLogin.validate()) {
        try {
          this.loading = true;

          await this.$auth.loginWith("local", {
            data: {
              email: this.email,
              password: this.password
            }
          });
        } catch (e) {
          console.log(e);
          /// e.response.data.message
          this.$toast.error(e?.response?.data?.message || "LOGIN_FAILED");
        } finally {
          this.loading = false;
        }
      }
    }
  }
};
</script>
