<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref, inject, onMounted } from 'vue'

const rail = inject('rail')
const authStore = useAuthStore()
const currentTime = ref(new Date().toLocaleTimeString())
function logout() {
  authStore.openLogoutDialog()
}

onMounted(() => {
  setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString()
  }, 1000) // Update the time every second
})
</script>

<template>
  <v-app-bar
    color="grey-darken-4"
    density="compact"
    style="display: flex; justify-content: space-between"
  >
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="rail = !rail"></v-app-bar-nav-icon>
    </template>

    <img src="/img/CoffeeBeanLogo.png" alt="Logo" style="height: 50px; margin-right: 10px" />

    <v-app-bar-title style="font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif">
      GOODLUCK - COFFEE
    </v-app-bar-title>

    <img src="/img/ClockIcon.png" alt="Logo" style="height: 35px; margin-right: 20px" />
    <span
      style="
        margin-right: 25px;
        font-size: 1.3em;
        font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
        color: white;
      "
      >{{ currentTime }}</span
    >
    <v-btn prepend-icon="mdi-logout" color="amber" @click="logout()">ออกจากระบบ</v-btn>
  </v-app-bar>
</template>
