import type { Product } from './Product'
import type { PromotionType } from './PromotionType'

export type Promotion = {
  id?: number
  name: string
  startDate: string
  endDate: string
  discount: number
  minimum: number
  promotionType?: PromotionType
  promoProducts: Product[]
}
