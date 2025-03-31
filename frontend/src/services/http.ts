import router from '@/router'
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3000'
})

function delay(sec: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(sec), sec * 300)
  })
}

instance.interceptors.request.use(
  async function (config) {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  async function (res) {
    await delay(1)
    return res
  },
  function (error) {
    if (error.response.status === 401) {
      router.replace('/login')
    }
    return Promise.reject(error)
  }
)

export default instance
