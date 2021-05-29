<template>
  <v-card flat color="transparent" class="text-center">
    <v-card-text>
      <div class="invite-friends font-weight-regular mt-7">Mời bạn bè</div>
      <div class="not-contact-use mt-1">
        Không người nào trong danh bạ của bạn đang sử dụng WhatsApp. Hãy dùng
        nút bên dưới để mời họ sử dụng.
      </div>

      <div class="mx-3">
        <v-btn block color="#00cc3f" class="mt-7" dark large max-width="300px">
          Mời bạn bè
        </v-btn>
      </div>

      <div class="chat-friends text--secondary mt-10">
        Chat với bạn bè sử dụng WhatsApp trên điện thoại iPhone, Android hoặc
        KaiOS.
      </div>
    </v-card-text>

    <v-teleport to="fab">
      <v-fab-transition>
        <v-btn color="#00cc3f" fab absolute bottom right style="bottom: 16px">
          <v-icon> mdi-android-messages </v-icon>
        </v-btn>
      </v-fab-transition>
    </v-teleport>
  </v-card>
</template>
<style lang="scss" scoped>
.invite-friends {
  font-size: 24px !important;
  font-weight: 400;
  line-height: 1.25;
  // color: #fff;
  //   height: 55px;
}
</style>
