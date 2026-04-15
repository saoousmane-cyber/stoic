// AURA & LOGOS - API de récupération des factures Stripe
// GET /api/payment/invoices
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { getStripeClient } from '@/lib/payment/stripe-client'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.id || session.user.email

    // Récupérer le customer Stripe de l'utilisateur
    const { data: user, error } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()

    if (error || !user?.stripe_customer_id) {
      return NextResponse.json({ invoices: [] })
    }

    const stripe = getStripeClient()
    
    // Récupérer les factures Stripe
    const invoices = await stripe.invoices.list({
      customer: user.stripe_customer_id,
      limit: 24, // 2 ans de factures
    })

    const formattedInvoices = invoices.data.map(invoice => ({
      id: invoice.id,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
      status: invoice.status,
      created: new Date(invoice.created * 1000).toISOString(),
      pdfUrl: invoice.invoice_pdf,
      number: invoice.number,
      periodStart: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
      periodEnd: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null,
    }))

    return NextResponse.json({
      invoices: formattedInvoices,
      total: invoices.data.length,
    })

  } catch (error) {
    console.error('Get invoices error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des factures' },
      { status: 500 }
    )
  }
}