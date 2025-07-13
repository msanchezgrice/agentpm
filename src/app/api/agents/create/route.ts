import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  // Create Supabase client inside the function to avoid build-time errors
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

    const agentConfig = await request.json()

    // Validate required fields
    if (!agentConfig.name || !agentConfig.strategy_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create the agent in the database
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .insert({
        user_id: userId,
        name: agentConfig.name,
        description: agentConfig.description,
        strategy_type: agentConfig.strategy_type,
        risk_tolerance: agentConfig.risk_tolerance,
        trading_frequency: agentConfig.timeframe === '1day' ? 'daily' : 
                          agentConfig.timeframe === '1hour' ? 'hourly' : 'high_frequency',
        status: 'active', // Set to active immediately
        initial_capital: agentConfig.initial_capital,
        current_capital: agentConfig.initial_capital,
        total_return: 0,
        total_return_pct: 0,
        total_trades: 0,
        winning_trades: 0,
        losing_trades: 0,
        win_rate: 0,
        max_drawdown: 0,
        sharpe_ratio: 0,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (agentError) {
      console.error('Error creating agent:', agentError)
      return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 })
    }

    // Store strategy configuration
    const { error: configError } = await supabase
      .from('agent_configurations')
      .insert({
        agent_id: agent.id,
        // Strategy Config
        indicators: agentConfig.indicators,
        timeframe: agentConfig.timeframe,
        symbols: agentConfig.symbols,
        max_positions: agentConfig.max_positions,
        position_sizing: agentConfig.position_sizing,
        
        // LLM Config
        llm_provider: agentConfig.llm_provider,
        llm_model: agentConfig.llm_model,
        temperature: agentConfig.temperature,
        system_prompt: agentConfig.system_prompt,
        analysis_prompt: agentConfig.analysis_prompt,
        
        // Trading Rules
        entry_rules: agentConfig.entry_rules,
        exit_rules: agentConfig.exit_rules,
        risk_management: agentConfig.risk_management,
        
        // Backtesting
        backtest_period: agentConfig.backtest_period,
        commission_rate: agentConfig.commission_rate,
        slippage_rate: agentConfig.slippage_rate
      })

    if (configError) {
      console.error('Error creating agent configuration:', configError)
      // Rollback agent creation
      await supabase.from('agents').delete().eq('id', agent.id)
      return NextResponse.json({ error: 'Failed to save agent configuration' }, { status: 500 })
    }

    // Initialize backtesting job (in a real system, this would be queued)
    const { error: backtestError } = await supabase
      .from('backtest_jobs')
      .insert({
        agent_id: agent.id,
        status: 'pending',
        period: agentConfig.backtest_period,
        initial_capital: agentConfig.initial_capital,
        commission_rate: agentConfig.commission_rate,
        slippage_rate: agentConfig.slippage_rate,
        created_at: new Date().toISOString()
      })

    if (backtestError) {
      console.error('Error creating backtest job:', backtestError)
      // Don't fail the agent creation, just log it
    }

    // Return the created agent
    return NextResponse.json({ 
      agent,
      message: 'Agent created successfully. Backtesting will begin shortly.'
    })

  } catch (error) {
    console.error('Error in create agent API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
