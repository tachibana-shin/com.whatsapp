<template>
  <v-card
    color="transparent"
    class="mx-4 pa-4 fill-height my-auto mx-auto"
    width="100%"
    max-width="450px"
    loading
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
      <h1 class="text-h5 text-center mt-1">Reset password</h1>

      <v-stepper
        v-model="step"
        alt-labels
        style="background-color: transparent"
      >
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card-text class="font-weight-regular">
              <v-form
                @submit.prevent="sendOTP"
                lazy-validation
                v-model="errors[0]"
                ref="forrmInputEmail"
              >
                <div style="margin-top: 35px">
                  <v-text-field
                    label="E-mail"
                    prepend-icon="mdi-email-outline"
                    type="email"
                    required
                    :rules="[rules.required, rules.email]"
                    v-model="email"
                    hint="Input your Email to reset password"
                  ></v-text-field>
                </div>

                <div class="mx-1 mt-4">
                  <v-btn
                    max-width="300px"
                    rounded
                    block
                    large
                    class="mx-auto mt-3"
                    color="green-main"
                    type="submit"
                  >
                    Send OTP
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-card-text class="font-weight-regular">
              <v-form
                @submit.prevent="validOTP"
                lazy-validation
                v-model="errors[1]"
                ref="forrmInputOTP"
              >
                <div class="mx-1 mt-4">
                  <div style="margin-top: 35px">
                    <v-text-field
                      label="OTP"
                      prepend-icon="mdi-clover"
                      type="text"
                      required
                      :rules="[rules.required, rules.length(5)]"
                      v-model="otp"
                      hint="Check your email and find password"
                    ></v-text-field>
                  </div>

                  <v-btn
                    max-width="300px"
                    rounded
                    block
                    large
                    class="mx-auto mt-3"
                    color="green-main"
                    type="submit"
                  >
                    Validate OTP
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-card-text class="font-weight-regular">
              <div class="text-center mt-1">New Password</div>

              <v-form
                @submit.prevent="setNewPassword"
                lazy-validation
                v-model="errors[2]"
                ref="forrmInputNewPassword"
              >
                <div class="mx-1 mt-4">
                  <div style="margin-top: 35px">
                    <v-text-field
                      label="New Password"
                      prepend-icon="mdi-lock-outline"
                      required
                      :rules="[rules.required]"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPassword ? 'text' : 'password'"
                      @click:append="showPassword = !showPassword"
                      v-model="newPassword"
                    ></v-text-field>
                  </div>

                  <v-btn
                    max-width="300px"
                    rounded
                    block
                    large
                    class="mx-auto"
                    color="green-main mt-3"
                    type="submit"
                  >
                    Done
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-stepper-content>
        </v-stepper-items>
        <v-stepper-header>
          <v-stepper-step
            :complete="step > 1"
            step="1"
            :rules="[() => errors[0]]"
          >
            Send OTP
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
            :complete="step > 2"
            step="2"
            :rules="[() => errors[1]]"
          >
            Verify OTP
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="3" :rules="[() => errors[2]]">
            Input New Password
          </v-stepper-step>
        </v-stepper-header>
      </v-stepper>
    </v-card-text>
  </v-card>
</template>

<script>
import rules from "~/rules";

export default {
  auth: "guest",
  meta: {
    navbar: false
  },
  data() {
    return {
      email: "",
      otp: "",
      newPassword: "",
      showPassword: false,

      step: 1,
      rules,

      errors: [true, true, true],
      loading: true
    };
  },

  methods: {
    sendOTP() {
      this.$refs.forrmInputEmail.validate();
      // this.loading[0] = true;
      this.step = 2;
    },
    validOTP() {
      this.$refs.forrmInputOTP.validate();
      this.step = 3;
    },
    setNewPassword() {
      this.$refs.forrmInputOTP.validate();
    }
  }
};
</script>
