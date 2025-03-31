import type { Branch } from './Branch'
import type { Member } from './Member'
import type { Promotion } from './Promotion'
import type { ReceiptItem } from './ReceiptItem'
import type { User } from './User'

type Receipt = {
  id?: number
  createdDate: Date
  memberDiscount: number
  promotionDiscount: number
  totalBefore: number
  total: number
  receiptAmount: number
  change: number
  paymentType: string
  branch?: Branch
  userId?: number
  user: User | null
  memberId?: number
  member?: Member | null
  promotionId?: number
  promotion?: Promotion | null
  receiptItems?: ReceiptItem[]
}

export type { Receipt }
