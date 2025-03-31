import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { ReceiptItem } from '@/types/ReceiptItem'
import type { Receipt } from '@/types/Receipt'
import { useAuthStore } from './auth'
import { useMemberStore } from './member'
import { useProductStore } from './product'
import receiptService from '@/services/receipt'
import { useLoadingStore } from './loading'
import { usePromotionStore } from './promotion'
import type { Promotion } from '@/types/Promotion'
import type { User } from '@/types/User'

export const useReceiptStore = defineStore('receipt', () => {
  const receipts = ref<Receipt[]>([])
  const loadingStore = useLoadingStore()
  const promotionStore = usePromotionStore()
  const productStore = useProductStore()
  const authStore = useAuthStore()
  const memberStore = useMemberStore()

  const promotionForSnackBar = ref<Promotion | null>()
  const promotionSnackbar = ref(false)
  const availablePromotion = ref<Promotion[]>([])

  const receipt = ref<Receipt>({
    createdDate: new Date(),
    memberDiscount: 0,
    promotionDiscount: 0,
    totalBefore: 0,
    total: 0,
    receiptAmount: 0,
    change: 0,
    paymentType: 'cash',
    user: authStore.currentUser,
    userId: authStore.currentUser?.id,
    receiptItems: []
  })
  const receiptDialog = ref(false)
  const paymentDialog = ref(false)
  const payType = ref('')
  const openDialog = ref(false)
  const cash = ref(0)
  const cancelReceiptDialog = ref(false)
  const receiptItems = ref<ReceiptItem[]>([])
  let maxDiscount = 0

  const initialReceipt: Receipt = {
    createdDate: new Date(),
    memberDiscount: 0,
    promotionDiscount: 0,
    totalBefore: 0,
    total: 0,
    receiptAmount: 0,
    change: 0,
    paymentType: 'cash',
    user: authStore.currentUser,
    userId: authStore.currentUser?.id,
    receiptItems: []
  }

  const editedReceipt = ref<Receipt>(JSON.parse(JSON.stringify(initialReceipt)))
  async function getReceipts() {
    loadingStore.doLoad()
    const res = await receiptService.getReceipts()
    receipts.value = res.data
    loadingStore.finishLoad()
  }

  async function getReceiptsWithDate(startDate: string, endDate: string, user: User) {
    loadingStore.doLoad()
    const res = await receiptService.getReceiptsByDate(startDate, endDate, user)
    receipts.value = res.data
    loadingStore.finishLoad()
  }

  async function getReceiptsByUser(user: User) {
    loadingStore.doLoad()
    const res = await receiptService.getReceiptsByUser(user)
    receipts.value = res.data
    console.log(receipt.value)
    loadingStore.finishLoad()
  }

  async function getReceipt(item: Receipt) {
    if (item.id) {
      const res = await receiptService.getReceipt(item.id)
      editedReceipt.value = res.data
    }
  }

  async function saveReceipt() {
    loadingStore.doLoad()
    receipt.value.paymentType = payType.value
    receipt.value.user = authStore.currentUser
    receipt.value.userId = authStore.currentUser?.id
    await receiptService.saveReceipt(receipt.value, receiptItems.value)
    await memberStore.updateCurrentMember()
    clear()
    loadingStore.finishLoad()
  }

  function addReceiptItem(receiptItem: ReceiptItem) {
    let index = -1
    if (receiptItem.product?.category.name === 'drink') {
      index = receiptItems.value.findIndex(
        (item: ReceiptItem) =>
          item.product?.id === receiptItem.product?.id &&
          item.size?.id === receiptItem.size?.id &&
          item.type?.id === receiptItem.type?.id &&
          item.sweetLv === receiptItem.sweetLv
      )
    } else {
      index = receiptItems.value.findIndex(
        (item: ReceiptItem) => item.product?.id === receiptItem.product?.id
      )
    }

    if (index > -1) {
      receiptItems.value[index].unit++
    } else {
      receiptItems.value.push(receiptItem)
    }
  }

  function removeReceiptItem(receiptItem: ReceiptItem) {
    const index = receiptItems.value.findIndex((item) => item === receiptItem)
    receiptItems.value.splice(index, 1)
  }

  function inc(item: ReceiptItem) {
    item.unit++
  }
  function dec(item: ReceiptItem) {
    if (item.unit === 1) {
      removeReceiptItem(item)
    } else {
      item.unit--
    }
  }

  function calReceipt() {
    let totalBefore = 0
    for (const item of receiptItems.value) {
      totalBefore += item.price * item.unit
    }
    receipt.value.totalBefore = totalBefore
    receipt.value.total = totalBefore

    if (memberStore.currentMember && promotionForSnackBar.value) {
      if (totalBefore - memberStore.usePoint / 5 <= 0) {
        receipt.value.memberDiscount = memberStore.usePoint / 5
        receipt.value.promotionDiscount = maxDiscount
        receipt.value.total = 0
      } else {
        receipt.value.memberDiscount = memberStore.usePoint / 5
        receipt.value.promotionDiscount = maxDiscount
        receipt.value.total =
          receipt.value.totalBefore - receipt.value.memberDiscount - receipt.value.promotionDiscount
      }
    } else if (memberStore.currentMember) {
      if (totalBefore - memberStore.usePoint / 5 <= 0) {
        receipt.value.total = 0
      } else {
        receipt.value.memberDiscount = memberStore.usePoint / 5
        receipt.value.total = receipt.value.totalBefore - receipt.value.memberDiscount
      }
    } else if (promotionForSnackBar.value) {
      receipt.value.promotionDiscount = maxDiscount
      receipt.value.total = receipt.value.totalBefore - receipt.value.promotionDiscount
    }

    //CalDiscount

    productStore.clear()
  }

  function showReceiptDialog() {
    receipt.value.receiptItems = receiptItems.value
    receiptDialog.value = true
  }

  function showPaymentDialog() {
    paymentDialog.value = true
  }

  function calChange() {
    console.log('calChange')
    if (cash.value > receipt.value.total && receipt.value.total !== 0) {
      receipt.value.change = cash.value - receipt.value.total
    } else {
      receipt.value.change = 0
    }
  }

  function checkAndChoosePromotion() {
    calReceipt()

    //Check promotion condition and assign in availablePromotion
    availablePromotion.value = []
    for (const receiptItem of receiptItems.value) {
      for (const promotion of promotionStore.promotions) {
        if (promotion.promoProducts.find((p) => p.id === receiptItem.product?.id)) {
          const index = availablePromotion.value.findIndex((item) => item.id === promotion.id)
          if (
            index < 0 &&
            receipt.value.totalBefore >= promotion.minimum &&
            new Date(promotion.endDate) >= new Date()
          ) {
            availablePromotion.value.push(promotion)
          }
        }
      }
    }
    console.log(availablePromotion.value.map((item) => item.name).join(','))

    //Choose best promotion(ลดเยอะสุด)
    maxDiscount = 0
    if (availablePromotion.value.length > 0) {
      //find maxDiscount
      maxDiscount = Math.max(...availablePromotion.value.map((item) => item.discount))
      maxDiscount = receipt.value.totalBefore * maxDiscount
      for (const promotion of availablePromotion.value) {
        if (promotion.promotionType?.name !== 'ส่วนลด') {
          const arrProductIdInPromotion = promotion.promoProducts.map((item) => item.id)
          const productInPromotionInReceipt = []
          for (const id of arrProductIdInPromotion) {
            const index = receiptItems.value.findIndex((item) => item.product?.id === id)
            if (index >= 0) {
              productInPromotionInReceipt.push(receiptItems.value[index])
            }
          }
          const maxProductPrice = Math.max(...productInPromotionInReceipt.map((item) => item.price))
          console.log('maxProductPrice', maxProductPrice, ' maxDiscount', maxDiscount)
          if (maxDiscount < maxProductPrice) {
            maxDiscount = maxProductPrice
            promotionForSnackBar.value = promotion
            promotionSnackbar.value = true
          }
        }
      }
      console.log('maxDiscount ', maxDiscount)

      //find promotion that value discount === maxDiscount
      for (const promotion of availablePromotion.value) {
        if (promotion.discount * receipt.value.totalBefore === maxDiscount) {
          promotionForSnackBar.value = promotion
          promotionSnackbar.value = true
          break
        }
      }
    }
    calReceipt()
  }

  watch(
    receiptItems,
    () => {
      promotionSnackbar.value = false
      setTimeout(() => checkAndChoosePromotion(), 0.1 * 1000)
    },
    { deep: true }
  )

  function clear() {
    memberStore.clear()
    payType.value = ''
    receipt.value = {
      createdDate: new Date(),
      memberDiscount: 0,
      promotionDiscount: 0,
      totalBefore: 0,
      total: 0,
      receiptAmount: 0,
      change: 0,
      paymentType: 'cash',
      user: authStore.currentUser,
      userId: authStore.currentUser?.id
    }
    receiptItems.value = []
    promotionForSnackBar.value = null
  }

  return {
    promotionForSnackBar,
    promotionSnackbar,
    availablePromotion,
    receipts,
    openDialog,
    payType,
    paymentDialog,
    cash,
    receiptItems,
    receipt,
    receiptDialog,
    cancelReceiptDialog,
    editedReceipt,
    getReceiptsWithDate,
    getReceiptsByUser,
    getReceipt,
    getReceipts,
    saveReceipt,
    calChange,
    showPaymentDialog,
    addReceiptItem,
    removeReceiptItem,
    inc,
    dec,
    calReceipt,
    showReceiptDialog,
    clear
  }
})
