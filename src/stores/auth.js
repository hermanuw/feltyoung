import { defineStore } from 'pinia'
import axios from '@/axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),

  actions: {
    // Set token and user data to state and localStorage
    setTokens(accessToken, refreshToken) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    },

    // Set user data to state and localStorage
    setUser(user) {
      // Validasi jika user adalah objek yang valid
      if (user && typeof user === 'object') {
        this.user = user
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        console.error('Invalid user data:', user) // Log jika data user invalid
      }
    },

    // Logout and clear state and localStorage
    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      router.push('/') // Redirect to login page
    },

    // Register user
    async register({ name, email, phone_number, password }) {
      try {
        const response = await axios.post('/register', {
          name,
          email,
          phone_number,
          password,
        })

        // Store tokens and user data
        const { accessToken, refreshToken, user } = response.data
        this.setTokens(accessToken, refreshToken)
        this.setUser(user)

        return response
      } catch (err) {
        throw err // Re-throw the error to handle it in the component
      }
    },

    // Login user
    async login(email, password) {
      try {
        const response = await axios.post('/login', { email, password })
        const { accessToken, refreshToken, user } = response.data

        // Store tokens and user data
        this.setTokens(accessToken, refreshToken)
        this.setUser(user)

        return response
      } catch (err) {
        throw err // Re-throw the error to handle it in the component
      }
    },

    // Refresh access token if expired
    async refreshAccessToken() {
      try {
        const response = await axios.post('/auth/token/refresh', {
          refreshToken: this.refreshToken,
        })

        const { accessToken, refreshToken } = response.data
        this.setTokens(accessToken, refreshToken)

        return accessToken
      } catch (error) {
        this.logout() // Logout if refresh fails
        throw error
      }
    },

    // Fetch user data
    async fetchUser() {
      try {
        if (!this.accessToken) throw new Error('No access token')

        const response = await axios.get('/whoami', {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        })

        this.setUser(response.data)
      } catch (error) {
        if (this.refreshToken) {
          try {
            await this.refreshAccessToken()
            await this.fetchUser() // retry after refresh
          } catch (err) {
            this.logout()
            throw err
          }
        } else {
          this.logout()
          throw error
        }
      }
    },
  },
})
