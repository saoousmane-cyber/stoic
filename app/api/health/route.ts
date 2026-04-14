// AURA & LOGOS - API de santé pour le monitoring
// GET /api/health

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getStripeClient } from '@/lib/payment/stripe-client'
import { getResendClient } from '@/lib/email/resend-client'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const startTime = Date.now()
  const checks: Record<string, { status: 'up' | 'down'; latency?: number; error?: string }> = {}

  // 1. Vérifier Supabase
  try {
    const dbStart = Date.now()
    const { error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    checks.database = {
      status: error ? 'down' : 'up',
      latency: Date.now() - dbStart,
      error: error?.message,
    }
  } catch (error) {
    checks.database = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }

  // 2. Vérifier Stripe
  try {
    const stripeStart = Date.now()
    const stripe = getStripeClient()
    await stripe.balance.retrieve()
    checks.stripe = {
      status: 'up',
      latency: Date.now() - stripeStart,
    }
  } catch (error) {
    checks.stripe = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }

  // 3. Vérifier Resend
  try {
    const resendStart = Date.now()
    const resend = getResendClient()
    await resend.domains.list()
    checks.email = {
      status: 'up',
      latency: Date.now() - resendStart,
    }
  } catch (error) {
    checks.email = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }

  // 4. Vérifier OpenRouter
  try {
    const openRouterStart = Date.now()
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    })
    checks.openrouter = {
      status: response.ok ? 'up' : 'down',
      latency: Date.now() - openRouterStart,
      error: response.ok ? undefined : `HTTP ${response.status}`,
    }
  } catch (error) {
    checks.openrouter = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }

  // 5. Vérifier OpenAI
  try {
    const openAIStart = Date.now()
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    })
    checks.openai = {
      status: response.ok ? 'up' : 'down',
      latency: Date.now() - openAIStart,
      error: response.ok ? undefined : `HTTP ${response.status}`,
    }
  } catch (error) {
    checks.openai = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }

  const allUp = Object.values(checks).every(check => check.status === 'up')
  const totalLatency = Date.now() - startTime

  return NextResponse.json(
    {
      status: allUp ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV,
      latency: totalLatency,
      checks,
    },
    { status: allUp ? 200 : 503 }
  )
}