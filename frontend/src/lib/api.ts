import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/admin'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (data: { username?: string; email?: string }) =>
    api.put('/auth/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
    api.put('/auth/change-password', data),
}

// Cars API
export const carsAPI = {
  getAll: (params?: {
    page?: number
    limit?: number
    brand?: string
    model?: string
    minPrice?: number
    maxPrice?: number
    minYear?: number
    maxYear?: number
    maxMileage?: number
    fuelType?: string
    transmission?: string
    bodyType?: string
    color?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) =>
    api.get('/cars', { params }),
  
  getFeatured: () =>
    api.get('/cars/featured'),
  
  getById: (id: string) =>
    api.get(`/cars/${id}`),
  
  search: (params: {
    q: string
    page?: number
    limit?: number
    minPrice?: number
    maxPrice?: number
    minYear?: number
    maxYear?: number
    maxMileage?: number
    fuelType?: string
    transmission?: string
    bodyType?: string
  }) =>
    api.get('/cars/search', { params }),
  
  create: (data: FormData) =>
    api.post('/cars', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  update: (id: string, data: FormData) =>
    api.put(`/cars/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  delete: (id: string) =>
    api.delete(`/cars/${id}`),
  
  createInquiry: (id: string, data: {
    name: string
    email: string
    phone?: string
    message: string
  }) =>
    api.post(`/cars/${id}/inquiry`, data),
  
  getInquiries: (id: string) =>
    api.get(`/cars/${id}/inquiries`),
}

// Helper to resolve image URLs consistently
export const resolveImageUrl = (pathOrUrl?: string): string => {
  if (!pathOrUrl) return ''
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl
  }
  const apiBase: string = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:5000/api'
  // Derive origin by removing trailing /api if present and any trailing slashes
  const origin = apiBase.replace(/\/?api\/?$/, '').replace(/\/+$/, '')
  // Ensure leading slash on resource path
  const resourcePath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${origin}${resourcePath}`
}

// Tiny inline SVG placeholder for car thumbnails
export const FALLBACK_CAR_THUMB =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <rect width="96" height="96" rx="12" fill="#e5e7eb"/>
  <g fill="#9ca3af" transform="translate(16,24)">
    <rect x="0" y="24" width="64" height="12" rx="6" />
    <circle cx="14" cy="48" r="6" />
    <circle cx="50" cy="48" r="6" />
    <rect x="10" y="8" width="44" height="18" rx="6" />
  </g>
</svg>`)




// Testimonials API
export const testimonialsAPI = {
  getApproved: (params?: { page?: number; limit?: number }) =>
    api.get('/testimonials/approved', { params }),
  
  getAll: (params?: { page?: number; limit?: number; approved?: boolean }) =>
    api.get('/testimonials', { params }),
  
  getById: (id: string) =>
    api.get(`/testimonials/${id}`),
  
  create: (data: {
    name: string
    email?: string
    content: string
    rating?: number
    carId?: number
  }) =>
    api.post('/testimonials', data),
  
  update: (id: string, data: {
    name?: string
    email?: string
    content?: string
    rating?: number
    isApproved?: boolean
  }) =>
    api.put(`/testimonials/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/testimonials/${id}`),
  
  approve: (id: string) =>
    api.patch(`/testimonials/${id}/approve`),
}

// Contact API
export const contactAPI = {
  createInquiry: (data: {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
  }) =>
    api.post('/contact/inquiry', data),
  
  subscribeNewsletter: (data: { email: string }) =>
    api.post('/contact/newsletter', data),
  
  getAllInquiries: (params?: { page?: number; limit?: number; unread?: boolean }) =>
    api.get('/contact/inquiries', { params }),
  
  getInquiryById: (id: string) =>
    api.get(`/contact/inquiries/${id}`),
  
  markAsRead: (id: string) =>
    api.patch(`/contact/inquiries/${id}/read`),
  
  deleteInquiry: (id: string) =>
    api.delete(`/contact/inquiries/${id}`),
  
  getNewsletterSubscriptions: (params?: { page?: number; limit?: number; active?: boolean }) =>
    api.get('/contact/newsletter', { params }),
}

export default api


