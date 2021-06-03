<template>
  <v-card flat color="transparent" class="text-center">
    <app-invite-friends />
    <v-teleport to="fab">
      <v-fab-transition>
        <div>
          <v-fab-transition>
            <v-btn
              color="#00cc3f"
              fab
              absolute
              bottom
              right
              style="bottom: 16px"
            >
              <v-icon> mdi-phone-forward </v-icon>
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
          >
            <v-icon> mdi-video </v-icon>
          </v-btn>
        </div>
      </v-fab-transition>
    </v-teleport>
  </v-card>
</template>
