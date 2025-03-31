import type { Receipt } from '@/types/Receipt'
import http from './http'
import type { Size } from '@/types/Size'
import type { ReceiptItem } from '@/types/ReceiptItem'
import type { Type } from '@/types/Type'
import type { User } from '@/types/User'

type ReceiptDto = {
  receiptItems: {
    productId: number
    qty: number
    size?: Size
    type?: Type
    sweetLv?: string
  }[]
  paymentType: string
  promoDiscount: number
  memberDiscount: number
  memberId?: number
  promotionId?: number
  userId?: number
}

function saveReceipt(receipt: Receipt, receiptItems: ReceiptItem[]) {
  const receiptDto: ReceiptDto = {
    receiptItems: [],
    promoDiscount: receipt.promotionDiscount,
    memberDiscount: receipt.memberDiscount,
    paymentType: receipt.paymentType,
    userId: receipt.userId
  }
  if (receipt.member) {
    receiptDto.memberId = receipt.member.id
  }
  if (receipt.promotionId) {
    receiptDto.promotionId = receipt.promotionId
  }
  receiptDto.receiptItems = receiptItems.map((item) => {
    return {
      productId: item.productId,
      qty: item.unit,
      size: item.size,
      type: item.type,
      sweetLv: item.sweetLv
    }
  })
  return http.post('/receipts', receiptDto)
}

function updateReceipt(receipt: Receipt) {
  return http.patch(`/receipts/${receipt.id}`, receipt)
}

function deleteReceipt(id: number) {
  return http.delete('/receipts/' + id)
}

function getReceipts() {
  return http.get('/receipts')
}

function getReceiptsByUser(user: User) {
  return http.get(`/receipts/user/${user.id}`)
}

function getReceiptsByDate(startDate: string, endDate: string, user: User) {
  console.log(startDate)
  console.log(endDate)
  return http.get(`/receipts/date/${startDate}/${endDate}/${user.id}`)
}

function getReceipt(id: number) {
  return http.get(`/receipts/${id}`)
}

export default {
  getReceipts,
  getReceiptsByDate,
  getReceiptsByUser,
  getReceipt,
  saveReceipt,
  updateReceipt,
  deleteReceipt
}
