import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type Product } from '@/types/Product'
import { useLoadingStore } from './loading'
import productService from '@/services/product'

export const useProductStore = defineStore('product', () => {
  const loadingStore = useLoadingStore()
  const initialProduct: Product & { files: File[] } = {
    name: '',
    price: 0,
    category: { id: 1, name: 'เครื่องดื่ม' },
    sizes: [
      { id: 1, name: 's' },
      { id: 2, name: 'm' },
      { id: 3, name: 'l' }
    ],
    types: [
      { id: 1, name: 'ร้อน' },
      { id: 2, name: 'เย็น' },
      { id: 3, name: 'ปั่น' }
    ],
    image: 'noimage.jpg',
    files: []
  }
  const products = ref<Product[]>([])

  const newProductDialog = ref(false)
  const delProductDialog = ref(false)
  const productDelDialog = ref(false)
  const editedProduct = ref<Product & { files: File[] }>(JSON.parse(JSON.stringify(initialProduct)))

  //new function
  async function getProducts() {
    loadingStore.doLoad()
    const res = await productService.getProducts()
    products.value = res.data
    console.log(products.value)
    loadingStore.finishLoad()
  }

  async function getProduct(id: number) {
    const res = await productService.getProduct(id)
    editedProduct.value = res.data
  }

  async function saveProduct() {
    loadingStore.doLoad()
    const product = editedProduct.value

    if (!product.id) {
      //Add product
      console.log('Post', JSON.stringify(product))
      await productService.addProduct(product)
    } else {
      //Update product
      console.log('Patch', JSON.stringify(product))
      const res = await productService.updateProduct(product)
      console.log('After Patch', res.data)
    }
    await getProducts()
    loadingStore.finishLoad()
  }

  async function deleteProduct() {
    loadingStore.doLoad()
    const product = editedProduct.value
    await productService.deleteProduct(product)
    await getProducts()
    loadingStore.finishLoad()
  }

  function clear() {
    editedProduct.value = JSON.parse(JSON.stringify(initialProduct))
  }

  return {
    products,
    newProductDialog,
    delProductDialog,
    productDelDialog,
    editedProduct,
    saveProduct,
    getProduct,
    getProducts,
    clear,
    deleteProduct
  }
})
