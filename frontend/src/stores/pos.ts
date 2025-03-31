import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Product } from '@/types/Product'
import { useReceiptStore } from './receipt'
import type { ReceiptItem } from '@/types/ReceiptItem'
import productService from '@/services/product'
import promotionService from '@/services/promotion'
import { useLoadingStore } from './loading'
import { useProductStore } from './product'
import { usePromotionStore } from './promotion'
import { useMemberStore } from './member'
import memberService from '@/services/member'

export const usePosStore = defineStore('pos', () => {
  const receiptStore = useReceiptStore()
  const productStore = useProductStore()
  const memberStore = useMemberStore()
  const promotionStore = usePromotionStore()
  const loadingStore = useLoadingStore()
  const initialProduct: ReceiptItem = {
    name: '',
    price: 0,
    unit: 0,
    total: 0,
    productId: -1,
    product: {
      name: '',
      image: '',
      price: 0,
      category: {
        id: 0,
        name: ''
      }
    }
  }

  const selectedProduct = ref<ReceiptItem>(JSON.parse(JSON.stringify(initialProduct)))
  const productDialog = ref(false)

  function openProductDialog(p: Product) {
    selectedProduct.value.product = p
    if (p.category.name === 'drink') {
      productDialog.value = true
      selectedProduct.value.name = selectedProduct.value.product.name
      selectedProduct.value.price = selectedProduct.value.product.price
      selectedProduct.value.unit = 1
      selectedProduct.value.productId = selectedProduct.value.product.id!
    } else {
      selectedProduct.value.name = selectedProduct.value.product.name
      selectedProduct.value.price = selectedProduct.value.product.price
      selectedProduct.value.unit = 1
      selectedProduct.value.productId = selectedProduct.value.product.id!
      saveSelectedProduct()
    }
  }

  function saveSelectedProduct() {
    if (selectedProduct.value.size) {
      const size = selectedProduct.value.size
      if (size.name === 'm') {
        selectedProduct.value.price += 5
      } else if (size.name === 'l') {
        selectedProduct.value.price += 10
      }
    }
    receiptStore.addReceiptItem(selectedProduct.value)
    clear()
  }

  function clear() {
    selectedProduct.value = JSON.parse(JSON.stringify(initialProduct))
  }

  async function initialProducts() {
    const res = await productService.getProducts()
    productStore.products = res.data
  }

  async function initialMembers() {
    const res = await memberService.getMembers()
    memberStore.members = res.data
  }

  async function initialPromotions() {
    const res = await promotionService.getPromotions()
    promotionStore.promotions = res.data
  }
  async function initialPos() {
    loadingStore.doLoad()
    await initialProducts()
    initialMembers()
    initialPromotions()
    loadingStore.finishLoad()
  }

  return {
    selectedProduct,
    productDialog,
    clear,
    initialPos,
    openProductDialog,
    saveSelectedProduct
  }
})
