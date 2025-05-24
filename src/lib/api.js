import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // ganti sesuai backend kamu
  withCredentials: true, // jika pakai cookie auth
})

export default api