import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get agent configuration
    const { data: config, error } = await supabase
      .from('agent_configurations')
      .select('*')
      .eq('agent_id', id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching configuration:', error)
      return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: 500 })
    }

    if (!config) {
      // Fetch the agent to generate appropriate configuration
      const { data: agent } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single()

      if (!agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
      }

      // Generate strategy-specific configuration
      const strategyConfigs: Record<string, any> = {
        momentum: {
          indicators: ['sma_20', 'sma_50', 'rsi', 'macd'],
          symbols: ['NVDA', 'TSLA', 'META', 'AMD', 'NFLX'],
          timeframe: '15min',
          llm_model: 'gpt-4',
          temperature: 0.8,
          entry_rules: { max_position_size: 0.25, min_confidence: 0.65 },
          exit_rules: { stop_loss: 0.03, take_profit: 0.08 }
        },
        value: {
          indicators: ['pe_ratio', 'pb_ratio', 'dividend_yield'],
          symbols: ['BRK.B', 'JPM', 'WMT', 'JNJ', 'PG'],
          timeframe: '1day',
          llm_model: 'claude-3',
          temperature: 0.6,
          entry_rules: { max_position_size: 0.15, min_confidence: 0.75 },
          exit_rules: { stop_loss: 0.05, take_profit: 0.15 }
        },
        mean_reversion: {
          indicators: ['bollinger_bands', 'rsi', 'stochastic'],
          symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN'],
          timeframe: '1hour',
          llm_model: 'gpt-4-turbo',
          temperature: 0.7,
          entry_rules: { max_position_size: 0.2, min_confidence: 0.7 },
          exit_rules: { stop_loss: 0.02, take_profit: 0.05 }
        },
        arbitrage: {
          indicators: ['spread', 'correlation', 'volume'],
          symbols: ['SPY', 'QQQ', 'IWM', 'DIA', 'VTI'],
          timeframe: '1min',
          llm_model: 'gpt-4',
          temperature: 0.5,
          entry_rules: { max_position_size: 0.3, min_confidence: 0.8 },
          exit_rules: { stop_loss: 0.01, take_profit: 0.02 }
        }
      }

      const strategyConfig = strategyConfigs[agent.strategy_type] || strategyConfigs.momentum

      // Return agent-specific configuration
      return NextResponse.json({
        configuration: {
          agent_id: id,
          indicators: strategyConfig.indicators,
          timeframe: strategyConfig.timeframe,
          symbols: strategyConfig.symbols,
          max_positions: 5,
          position_sizing: 'equal_weight',
          llm_provider: 'openai',
          llm_model: strategyConfig.llm_model,
          temperature: strategyConfig.temperature,
          system_prompt: `You are an expert ${agent.strategy_type} trading AI for ${agent.name}...`,
          analysis_prompt: `Analyze the following market data for ${agent.strategy_type} opportunities...`,
          entry_rules: strategyConfig.entry_rules,
          exit_rules: strategyConfig.exit_rules,
          risk_management: { 
            max_drawdown: agent.risk_tolerance === 'conservative' ? 0.05 : agent.risk_tolerance === 'aggressive' ? 0.2 : 0.1, 
            position_limit: 5 
          },
          backtest_period: '6months',
          commission_rate: 0.001,
          slippage_rate: 0.0005
        }
      })
    }

    return NextResponse.json({ configuration: config })

  } catch (error) {
    console.error('Error in configuration API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updatedConfig = await request.json()

    // Verify the agent belongs to the user
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('user_id')
      .eq('id', id)
      .single()

    if (agentError || !agent || agent.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update configuration
    const { data: config, error } = await supabase
      .from('agent_configurations')
      .upsert({
        agent_id: id,
        ...updatedConfig,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error updating configuration:', error)
      return NextResponse.json({ error: 'Failed to update configuration' }, { status: 500 })
    }

    return NextResponse.json({ configuration: config })

  } catch (error) {
    console.error('Error in configuration API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
