import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const axiosInstance = axios.create({
  baseURL: 'https://feltyoung-be.up.railway.app/api',
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

    console.log('Interceptor error:', err) // <-- Log error

    // If 401 error and refresh token exists, try to refresh
    if (err.response?.status === 401 && !originalRequest._retry && auth.refreshToken) {
      originalRequest._retry = true

      // Ensure refreshToken is available
      if (!auth.refreshToken) {
        auth.logout()
        router.push('/') // Redirect to login page if no refresh token
        return Promise.reject(new Error('No refresh token found'))
      }

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
        const res = await axios.post('https://feltyoung-be.up.railway.app/api/auth/token/refresh', {
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
        router.push('/') // Redirect to login on refresh token failure
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(err)
  },
)

export default axiosInstance
