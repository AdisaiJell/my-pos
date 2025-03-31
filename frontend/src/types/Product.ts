import type { Category } from './Category'
import type { Size } from './Size'
import type { Type } from './Type'

export type Product = {
  id?: number
  name: string
  image: string
  types?: Type[]
  sizes?: Size[]
  price: number
  category: Category
}
