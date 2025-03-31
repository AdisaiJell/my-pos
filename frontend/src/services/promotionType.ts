import http from './http'

function getPromotionTypes() {
  return http.get('/promotion-types')
}

function getPromotionType(id: number) {
  return http.get(`/promotion-types/${id}`)
}

export default { getPromotionTypes, getPromotionType }
