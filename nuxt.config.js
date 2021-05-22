import colors from "vuetify/es5/util/colors";

export default {
  server: {
    port: 8080,
    host: "0.0.0.0"
  },
  router: {
    middleware: ["meta", "auth"]
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - com.whatsapp",
    title: "com.whatsapp",
    htmlAttrs: {
      lang: "en"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/vue-teleport",
    "~/plugins/vuetify-toast2",
    "~/plugins/nuxt-axios",
    { src: "~/plugins/vue-socket.io-extended", ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify"
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/dotenv",
    "vue-web-cam/nuxt",
    "@nuxtjs/axios",
    "@nuxtjs/auth-next"
  ],

  axios: {
    baseURL: `${process.env.API_URL}`,
    progress: false,
    retry: {
      retries: 3
    }
  },
  auth: {
    strategies: {
      local: {
        token: {
          property: "token",
          // required: true,
          type: "Bearer",
          maxAge: 60 * 60 * 24 * 30
        },
        user: {
          property: "user",
          autoFetch: true
        },
        refreshToken: {
          property: "token",
          type: "Bearer",
          tokenRequired: true,
          data: "refresh_token",
          maxAge: 60 * 60 * 24 * 30
        },
        endpoints: {
          login: {
            url: "/auth/login",
            method: "post"
          },
          logout: {
            url: "/auth/logout",
            method: "post"
          },
          user: {
            url: "/auth/user",
            method: "get"
          },
          refresh: {
            url: "/auth/refresh",
            method: "post"
          }
        }
      },
      google: {
        scheme: "oauth2",
        endpoints: {
          authorization: "https://accounts.google.com/o/oauth2/auth",
          token: undefined,
          userInfo: "https://www.googleapis.com/oauth2/v3/userinfo",
          logout: "https://example.com/logout"
        },
        token: {
          property: "access_token",
          type: "Bearer",
          maxAge: 1800
        },
        refreshToken: {
          property: "refresh_token",
          maxAge: 60 * 60 * 24 * 30
        },
        responseType: "token",
        grantType: "authorization_code",
        accessType: undefined,
        redirectUri: undefined,
        logoutRedirectUri: undefined,
        clientId: "SET_ME",
        scope: ["openid", "profile", "email"],
        state: "UNIQUE_AND_NON_GUESSABLE",
        codeChallengeMethod: "",
        responseMode: "",
        acrValues: ""
        // autoLogout: false
      },
      facebook: {
        endpoints: {
          userInfo:
            "https://graph.facebook.com/v6.0/me?fields=id,name,picture{url}"
        },
        clientId: "...",
        scope: ["public_profile", "email"]
      }
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        light: {
          white: "#ffffff",
          "green-main": "#075e55",
          "green-light": "#00cc3f"
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          white: "#ffffff",
          "green-main": "#075e55",
          "green-light": "#00cc3f"
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      presets({ isServer }, [preset, options]) {
        options.loose = true;
      }
    }
  }
};
