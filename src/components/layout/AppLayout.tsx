import { Outlet } from '@tanstack/react-router'

import { Toaster } from '@/components/ui/sonner'

import { BottomNavbar } from './BottomNavbar'
import { Footer } from './Footer'
import { TopNavbar } from './TopNavbar'

export const AppLayout = () => (
  <div className="min-h-screen bg-background text-foreground flex flex-col">
    {/* Top Navbar - แสดงเฉพาะหน้าจอใหญ่ */}
    {/* <div className="hidden lg:block">
      <TopNavbar />
    </div> */}

    <div className="flex-1">
      <Outlet />
    </div>
    {/* <Footer /> */}
    
    {/* Bottom Navbar - แสดงเฉพาะหน้าจอเล็ก */}
    {/* <div className="lg:hidden">
      <BottomNavbar />
    </div> */}
    
    <Toaster />
  </div>
)
