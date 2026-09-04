import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import Home from './pages/Home'
import Search from './pages/Search'
import PharmacyNetwork from './pages/PharmacyNetwork'
import Report from './pages/Report'
import LoginPage from './pages/LoginPage'
import RequireAuth from './auth/RequireAuth'
import { ROLES } from './auth/roles'
import CitizenPortal from './pages/portal/CitizenPortal'
import PharmacistDashboard from './pages/PharmacistDashboard'
import AdminDashboard from './pages/AdminDashboard'
import './App.css'

function App() {
  return (
    <Routes>
      {/* Auth screens use their own minimal shell (AuthLayout), not the site Layout. */}
      <Route path="login" element={<LoginPage />} />

      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="home-preview" element={<Home />} />
        <Route path="search-medicines" element={<Search />} />
        <Route path="pharmacy-network" element={<PharmacyNetwork />} />
        <Route path="report-stock-issue" element={<Report />} />

        {/* Role-gated portals. Each RequireAuth only lets its own role through. */}
        <Route element={<RequireAuth roles={[ROLES.CITIZEN]} />}>
          <Route path="portal/citizen" element={<CitizenPortal />} />
        </Route>
        <Route element={<RequireAuth roles={[ROLES.PHARMACIST]} />}>
          <Route path="portal/pharmacist" element={<PharmacistDashboard />} />
        </Route>
        <Route element={<RequireAuth roles={[ROLES.ADMIN]} />}>
          <Route path="portal/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
