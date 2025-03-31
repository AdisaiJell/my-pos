import { ref } from 'vue'
import { defineStore } from 'pinia'
import promotionTypeService from '@/services/promotionType'
import type { PromotionType } from '@/types/PromotionType'

export const usePromotionTypeStore = defineStore('promotionType', () => {
  const promotionPromotionTypes = ref<PromotionType[]>([])

  async function getPromotionTypes() {
    const res = await promotionTypeService.getPromotionTypes()
    promotionPromotionTypes.value = res.data
  }
  return { promotionPromotionTypes, getPromotionTypes }
})
