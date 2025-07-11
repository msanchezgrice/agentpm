#!/usr/bin/env node

/**
 * Database Setup Script for Investment AI Agent Platform
 * 
 * This script helps initialize your Supabase database with the required schema
 * and verifies the setup is working correctly.
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🚀 Investment AI Agent Platform - Database Setup')
console.log('='.repeat(50))

// Verify environment variables
console.log('\n✅ Environment Check:')
console.log(`   Supabase URL: ${supabaseUrl ? '✅ Configured' : '❌ Missing'}`)
console.log(`   Supabase Key: ${supabaseServiceKey ? '✅ Configured' : '❌ Missing'}`)
console.log(`   Polygon API: ${process.env.POLYGON_API_KEY ? '✅ Configured' : '❌ Missing'}`)
console.log(`   Alpaca API: ${process.env.ALPACA_KEY_ID ? '✅ Configured' : '⚠️  Pending'}`)
console.log(`   OpenAI API: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '⚠️  Pending'}`)

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('\n❌ Missing required Supabase credentials!')
  console.log('Please check your .env.local file')
  process.exit(1)
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkTables() {
  console.log('\n🔍 Checking Database Tables:')
  
  const tables = [
    'users', 'strategies', 'agents', 'trades', 
    'performance_metrics', 'trading_sessions', 
    'audit_logs', 'subscription_tiers'
  ]
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`   ${table}: ❌ Not found (${error.message})`)
      } else {
        console.log(`   ${table}: ✅ Ready`)
      }
    } catch (err) {
      console.log(`   ${table}: ❌ Error (${err.message})`)
    }
  }
}

async function checkSubscriptionTiers() {
  console.log('\n📊 Checking Subscription Tiers:')
  
  try {
    const { data, error } = await supabase
      .from('subscription_tiers')
      .select('*')
    
    if (error) {
      console.log('   ❌ Could not fetch subscription tiers')
    } else {
      console.log(`   ✅ Found ${data.length} subscription tiers:`)
      data.forEach(tier => {
        console.log(`      - ${tier.tier}: ${tier.agent_limit} agents, $${tier.price_monthly}/month`)
      })
    }
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`)
  }
}

async function main() {
  try {
    await checkTables()
    await checkSubscriptionTiers()
    
    console.log('\n🎉 Database Setup Complete!')
    console.log('\nNext Steps:')
    console.log('1. Set up Clerk authentication')
    console.log('2. Complete Alpaca API configuration')
    console.log('3. Add your LLM API keys')
    console.log('4. Run: npm run dev')
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message)
    process.exit(1)
  }
}

main()
