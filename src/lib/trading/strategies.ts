interface MarketData {
  ticker: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  open: number
  previousClose: number
}

interface TradeSignal {
  action: 'buy' | 'sell' | 'hold' | 'sell_short' | 'buy_to_cover'
  confidence: number // 0-1
  reasoning: string
  suggestedQuantity?: number
}

interface Agent {
  id: string
  name: string
  strategy_type: string
  risk_tolerance: 'low' | 'medium' | 'high'
  trading_frequency: 'realtime' | 'hourly' | 'daily' | 'weekly'
  current_capital: number
  parameters: any
}

export class TradingStrategies {
  
  static async generateSignal(agent: Agent, marketData: MarketData): Promise<TradeSignal> {
    switch (agent.strategy_type) {
      case 'momentum':
        return this.momentumStrategy(agent, marketData)
      case 'mean_reversion':
        return this.meanReversionStrategy(agent, marketData)
      case 'value_investing':
        return this.valueInvestingStrategy(agent, marketData)
      case 'growth_investing':
        return this.growthInvestingStrategy(agent, marketData)
      case 'dividend_investing':
        return this.dividendInvestingStrategy(agent, marketData)
      case 'arbitrage':
        return this.arbitrageStrategy(agent, marketData)
      case 'swing_trading':
        return this.swingTradingStrategy(agent, marketData)
      case 'scalping':
        return this.scalpingStrategy(agent, marketData)
      case 'breakout':
        return this.breakoutStrategy(agent, marketData)
      case 'contrarian':
        return this.contrarianStrategy(agent, marketData)
      default:
        return this.holdStrategy()
    }
  }

  private static momentumStrategy(agent: Agent, data: MarketData): TradeSignal {
    const momentumThreshold = agent.risk_tolerance === 'high' ? 2 : agent.risk_tolerance === 'medium' ? 3 : 5
    
    if (data.changePercent > momentumThreshold) {
      return {
        action: 'buy',
        confidence: Math.min(Math.abs(data.changePercent) / 10, 0.9),
        reasoning: `Strong upward momentum detected: ${data.changePercent.toFixed(2)}% gain`,
        suggestedQuantity: this.calculatePositionSize(agent, data.price, 0.1)
      }
    }
    
    if (data.changePercent < -momentumThreshold) {
      return {
        action: 'sell_short',
        confidence: Math.min(Math.abs(data.changePercent) / 10, 0.8),
        reasoning: `Strong downward momentum detected: ${data.changePercent.toFixed(2)}% decline`,
        suggestedQuantity: this.calculatePositionSize(agent, data.price, 0.08)
      }
    }

    return this.holdStrategy()
  }

  private static meanReversionStrategy(agent: Agent, data: MarketData): TradeSignal {
    const dailyRange = data.high - data.low
    const currentPosition = (data.price - data.low) / dailyRange

    // If price is near daily low, consider buying (expecting reversion)
    if (currentPosition < 0.2 && data.changePercent < -2) {
      return {
        action: 'buy',
        confidence: 0.7,
        reasoning: `Price near daily low (${(currentPosition * 100).toFixed(1)}% of range), expecting mean reversion`,
        suggestedQuantity: this.calculatePositionSize(agent, data.price, 0.15)
      }
    }

    // If price is near daily high, consider selling
    if (currentPosition > 0.8 && data.changePercent > 2) {
      return {
        action: 'sell',
        confidence: 0.6,
        reasoning: `Price near daily high (${(currentPosition * 100).toFixed(1)}% of range), expecting reversion`,
        suggestedQuantity: this.calculatePositionSize(agent, data.price, 0.1)
      }
    }

    return this.holdStrategy()
  }

  private static valueInvestingStrategy(agent: Agent, data: MarketData): TradeSignal {
    // Simplified value strategy - look for oversold conditions
    if (data.changePercent < -5) {
      return {
        action: 'buy',
        confidence: 0.8,
        reasoning: `Potential value opportunity: ${data.changePercent.toFixed(2)}% decline may be overdone`,
        suggestedQuantity: this.calculatePositionSize(agent, data.price, 0.2)
      }
    }

    return this.holdStrategy()
  }

  private static growthInvestingStrategy(agent: Agent, data: MarketData): TradeSignal {
    // Growth strategy - look for strong positive momentum with high volume
    const volumeIndicator = data.volume > 1000000 // Simplified volume check
    
    if (data.changePercent > 3 && volumeIndicator) {
      return {
        action: 'buy',
        confidence: 0.75,
        reasoning: `Growth momentum with volume: ${data.changePercent.toFixed(2)}% gain on strong volume`,
        suggestedQuantity: this.calculatePositionSize(agent, data.price, 0.12)
      }
    }

    return this.holdStrategy()
  }

  private static dividendInvestingStrategy(agent: Agent, data: MarketData): TradeSignal {
    // Dividend strategy - prefer stable, modest buying on dips
    if (data.changePercent < -1 && data.changePercent > -3) {
      return {
        action: 'buy',
        confidence: 0.6,
        reasoning: `Modest dip for dividend stock: ${data.changePercent.toFixed(2)}% decline`,
        suggestedQuantity: this.calculatePositionSize(agent, data.price, 0.05)
      }
    }

    return this.holdStrategy()
  }

  private static arbitrageStrategy(agent: Agent, data: MarketData): TradeSignal {
    // Simplified arbitrage - look for quick reversals
    const priceGap = Math.abs(data.price - data.previousClose) / data.previousClose * 100
    
    if (priceGap > 1) {
      return {
        action: data.price > data.previousClose ? 'sell' : 'buy',
        confidence: 0.5,
        reasoning: `Potential arbitrage opportunity: ${priceGap.toFixed(2)}% gap from previous close`,
        suggestedQuantity: this.calculatePositionSize(agent, data.price, 0.03)
      }
    }

    return this.holdStrategy()
  }

  private static swingTradingStrategy(agent: Agent, data: MarketData): TradeSignal {
    // Swing trading - medium-term moves
    if (data.changePercent > 4) {
      return {
        action: 'sell',
        confidence: 0.7,
        reasoning: `Swing high reached: ${data.changePercent.toFixed(2)}% gain, taking profits`,
        suggestedQuantity: this.calculatePositionSize(agent, data.price, 0.1)
      }
    }

    if (data.changePercent < -4) {
      return {
        action: 'buy',
        confidence: 0.7,
        reasoning: `Swing low reached: ${data.changePercent.toFixed(2)}% decline, entering position`,
        suggestedQuantity: this.calculatePositionSize(agent, data.price, 0.1)
      }
    }

    return this.holdStrategy()
  }

  private static scalpingStrategy(agent: Agent, data: MarketData): TradeSignal {
    // Scalping - very small, quick moves
    if (Math.abs(data.changePercent) > 0.5) {
      return {
        action: data.changePercent > 0 ? 'sell' : 'buy',
        confidence: 0.4,
        reasoning: `Scalping opportunity: ${data.changePercent.toFixed(2)}% move`,
        suggestedQuantity: this.calculatePositionSize(agent, data.price, 0.02)
      }
    }

    return this.holdStrategy()
  }

  private static breakoutStrategy(agent: Agent, data: MarketData): TradeSignal {
    // Breakout strategy - look for significant moves above/below ranges
    const breakoutThreshold = 5
    
    if (data.changePercent > breakoutThreshold) {
      return {
        action: 'buy',
        confidence: 0.8,
        reasoning: `Upward breakout detected: ${data.changePercent.toFixed(2)}% move`,
        suggestedQuantity: this.calculatePositionSize(agent, data.price, 0.15)
      }
    }

    if (data.changePercent < -breakoutThreshold) {
      return {
        action: 'sell_short',
        confidence: 0.8,
        reasoning: `Downward breakout detected: ${data.changePercent.toFixed(2)}% move`,
        suggestedQuantity: this.calculatePositionSize(agent, data.price, 0.15)
      }
    }

    return this.holdStrategy()
  }

  private static contrarianStrategy(agent: Agent, data: MarketData): TradeSignal {
    // Contrarian - do opposite of momentum
    if (data.changePercent > 3) {
      return {
        action: 'sell',
        confidence: 0.6,
        reasoning: `Contrarian sell: ${data.changePercent.toFixed(2)}% gain seems excessive`,
        suggestedQuantity: this.calculatePositionSize(agent, data.price, 0.08)
      }
    }

    if (data.changePercent < -3) {
      return {
        action: 'buy',
        confidence: 0.6,
        reasoning: `Contrarian buy: ${data.changePercent.toFixed(2)}% decline seems excessive`,
        suggestedQuantity: this.calculatePositionSize(agent, data.price, 0.08)
      }
    }

    return this.holdStrategy()
  }

  private static holdStrategy(): TradeSignal {
    return {
      action: 'hold',
      confidence: 0.5,
      reasoning: 'No clear signal detected, maintaining current position'
    }
  }

  private static calculatePositionSize(agent: Agent, price: number, riskPercent: number): number {
    const riskMultiplier = agent.risk_tolerance === 'high' ? 1.5 : agent.risk_tolerance === 'medium' ? 1.0 : 0.5
    const adjustedRisk = riskPercent * riskMultiplier
    const positionValue = agent.current_capital * adjustedRisk
    return Math.floor(positionValue / price)
  }

  // Get popular tickers for different strategies
  static getRecommendedTickers(strategyType: string): string[] {
    const tickersByStrategy: Record<string, string[]> = {
      momentum: ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL'],
      mean_reversion: ['SPY', 'QQQ', 'IWM', 'VTI', 'VOO'],
      value_investing: ['BRK.B', 'JPM', 'JNJ', 'PG', 'KO'],
      growth_investing: ['AMZN', 'META', 'NFLX', 'CRM', 'SHOP'],
      dividend_investing: ['REYN', 'T', 'VZ', 'XOM', 'CVX'],
      arbitrage: ['SPY', 'QQQ', 'GLD', 'TLT', 'VIX'],
      swing_trading: ['AMD', 'BABA', 'UBER', 'SNAP', 'ZM'],
      scalping: ['SPY', 'QQQ', 'TQQQ', 'SQQQ', 'SPXL'],
      breakout: ['MEME', 'GME', 'AMC', 'COIN', 'HOOD'],
      contrarian: ['VIX', 'UVXY', 'SQQQ', 'SPXS', 'TZA']
    }

    return tickersByStrategy[strategyType] || ['SPY', 'QQQ', 'AAPL', 'MSFT', 'TSLA']
  }
}
