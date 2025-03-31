import type { Product } from './Product'
import type { Size } from './Size'
import type { Type } from './Type'

type ReceiptItem = {
  id?: number
  name: string
  price: number
  unit: number
  total: number
  size?: Size
  type?: Type
  sweetLv?: string
  productId: number
  product?: Product
}

export type { ReceiptItem }
