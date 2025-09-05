import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { RequireAuth } from './components/RequireAuth'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CarsPage from './pages/CarsPage'
import CarDetailPage from './pages/CarDetailPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import TestimonialsPage from './pages/TestimonialsPage'
import LoginPage from './pages/admin/LoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import CarsAdminPage from './pages/admin/CarsAdminPage'
import CarForm from './components/admin/CarForm'
import BlogAdminPage from './pages/admin/BlogAdminPage'
import TestimonialsAdminPage from './pages/admin/TestimonialsAdminPage'
import ContactAdminPage from './pages/admin/ContactAdminPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="cars" element={<CarsPage />} />
          <Route path="cars/:id" element={<CarDetailPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<LoginPage />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          } 
        />
        <Route 
          path="/admin/cars" 
          element={
            <RequireAuth>
              <CarsAdminPage />
            </RequireAuth>
          } 
        />
        <Route 
          path="/admin/cars/add" 
          element={
            <RequireAuth>
              <CarForm />
            </RequireAuth>
          } 
        />
        <Route 
          path="/admin/cars/edit/:id" 
          element={
            <RequireAuth>
              <CarForm />
            </RequireAuth>
          } 
        />
        <Route 
          path="/admin/blog" 
          element={
            <RequireAuth>
              <BlogAdminPage />
            </RequireAuth>
          } 
        />
        <Route 
          path="/admin/testimonials" 
          element={
            <RequireAuth>
              <TestimonialsAdminPage />
            </RequireAuth>
          } 
        />
        <Route 
          path="/admin/contact" 
          element={
            <RequireAuth>
              <ContactAdminPage />
            </RequireAuth>
          } 
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App


