<template>
  <v-card flat color="transparent">
    <!-- <app-list class="pa-0 mx-n2" /> -->

    <v-teleport to="fab">
      <div>
        <v-fab-transition>
          <v-btn color="#00cc3f" fab absolute bottom right style="bottom: 16px">
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
        >
          <v-icon> mdi-pencil </v-icon>
        </v-btn>
      </div>
    </v-teleport>
  </v-card>
</template>
