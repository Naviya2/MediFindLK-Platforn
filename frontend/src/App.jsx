import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import Search from './pages/Search'
import Report from './pages/Report'
import LoginPage from './pages/LoginPage'
import RequireAuth from './auth/RequireAuth'
import { ROLES } from './auth/roles'
import CitizenPortal from './pages/portal/CitizenPortal'
import PharmacistPortal from './pages/portal/PharmacistPortal'
import AdminPortal from './pages/portal/AdminPortal'
import './App.css'

function App() {
  return (
    <Routes>
      {/* Auth screens use their own minimal shell (AuthLayout), not the site Layout. */}
      <Route path="login" element={<LoginPage />} />

      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="search-medicines" element={<Search />} />
        <Route path="report-stock-issue" element={<Report />} />

        {/* Role-gated portals. Each RequireAuth only lets its own role through. */}
        <Route element={<RequireAuth roles={[ROLES.CITIZEN]} />}>
          <Route path="portal/citizen" element={<CitizenPortal />} />
        </Route>
        <Route element={<RequireAuth roles={[ROLES.PHARMACIST]} />}>
          <Route path="portal/pharmacist" element={<PharmacistPortal />} />
        </Route>
        <Route element={<RequireAuth roles={[ROLES.ADMIN]} />}>
          <Route path="portal/admin" element={<AdminPortal />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
