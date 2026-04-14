// AURA & LOGOS - CRON pour envoyer des rappels d'essai
// GET /api/crons/send-trial-reminders
// À exécuter quotidiennement

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendTrialReminderEmail } from '@/lib/email/email-service'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// URL de base de l'application
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://auraandlogos.com'

export async function GET(request: Request) {
  // Vérifier la clé API pour la sécurité
  const authHeader = request.headers.get('authorization')
  const expectedKey = process.env.CRON_SECRET_KEY
  
  if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    )
  }
  
  try {
    const now = new Date()
    const twoDaysFromNow = new Date()
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2)
    
    // Trouver les essais qui expirent dans 2 jours
    const { data: trials, error } = await supabase
      .from('prepaid_trials')
      .select('*, users!inner(name, email)')
      .eq('status', 'active')
      .lte('ends_at', twoDaysFromNow.toISOString())
      .gt('ends_at', now.toISOString())
    
    if (error) {
      console.error('Error fetching trials:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des essais' },
        { status: 500 }
      )
    }
    
    if (!trials || trials.length === 0) {
      return NextResponse.json({ message: 'No trials to remind', count: 0 })
    }
    
    const results = []
    
    for (const trial of trials) {
      const remainingDays = Math.ceil(
        (new Date(trial.ends_at).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )
      const remainingMinutes = (trial.quota_limit || 120) - (trial.quota_used || 0)
      
      // Envoyer uniquement à J-2
      if (remainingDays === 2) {
        const success = await sendTrialReminderEmail({
          to: trial.users?.email || trial.user_email,
          userName: trial.users?.name,
          remainingDays,
          remainingMinutes,
        })
        
        results.push({
          email: trial.user_email,
          success,
          remainingDays,
          remainingMinutes,
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
      timestamp: new Date().toISOString(),
    })
    
  } catch (error) {
    console.error('Send trial reminders error:', error)
    return NextResponse.json(
      { error: 'Failed to send reminders' },
      { status: 500 }
    )
  }
}