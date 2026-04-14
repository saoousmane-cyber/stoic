'use client'

import { useState, useEffect } from 'react'

interface Invoice {
  id: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed'
  created: string
  pdfUrl?: string
}

export function InvoiceHistory() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/payment/invoices')
      const data = await response.json()
      setInvoices(data.invoices || [])
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const config = {
      paid: { label: 'Payé', color: 'bg-green-100 text-green-700' },
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
      failed: { label: 'Échoué', color: 'bg-red-100 text-red-700' },
    }
    const c = config[status as keyof typeof config] || config.pending
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.color}`}>{c.label}</span>
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 text-center">
        <div className="text-4xl mb-2">📭</div>
        <p className="text-gray-500">Aucune facture disponible</p>
        <p className="text-xs text-gray-400 mt-1">
          Les factures apparaîtront après votre premier paiement
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Historique des factures</h3>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="p-4 flex justify-between items-center">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {invoice.amount.toFixed(2)} {invoice.currency.toUpperCase()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(invoice.created).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(invoice.status)}
              {invoice.pdfUrl && (
                <a
                  href={invoice.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 text-sm"
                >
                  PDF
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}