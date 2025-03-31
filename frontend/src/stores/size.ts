import { ref } from 'vue'
import { defineStore } from 'pinia'
import sizeService from '@/services/size'
import type { Size } from '@/types/Size'

export const useSizeStore = defineStore('size', () => {
  const sizes = ref<Size[]>([])

  async function getSizes() {
    const res = await sizeService.getSizes()
    sizes.value = res.data
  }
  return { sizes, getSizes }
})
