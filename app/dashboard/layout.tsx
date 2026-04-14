'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleMenuClick = () => {
    setIsSidebarOpen(true)
  }

  const handleSidebarClose = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <div className="md:pl-72">
        <main className="pt-20">
          {children}
        </main>
      </div>
    </div>
  )
}