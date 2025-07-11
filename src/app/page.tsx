import Link from 'next/link'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { TrendingUp, Bot, Shield, BarChart3, Zap, Users, Globe, Star, ArrowRight, Play } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Agent Invest
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <Zap className="h-4 w-4" />
              AI-Powered Investment Platform
            </div>
            <h1 className="text-6xl sm:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Deploy <span className="gradient-text">AI Agents</span> to
              <br />Trade for You
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Create and manage up to 50 AI-powered investment agents, each with unique strategies. 
              Track performance, optimize returns, and let artificial intelligence work for your portfolio 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn-primary group">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="btn-primary group">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </SignedIn>
              <button className="btn-secondary group">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </button>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                10,000+ Active Users
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                4.9/5 Rating
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Available Worldwide
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides all the tools and features you need to build, test, and deploy intelligent trading agents.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-8 group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">50+ AI Strategies</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose from diverse pre-built strategies or create your own custom algorithms with our intuitive builder.
              </p>
            </div>
            <div className="card p-8 group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Risk-Free Testing</h3>
              <p className="text-gray-600 leading-relaxed">
                Test strategies safely with paper trading before deploying real capital. Perfect your approach risk-free.
              </p>
            </div>
            <div className="card p-8 group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Real-time Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor performance, P&L, and agent decisions in real-time with advanced analytics and insights.
              </p>
            </div>
            <div className="card p-8 group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Live Trading</h3>
              <p className="text-gray-600 leading-relaxed">
                Graduate to live trading with seamless broker integration. Deploy agents to real markets with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategy Examples */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Proven Trading Strategies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI agents implement sophisticated strategies that have been tested across various market conditions.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-bl-3xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">NEW</span>
              </div>
              <h3 className="font-bold text-xl mb-3">Value Investing</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Warren Buffett-inspired strategy focusing on undervalued stocks with strong fundamentals and long-term growth potential.
              </p>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">Average Return</span>
                <span className="text-green-600 font-bold text-xl">+12.3%</span>
              </div>
            </div>
            <div className="card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-bl-3xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">HOT</span>
              </div>
              <h3 className="font-bold text-xl mb-3">Momentum Trading</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Rides market trends using advanced technical indicators and volume analysis for optimized short-term gains.
              </p>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium">Average Return</span>
                <span className="text-blue-600 font-bold text-xl">+18.7%</span>
              </div>
            </div>
            <div className="card p-8 relative overflow-hidden">
              <h3 className="font-bold text-xl mb-3">Sentiment Analysis</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                AI analyzes news sentiment, social media trends, and market data to predict price movements and optimize entry points.
              </p>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <span className="text-gray-700 font-medium">Average Return</span>
                <span className="text-purple-600 font-bold text-xl">+15.2%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative gradient-bg rounded-3xl p-12 text-center text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Start Trading with AI?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of investors who are already using our platform to optimize their portfolios and maximize returns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="bg-white text-gray-900 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-lg">
                      Get Started Free
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard" className="bg-white text-gray-900 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-lg inline-block">
                    Go to Dashboard
                  </Link>
                </SignedIn>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-gray-900 transition-colors text-lg">
                  Schedule Demo
                </button>
              </div>
              <div className="mt-8 text-sm opacity-75">
                No credit card required • 30-day free trial • Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">Agent Invest</span>
            </div>
            <div className="text-center text-gray-400">
              © 2025 Agent Invest. All rights reserved. Built with ❤️ for traders.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
