# Investment AI Agent Platform

A comprehensive platform for managing multiple AI-powered investment agents with real-time trading capabilities, performance tracking, and strategy management.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Git
- Supabase account
- Clerk account
- Alpaca Markets account
- OpenAI/Anthropic API keys

### Environment Setup

1. **Clone the repository**
```bash
git clone https://github.com/msanchezgrice/agentpm.git
cd agentpm
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**
Copy `.env.local.example` to `.env.local` and fill in the remaining variables:

```env
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase (✅ Already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Polygon.io (✅ Already configured)
POLYGON_API_KEY=your_polygon_api_key

# Alpaca Markets (Required for trading)
ALPACA_KEY_ID=your_alpaca_key_id
ALPACA_SECRET_KEY=your_alpaca_secret_key

# AI Models (Required for agents)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Database Setup

1. **Apply the database schema**
```bash
# In your Supabase dashboard, run the SQL from:
supabase/schema-complete.sql
```

2. **Verify tables created**
Check that these tables exist in your Supabase project:
- `users`, `strategies`, `agents`, `trades`, `performance_metrics`, `trading_sessions`, `audit_logs`, `subscription_tiers`

### Development

```bash
npm run dev
```

Visit `http://localhost:3000`

## 🏗️ Architecture

### Core Components

**Frontend (Next.js 14)**
- App Router with TypeScript
- Tailwind CSS styling
- Clerk authentication
- Real-time updates

**Backend (Supabase)**
- PostgreSQL database
- Row Level Security
- Real-time subscriptions
- Edge functions

**Trading Integration**
- Alpaca Markets API
- Polygon.io market data
- Risk management
- Paper/live trading modes

**AI Agents**
- Multiple LLM support
- Custom strategies
- Performance tracking
- Automated trading

### Database Schema

```sql
-- Key tables and relationships
users (1) -> (*) agents
strategies (1) -> (*) agents  
agents (1) -> (*) trades
agents (1) -> (*) performance_metrics
```

## 🎯 Features

### ✅ MVP Features (Completed)
- Multi-tenant user management
- Agent creation and management
- Strategy system (predefined/custom/marketplace)
- Paper trading support
- Performance tracking
- Subscription tiers
- Security and compliance

### 🚧 Next Development Phase
- [ ] Alpaca API integration
- [ ] Real-time market data
- [ ] AI agent engine
- [ ] Dashboard UI components
- [ ] Strategy execution
- [ ] Performance analytics

## 🔧 Development Guide

### Project Structure
```
agent-invest-platform/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── dashboard/       # Protected dashboard
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Landing page
│   ├── lib/
│   │   ├── supabase/        # Database client
│   │   ├── alpaca/          # Trading API (to be added)
│   │   ├── polygon/         # Market data (to be added)
│   │   └── agents/          # AI agent engine (to be added)
│   └── middleware.ts        # Auth middleware
├── supabase/
│   └── schema-complete.sql  # Database schema
└── [config files]
```

### Next Steps

1. **Set up Clerk Authentication**
   - Create Clerk application
   - Configure sign-in/sign-up flows
   - Test authentication

2. **Implement Alpaca Integration**
   - Create trading client
   - Test paper trading
   - Implement order management

3. **Build Agent Engine**
   - LLM integration
   - Strategy execution logic
   - Risk management

4. **Create Dashboard UI**
   - Agent management interface
   - Performance charts
   - Trade history

## 📊 Subscription Tiers

| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Agents | 5 | 25 | 999 |
| Paper Trading | ✅ | ✅ | ✅ |
| Live Trading | ❌ | ✅ | ✅ |
| API Calls/Month | 10K | 100K | Unlimited |
| Custom Strategies | ❌ | ✅ | ✅ |
| Advanced Analytics | ❌ | ✅ | ✅ |

## 🛡️ Security

- Row Level Security (RLS) on all tables
- Encrypted API key storage
- Audit logging
- Permission-based access control
- User data isolation

## 📈 Performance

- Database indexes on critical queries
- Real-time data streaming
- Optimized API calls
- Caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
