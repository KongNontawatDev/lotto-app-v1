import axios from 'axios'

export const apiClient = axios.create({
  baseURL: '/',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // eslint-disable-next-line no-console
    console.error('API error', error)
    return Promise.reject(error)
  },
)
