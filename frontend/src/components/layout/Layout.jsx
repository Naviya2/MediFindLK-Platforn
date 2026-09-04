import { Outlet } from 'react-router-dom'
import TopNoticeBar from './TopNoticeBar'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'

/** Shared site shell: notice bar, header, routed page, footer. */
function Layout() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <TopNoticeBar />
      <SiteHeader />
      <main className="flex-1 w-full bg-background">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}

export default Layout
