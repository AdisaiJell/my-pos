import type { User } from '@/types/User'
import http from './http'

function addUser(user: User & { files: File[] }) {
  const formData = new FormData()
  formData.append('email', user.email)
  formData.append('password', user.password)
  formData.append('fullName', user.fullName)
  formData.append('gender', user.gender)
  formData.append('salaryRate', user.salaryRate + '')
  formData.append('role', JSON.stringify(user.role))
  formData.append('branch', JSON.stringify(user.branch))
  if (user.files && user.files.length > 0) {
    formData.append('file', user.files[0])
  }
  return http.post('/users', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

function updateUser(user: User & { files: File[] }) {
  const formData = new FormData()
  formData.append('email', user.email)
  formData.append('password', user.password)
  formData.append('fullName', user.fullName)
  formData.append('gender', user.gender)
  formData.append('role', JSON.stringify(user.role))
  if (user.branch) {
    formData.append('branch', JSON.stringify(user.branch))
  }
  if (user.salaryRate) {
    formData.append('salaryRate', user.salaryRate + '')
  }
  if (user.files && user.files.length > 0) {
    formData.append('file', user.files[0])
  }
  return http.post(`/users/${user.id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

function changePassword(user: User, oldPass: string) {
  const email = user.email
  const newPass = user.password
  return http.post('/users/change-password', { email, oldPass, newPass })
}

function deleteUser(user: User) {
  return http.delete(`/users/${user.id}`)
}

function getUsers() {
  return http.get('/users')
}

function getUser(id: number) {
  return http.get(`/users/${id}`)
}

function getUsersByUser(user: User) {
  return http.get(`/users/user/${user.id}`)
}

function getUserByEmail(email: string) {
  return http.post('/users/email', { email })
}

export default {
  getUsersByUser,
  getUsers,
  getUser,
  getUserByEmail,
  addUser,
  updateUser,
  deleteUser,
  changePassword
}
