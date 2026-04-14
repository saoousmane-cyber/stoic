'use client'

import { useState } from 'react'
import { getWelcomeBonusEmail, getTrialReminderEmail, getConversionConfirmationEmail, getRefundConfirmationEmail } from '@/lib/email/email-templates'

export function EmailPreview() {
  const [selectedTemplate, setSelectedTemplate] = useState<'welcome' | 'reminder' | 'conversion' | 'refund'>('welcome')
  
  const templates = {
    welcome: getWelcomeBonusEmail({
      userName: 'Jean',
      userEmail: 'jean@example.com',
      bonusMinutes: 120,
      dashboardUrl: 'https://auraandlogos.com/dashboard',
      supportUrl: 'https://auraandlogos.com/support',
    }),
    reminder: getTrialReminderEmail({
      userName: 'Jean',
      userEmail: 'jean@example.com',
      remainingDays: 2,
      remainingMinutes: 45,
      dashboardUrl: 'https://auraandlogos.com/dashboard',
      supportUrl: 'https://auraandlogos.com/support',
    }),
    conversion: getConversionConfirmationEmail({
      userName: 'Jean',
      userEmail: 'jean@example.com',
      dashboardUrl: 'https://auraandlogos.com/dashboard',
      supportUrl: 'https://auraandlogos.com/support',
    }),
    refund: getRefundConfirmationEmail({
      userName: 'Jean',
      userEmail: 'jean@example.com',
      dashboardUrl: 'https://auraandlogos.com/dashboard',
      supportUrl: 'https://auraandlogos.com/support',
    }),
  }
  
  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelectedTemplate('welcome')}
          className={`px-3 py-1 rounded-lg text-sm ${selectedTemplate === 'welcome' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          Bienvenue + Bonus
        </button>
        <button
          onClick={() => setSelectedTemplate('reminder')}
          className={`px-3 py-1 rounded-lg text-sm ${selectedTemplate === 'reminder' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          Rappel essai
        </button>
        <button
          onClick={() => setSelectedTemplate('conversion')}
          className={`px-3 py-1 rounded-lg text-sm ${selectedTemplate === 'conversion' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          Conversion
        </button>
        <button
          onClick={() => setSelectedTemplate('refund')}
          className={`px-3 py-1 rounded-lg text-sm ${selectedTemplate === 'refund' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          Remboursement
        </button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <iframe
          srcDoc={templates[selectedTemplate]}
          className="w-full h-[600px] border-0"
          title="Email Preview"
        />
      </div>
    </div>
  )
}