<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import FullLayout from './layout/FullLayout.vue'
import MainLayout from './layout/MainLayout.vue'
import LoadingDialog from './components/LoadingDialog.vue'

const rail = ref(false)
const drawer = ref(true)
provide('rail', rail)
provide('drawer', drawer)

const route = useRoute()
if (!sessionStorage.getItem('pathBeforeRefresh')) {
  sessionStorage.setItem('pathBeforeRefresh', '/')
}
const backgroundClass = ref(sessionStorage.getItem('pathBeforeRefresh'))
console.log(backgroundClass.value)

watch(
  () => route.path,
  () => {
    console.log('path change')
    backgroundClass.value = sessionStorage.getItem('pathBeforeRefresh')
    console.log(backgroundClass.value)
  }
)
</script>
<template>
  <v-app :class="backgroundClass === '/' || backgroundClass === '/login' ? 'appLogin' : 'appMain'">
    <component :is="route.meta.layout === 'FullLayout' ? FullLayout : MainLayout"></component>
    <loading-dialog></loading-dialog>
  </v-app>
</template>
<style scoped>
.appLogin {
  background-image: url('./img/LoginBackground.png');
  background-size: cover;
  background-repeat: no-repeat;
}
.appMain {
  background-image: url('./img/AppBackground.png');
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
