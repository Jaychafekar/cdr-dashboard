import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import App from './App'
import Login from './Login'
import Register from './Register'
import CallLogsPage from './CallLogsPage'
import ReportsPage from './ReportsPage'
import CustomersPage from './CustomersPage'
import TrunksPage from './TrunksPage'
import SecurityPage from './SecurityPage'
import SettingsPage from './SettingsPage'
import SupportPage from './SupportPage'
import './index.css'


function ProtectedRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/trunks" element={<ProtectedRoute><TrunksPage /></ProtectedRoute>} />
      <Route path="/security" element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      />
      <Route
        path="/call-logs"
        element={
          <ProtectedRoute>
            <CallLogsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  </StrictMode>
)