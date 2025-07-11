export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'admin' | 'user' | 'premium'
          permissions: {
            paper_trading: boolean
            live_trading: boolean
          }
          alpaca_paper_key_encrypted: string | null
          alpaca_live_key_encrypted: string | null
          alpaca_paper_secret_encrypted: string | null
          alpaca_live_secret_encrypted: string | null
          created_at: string
          subscription_tier: 'free' | 'pro' | 'enterprise'
          agent_limit: number
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: 'admin' | 'user' | 'premium'
          permissions?: {
            paper_trading: boolean
            live_trading: boolean
          }
          alpaca_paper_key_encrypted?: string | null
          alpaca_live_key_encrypted?: string | null
          alpaca_paper_secret_encrypted?: string | null
          alpaca_live_secret_encrypted?: string | null
          created_at?: string
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          agent_limit?: number
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'admin' | 'user' | 'premium'
          permissions?: {
            paper_trading: boolean
            live_trading: boolean
          }
          alpaca_paper_key_encrypted?: string | null
          alpaca_live_key_encrypted?: string | null
          alpaca_paper_secret_encrypted?: string | null
          alpaca_live_secret_encrypted?: string | null
          created_at?: string
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          agent_limit?: number
        }
      }
      strategies: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          type: 'predefined' | 'custom' | 'marketplace'
          visibility: 'private' | 'public' | 'marketplace'
          config: any
          performance_stats: any | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          type?: 'predefined' | 'custom' | 'marketplace'
          visibility?: 'private' | 'public' | 'marketplace'
          config: any
          performance_stats?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          type?: 'predefined' | 'custom' | 'marketplace'
          visibility?: 'private' | 'public' | 'marketplace'
          config?: any
          performance_stats?: any | null
          created_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          user_id: string
          name: string
          strategy_id: string
          llm_model: string
          status: 'active' | 'paused' | 'stopped'
          mode: 'paper' | 'live'
          max_position_size: number
          daily_loss_limit: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          strategy_id: string
          llm_model: string
          status?: 'active' | 'paused' | 'stopped'
          mode?: 'paper' | 'live'
          max_position_size?: number
          daily_loss_limit?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          strategy_id?: string
          llm_model?: string
          status?: 'active' | 'paused' | 'stopped'
          mode?: 'paper' | 'live'
          max_position_size?: number
          daily_loss_limit?: number
          created_at?: string
        }
      }
      trades: {
        Row: {
          id: string
          agent_id: string
          session_id: string | null
          symbol: string
          side: 'buy' | 'sell' | 'buy_to_cover' | 'sell_short'
          quantity: number
          price: number
          timestamp: string
          reasoning: string | null
          sentiment_score: number | null
        }
        Insert: {
          id?: string
          agent_id: string
          session_id?: string | null
          symbol: string
          side: 'buy' | 'sell' | 'buy_to_cover' | 'sell_short'
          quantity: number
          price: number
          timestamp?: string
          reasoning?: string | null
          sentiment_score?: number | null
        }
        Update: {
          id?: string
          agent_id?: string
          session_id?: string | null
          symbol?: string
          side?: 'buy' | 'sell' | 'buy_to_cover' | 'sell_short'
          quantity?: number
          price?: number
          timestamp?: string
          reasoning?: string | null
          sentiment_score?: number | null
        }
      }
      performance_metrics: {
        Row: {
          id: string
          agent_id: string
          date: string
          total_return: number
          sharpe_ratio: number | null
          max_drawdown: number | null
          win_rate: number | null
          trades_count: number
        }
        Insert: {
          id?: string
          agent_id: string
          date: string
          total_return: number
          sharpe_ratio?: number | null
          max_drawdown?: number | null
          win_rate?: number | null
          trades_count?: number
        }
        Update: {
          id?: string
          agent_id?: string
          date?: string
          total_return?: number
          sharpe_ratio?: number | null
          max_drawdown?: number | null
          win_rate?: number | null
          trades_count?: number
        }
      }
    }
  }
}
