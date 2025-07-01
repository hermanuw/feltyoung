import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router' // ⬅️ Tambahkan ini

const axiosInstance = axios.create({
  baseURL: 'feltyoung-be.up.railway.app/api',
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

axiosInstance.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const auth = useAuthStore()
    const originalRequest = err.config

    if (err.response?.status === 401 && !originalRequest._retry && auth.refreshToken) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`
          return axiosInstance(originalRequest)
        })
      }

      isRefreshing = true

      try {
        const res = await axios.post('http://localhost:3000/api/auth/token/refresh', {
          refreshToken: auth.refreshToken,
        })

        const { accessToken, refreshToken } = res.data
        auth.setTokens(accessToken, refreshToken)

        processQueue(null, accessToken)

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
        return axiosInstance(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        auth.logout()
        router.push('/')
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(err)
  },
)

export default axiosInstance
