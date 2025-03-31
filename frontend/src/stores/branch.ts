import { ref } from 'vue'
import { defineStore } from 'pinia'
import branchService from '@/services/branch'
import type { Branch } from '@/types/Branch'

export const useBranchStore = defineStore('branch', () => {
  const branches = ref<Branch[]>([])

  async function getBranches() {
    const res = await branchService.getBranches()
    branches.value = res.data
  }
  return { branches, getBranches }
})
