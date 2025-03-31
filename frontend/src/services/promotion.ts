import type { Promotion } from '@/types/Promotion'
import http from './http'

function savePromotion(promotion: Promotion) {
  return http.post('/promotions', promotion)
}

function updatePromotion(promotion: Promotion) {
  return http.patch(`/promotions/${promotion.id}`, promotion)
}

function deletePromotion(id: number) {
  return http.delete('/promotions/' + id)
}

async function getPromotions() {
  return http.get('/promotions')
}

function getPromotion(id: number) {
  return http.get(`/promotions/${id}`)
}

export default { getPromotions, getPromotion, savePromotion, updatePromotion, deletePromotion }
