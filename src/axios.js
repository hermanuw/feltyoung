import axios from 'axios'

const token = localStorage.getItem('accessToken')

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // ganti jika backend kamu beda
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
  },
})

export default axiosInstance
