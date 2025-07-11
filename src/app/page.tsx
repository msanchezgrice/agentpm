import Link from 'next/link'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { TrendingUp, Bot, Shield, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-brand-primary mr-2" />
              <span className="font-bold text-xl">Agent Invest</span>
            </div>
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Deploy AI Agents to Trade for You
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create and manage up to 50 AI-powered investment agents, each with unique strategies. 
            Track performance, optimize returns, and let artificial intelligence work for your portfolio.
          </p>
          <div className="flex gap-4 justify-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-8 py-3 bg-brand-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Get Started Free
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="px-8 py-3 bg-brand-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Go to Dashboard
              </Link>
            </SignedIn>
            <Link href="#features" className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <Bot className="h-12 w-12 text-brand-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">50+ AI Strategies</h3>
            <p className="text-gray-600">
              Choose from diverse pre-built strategies or create your own custom algorithms.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <Shield className="h-12 w-12 text-brand-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Paper Trading</h3>
            <p className="text-gray-600">
              Test strategies risk-free with paper trading before going live.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <BarChart3 className="h-12 w-12 text-brand-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Real-time Analytics</h3>
            <p className="text-gray-600">
              Monitor performance, P&L, and agent decisions in real-time.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <TrendingUp className="h-12 w-12 text-brand-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Live Trading</h3>
            <p className="text-gray-600">
              Graduate to live trading with Alpaca Markets integration.
            </p>
          </div>
        </div>
      </div>

      {/* Strategy Examples */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Example Strategies</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Value Investing</h3>
              <p className="text-sm text-gray-600 mb-4">
                Warren Buffett-inspired strategy focusing on undervalued stocks with strong fundamentals.
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Avg Return</span>
                <span className="text-success font-semibold">+12.3%</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Momentum Trading</h3>
              <p className="text-sm text-gray-600 mb-4">
                Rides trends using technical indicators and volume analysis for short-term gains.
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Avg Return</span>
                <span className="text-success font-semibold">+18.7%</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold mb-2">News Sentiment</h3>
              <p className="text-sm text-gray-600 mb-4">
                AI analyzes news sentiment and social media to predict market movements.
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Avg Return</span>
                <span className="text-success font-semibold">+15.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-brand-primary rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Start Trading with AI Today
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of investors using AI to optimize their portfolios.
          </p>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-8 py-3 bg-white text-brand-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Started Free
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="inline-block px-8 py-3 bg-white text-brand-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-sm text-gray-500">
            © 2025 Agent Invest. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
