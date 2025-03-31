import { ref } from 'vue'
import { defineStore } from 'pinia'
import roleService from '@/services/role'
import type { Role } from '@/types/Role'

export const useRoleStore = defineStore('role', () => {
  const roles = ref<Role[]>([])

  async function getRoles() {
    const res = await roleService.getRoles()
    roles.value = res.data
  }
  return { roles, getRoles }
})
