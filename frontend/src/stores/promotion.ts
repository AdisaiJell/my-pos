import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Promotion } from '@/types/Promotion'
import { useLoadingStore } from './loading'
import promotionService from '@/services/promotion'

export const usePromotionStore = defineStore('promotion', () => {
  const loadingStore = useLoadingStore()
  const promotions = ref<Promotion[]>([])

  const newPromotionDialog = ref(false)
  const delPromotionDialog = ref(false)

  const initialPromotion: Promotion = {
    name: '',
    startDate: '',
    endDate: '',
    discount: 25,
    minimum: 0,
    promoProducts: []
  }

  const editedPromotion = ref<Promotion>(JSON.parse(JSON.stringify(initialPromotion)))

  async function getPromotions() {
    loadingStore.doLoad()
    const res = await promotionService.getPromotions()
    promotions.value = res.data
    loadingStore.finishLoad()
  }

  async function getPromotion(id: number) {
    const res = await promotionService.getPromotion(id)
    //fomat date for v-model with v-text-field(type datetime-local) in NewPromotionDialog
    const { startDate, endDate, ...result } = res.data
    const formatStartDate = formatDate(new Date(startDate))
    const formatEndDate = formatDate(new Date(endDate))
    editedPromotion.value = result
    editedPromotion.value.startDate = formatStartDate
    editedPromotion.value.endDate = formatEndDate
  }

  function formatDate(date: Date): string {
    const newDateFormat =
      [
        date.getFullYear(),
        (date.getMonth() + 1).toString().padStart(2, '0'),
        date.getDate().toString().padStart(2, '0')
      ].join('-') +
      'T' +
      [
        date.getHours().toString().padStart(2, '0'),
        date.getMinutes().toString().padStart(2, '0')
      ].join(':')
    return newDateFormat
  }

  async function savePromotion() {
    loadingStore.doLoad()
    const promotion = editedPromotion.value
    if (!promotion.id) {
      console.log('Save Promotion', promotion)
      await promotionService.savePromotion(promotion)
    } else {
      await promotionService.updatePromotion(promotion)
    }
    await getPromotions()
    loadingStore.finishLoad()
  }

  async function deletePromotion() {
    loadingStore.doLoad()
    const promotion = editedPromotion.value
    if (promotion.id) {
      await promotionService.deletePromotion(promotion.id)
    }
    await getPromotions()
    loadingStore.finishLoad()
  }

  function clear() {
    editedPromotion.value = JSON.parse(JSON.stringify(initialPromotion))
  }

  return {
    promotions,
    editedPromotion,
    newPromotionDialog,
    delPromotionDialog,
    getPromotions,
    getPromotion,
    savePromotion,
    deletePromotion,
    clear
  }
})
