import { ref } from 'vue'
import { defineStore } from 'pinia'
import categoryService from '@/services/category'
import type { Category } from '@/types/Category'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])

  async function getCategories() {
    const res = await categoryService.getCategories()
    categories.value = res.data
  }
  return { categories, getCategories }
})
