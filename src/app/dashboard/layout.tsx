'use client'

import { UserButton, useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  LayoutDashboard, 
  Bot, 
  TrendingUp, 
  Settings, 
  DollarSign,
  BarChart3,
  FileText,
  Menu,
  Loader2
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // Protect this layout with client-side auth check
  useEffect(() => {
    if (isLoaded) {
      setLoading(false)
      if (!userId) {
        router.push('/sign-in')
      }
    }
  }, [isLoaded, userId, router])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-gray-700">Loading...</span>
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (!userId) {
    return null
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-brand-primary mr-2" />
              <span className="font-bold text-xl">Agent Invest</span>
            </div>
            <div className="flex items-center gap-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <LayoutDashboard className="h-5 w-5" />
              <span>Overview</span>
            </Link>
            <Link href="/dashboard/agents" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <Bot className="h-5 w-5" />
              <span>AI Agents</span>
            </Link>
            <Link href="/dashboard/markets" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <TrendingUp className="h-5 w-5" />
              <span>Markets</span>
            </Link>
            <Link href="/dashboard/strategies" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <FileText className="h-5 w-5" />
              <span>Strategies</span>
            </Link>
            <Link href="/dashboard/portfolio" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <DollarSign className="h-5 w-5" />
              <span>Portfolio</span>
            </Link>
            <Link href="/dashboard/analytics" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <BarChart3 className="h-5 w-5" />
              <span>Analytics</span>
            </Link>
            <Link href="/dashboard/trades" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <FileText className="h-5 w-5" />
              <span>Trade History</span>
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
