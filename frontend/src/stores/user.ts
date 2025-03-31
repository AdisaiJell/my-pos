import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/User'
import userService from '@/services/user'
import { useLoadingStore } from './loading'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', () => {
  const loadingStore = useLoadingStore()
  const authStore = useAuthStore()
  const initialUser: User & { files: File[] } = {
    email: '',
    password: '',
    fullName: '',
    salaryRate: 0,
    gender: 'ชาย',
    image: 'noimage.jpg',
    role: { id: 1, name: 'พนักงาน' },
    files: []
  }
  const users = ref<User[]>([])

  const editedUser = ref<User & { files: File[] }>(JSON.parse(JSON.stringify(initialUser)))

  const dialog = ref(false)
  const dialogDelete = ref(false)
  const editAccountDialog = ref(false)
  const oldPass = ref('')
  const changePasswordDialog = ref(false)

  async function editAccount(item: User) {
    clear()
    if (item.id) {
      await getUser(item.id)
    }
    editAccountDialog.value = true
  }

  async function openChangePasswordDialog(item: User) {
    clear()
    if (item.id) {
      await getUser(item.id)
    }
    changePasswordDialog.value = true
  }

  async function changePassword() {
    loadingStore.doLoad()
    const user = await userService.changePassword(editedUser.value, oldPass.value)
    loadingStore.finishLoad()
    if (user.data) {
      oldPass.value = ''
    }
    return user
  }

  async function openDelDialog(item: User) {
    clear()
    if (item.id) {
      await getUser(item.id)
    }
    dialogDelete.value = true
  }

  function clear() {
    editedUser.value = JSON.parse(JSON.stringify(initialUser))
  }

  async function getUsers() {
    loadingStore.doLoad()
    const res = await userService.getUsers()
    users.value = res.data
    console.log(users.value)
    loadingStore.finishLoad()
  }

  async function getUsersByUser(user: User) {
    loadingStore.doLoad()
    const res = await userService.getUsersByUser(user)
    users.value = res.data
    console.log(users.value)
    loadingStore.finishLoad()
  }

  async function getUser(id: number) {
    const res = await userService.getUser(id)
    editedUser.value = res.data
  }

  async function getUserByEmail() {
    loadingStore.doLoad()
    try {
      const res = await userService.getUserByEmail(editedUser.value.email)
      const { password, ...result } = res.data
      editedUser.value = result
    } catch (e) {
      loadingStore.finishLoad()
    }
    loadingStore.finishLoad()
  }

  async function saveUser() {
    loadingStore.doLoad()
    const user = editedUser.value
    console.log(user.role)
    if (!user.id) {
      //Add user
      console.log('Post', JSON.stringify(user))
      await userService.addUser(user)
    } else {
      //Update user
      console.log('Patch', JSON.stringify(user))
      const res = await userService.updateUser(user)
      console.log('After Patch', res.data)
      if (user.id === authStore.getCurrentUser()?.id) {
        console.log('enter logout')
        authStore.logout()
        return
      }
    }
    await getUsers()
    loadingStore.finishLoad()
  }

  async function deleteUser() {
    loadingStore.doLoad()
    const user = editedUser.value
    await userService.deleteUser(user)
    await getUsers()
    loadingStore.finishLoad()
  }

  return {
    oldPass,
    editAccountDialog,
    editedUser,
    users,
    dialog,
    dialogDelete,
    initialUser,
    changePasswordDialog,
    getUsersByUser,
    changePassword,
    openChangePasswordDialog,
    clear,
    saveUser,
    openDelDialog,
    editAccount,
    getUsers,
    getUser,
    getUserByEmail,
    deleteUser
  }
})
