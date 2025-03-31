import { ref } from 'vue'
import { defineStore } from 'pinia'
import typeService from '@/services/type'
import type { Type } from '@/types/Type'

export const useTypeStore = defineStore('type', () => {
  const types = ref<Type[]>([])

  async function getTypes() {
    const res = await typeService.getTypes()
    types.value = res.data
  }
  return { types, getTypes }
})
