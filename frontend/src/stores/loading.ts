import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', () => {
  const loading = ref(false)

  function doLoad() {
    loading.value = true
  }

  function finishLoad() {
    loading.value = false
  }
  return { loading, doLoad, finishLoad }
})
