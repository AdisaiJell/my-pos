<script setup lang="ts">
import { ref } from 'vue'
import EmailCard from './EmailCard.vue'
import NewPasswordCard from './NewPasswordCard.vue'
import { provide } from 'vue'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { useLoadingStore } from '@/stores/loading'

const tab = ref(1)
provide('tab', tab)
const userStore = useUserStore()
const loadingStore = useLoadingStore()

function backToLogin() {
  loadingStore.doLoad()
  setTimeout(() => {
    router.replace({ name: 'login' })
    setTimeout(() => {
      userStore.clear()
    }, 0.1 * 1000)
    router.replace({ name: 'login' })
    loadingStore.finishLoad()
  }, 0.3 * 1000)
}
</script>
<template>
  <v-app class="app">
    <div>
      <v-btn variant="text" icon="mdi-arrow-left" @click="backToLogin"></v-btn>
    </div>
    <div
      style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.8;
      "
    >
      <v-card>
        <v-tabs v-model="tab" bg-color="primary" v-if="!tab ? true : false">
          <v-tab :value="1">Item One</v-tab>
          <v-tab :value="2">Item Two</v-tab>
          <v-tab :value="3">Item Three</v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item :value="1">
            <email-card></email-card>
          </v-window-item>
          <v-window-item :value="2">
            <new-password-card></new-password-card>
          </v-window-item>
          <v-window-item :value="3"> </v-window-item>
        </v-window>
      </v-card>
    </div>
  </v-app>
</template>
<style scoped>
.app {
  background-color: grey; /* กำหนดสีพื้นหลังเป็นสีดำ */
}
</style>
