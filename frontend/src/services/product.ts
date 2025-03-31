import type { Product } from '@/types/Product'
import http from './http'

function addProduct(product: Product & { files: File[] }) {
  const formData = new FormData()
  formData.append('name', product.name)
  formData.append('price', product.price + '')
  formData.append('category', JSON.stringify(product.category))
  formData.append('sizes', JSON.stringify(product.sizes))
  formData.append('types', JSON.stringify(product.types))
  if (product.files && product.files.length > 0) {
    formData.append('file', product.files[0])
  }
  return http.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
}

function updateProduct(product: Product & { files: File[] }) {
  const formData = new FormData()
  formData.append('name', product.name)
  formData.append('price', product.price + '')
  formData.append('category', JSON.stringify(product.category))
  formData.append('sizes', JSON.stringify(product.sizes))
  formData.append('types', JSON.stringify(product.types))
  if (product.files && product.files.length > 0) {
    formData.append('file', product.files[0])
  }
  return http.post(`/products/${product.id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

function deleteProduct(product: Product) {
  return http.delete(`/products/${product.id}`)
}

function getProducts() {
  return http.get('/products')
}

function getProduct(id: number) {
  return http.get(`/products/${id}`)
}

export default { getProducts, getProduct, addProduct, updateProduct, deleteProduct }
