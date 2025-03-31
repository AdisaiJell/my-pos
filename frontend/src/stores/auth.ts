import { ref } from 'vue'
import { defineStore } from 'pinia'
import authService from '@/services/auth'
import { useRouter } from 'vue-router'
import type { User } from '@/types/User'
import { useLoadingStore } from './loading'
import { useReceiptStore } from './receipt'

export const useAuthStore = defineStore('auth', () => {
  const receiptStore = useReceiptStore()
  const loadintStore = useLoadingStore()
  const logoutDialog = ref(false)
  const router = useRouter()

  const currentUser = ref<User | null>(null)

  const email = ref('')
  const password = ref('')

  async function login() {
    loadintStore.doLoad()
    try {
      const res = await authService.login(email.value, password.value)
      console.log(res.data)
      currentUser.value = res.data.user
      console.log('currentUser ', currentUser.value)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      localStorage.setItem('access_token', res.data.access_token)
      console.log('Login success')
      router.replace({ name: 'pos' })
    } catch (e: any) {
      console.log(e.message)
    }
    loadintStore.finishLoad()
  }

  function logout() {
    closeLogoutDialog()

    loadintStore.doLoad()
    setTimeout(() => {
      router.replace({ name: 'login' })
      //clear
      localStorage.removeItem('user')
      email.value = ''
      password.value = ''
      currentUser.value = null
      receiptStore.clear()
      loadintStore.finishLoad()
    }, 0.3 * 1000)
  }

  function getCurrentUser(): User | null {
    const strUser = localStorage.getItem('user')
    if (!strUser) return null
    currentUser.value = JSON.parse(strUser)
    return JSON.parse(strUser)
  }

  function getToken(): string | null {
    const strToken = localStorage.getItem('access_token')
    if (!strToken) return null
    return strToken
  }

  function openLogoutDialog() {
    logoutDialog.value = true
  }

  function closeLogoutDialog() {
    logoutDialog.value = false
  }

  return {
    email,
    password,
    logoutDialog,
    currentUser,
    getCurrentUser,
    getToken,
    login,
    logout,
    openLogoutDialog,
    closeLogoutDialog
  }
})
