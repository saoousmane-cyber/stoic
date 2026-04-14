// AURA & LOGOS - Templates d'emails HTML complets

export interface EmailTemplateProps {
  userName?: string
  userEmail: string
  resetLink?: string
  trialEndsAt?: Date
  remainingMinutes?: number
  remainingDays?: number
  bonusMinutes?: number
  subscriptionId?: string
  invoiceAmount?: number
  invoiceDate?: string
  invoicePdfUrl?: string
  dashboardUrl: string
  supportUrl: string
  loginUrl?: string
}

// ============================================
// 1. EMAIL DE BIENVENUE AVEC BONUS
// ============================================
export function getWelcomeBonusEmail(props: EmailTemplateProps): string {
  const { userName, bonusMinutes = 120, dashboardUrl, supportUrl } = props
  const name = userName?.split(' ')[0] || 'Cher créateur'

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue sur AURA & LOGOS</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background-color: #ffffff; border-radius: 16px; padding: 32px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 32px; }
    .logo { font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .bonus-box { background: linear-gradient(135deg, #fef3c7, #fed7aa); border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .bonus-number { font-size: 48px; font-weight: bold; color: #d97706; margin: 10px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 32px; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">✨ AURA & LOGOS</div>
        <h1 style="margin: 16px 0 8px; font-size: 24px;">Bienvenue, ${name} !</h1>
        <p style="color: #6b7280;">Votre voyage créatif commence ici</p>
      </div>

      <div class="bonus-box">
        <div style="font-size: 32px;">🎁</div>
        <h2 style="margin: 8px 0; font-size: 20px;">Vous avez reçu un bonus de bienvenue !</h2>
        <div class="bonus-number">${bonusMinutes} minutes offertes</div>
        <p style="margin: 0; color: #92400e;">Valable 7 jours - À utiliser sur le plan Pro</p>
      </div>

      <p>Merci d'avoir choisi AURA & LOGOS pour automatiser votre création de contenu.</p>
      
      <p><strong>Ce que vous pouvez faire avec votre bonus :</strong></p>
      <ul>
        <li>🎬 Générer jusqu'à ${Math.floor(bonusMinutes / 5)} vidéos de 5 minutes</li>
        <li>🎙️ Tester la voix off HD dans 6 langues</li>
        <li>🖼️ Accéder à la bibliothèque d'images libres de droits</li>
        <li>📝 Utiliser l'assistant de réécriture IA</li>
      </ul>

      <div style="text-align: center;">
        <a href="${dashboardUrl}" class="button">Commencer à créer →</a>
      </div>

      <hr />

      <p style="font-size: 14px; color: #6b7280;">
        💡 <strong>Conseil :</strong> Utilisez vos minutes offertes en priorité. Elles expirent dans 7 jours.
      </p>

      <div class="footer">
        <p>Besoin d'aide ? <a href="${supportUrl}" style="color: #6366f1;">Contactez notre support</a></p>
        <p>&copy; 2024 AURA & LOGOS. Tous droits réservés.</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

// ============================================
// 2. EMAIL DE RÉINITIALISATION DE MOT DE PASSE
// ============================================
export function getPasswordResetEmail(props: EmailTemplateProps): string {
  const { userName, resetLink, supportUrl } = props
  const name = userName?.split(' ')[0] || 'Cher utilisateur'

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation de votre mot de passe</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background-color: #ffffff; border-radius: 16px; padding: 32px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 32px; }
    .logo { font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .warning-box { background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 16px; margin: 24px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 32px; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    .expiry-note { font-size: 12px; color: #6b7280; text-align: center; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">🔐 AURA & LOGOS</div>
        <h1 style="margin: 16px 0 8px; font-size: 24px;">Réinitialisation du mot de passe</h1>
        <p style="color: #6b7280;">Bonjour ${name}</p>
      </div>

      <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte AURA & LOGOS.</p>

      <div class="warning-box">
        <p style="margin: 0; font-size: 14px;">⚠️ Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email. Votre mot de passe ne sera pas modifié.</p>
      </div>

      <div style="text-align: center;">
        <a href="${resetLink}" class="button">Réinitialiser mon mot de passe →</a>
      </div>

      <div class="expiry-note">
        ⏰ Ce lien est valable pendant 1 heure.
      </div>

      <hr />

      <p style="font-size: 14px; color: #6b7280;">
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br />
        <a href="${resetLink}" style="color: #6366f1; word-break: break-all;">${resetLink}</a>
      </p>

      <div class="footer">
        <p>Une question ? <a href="${supportUrl}" style="color: #6366f1;">Contactez notre support</a></p>
        <p>&copy; 2024 AURA & LOGOS. Tous droits réservés.</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

// ============================================
// 3. EMAIL DE CONFIRMATION DE MOT DE PASSE MODIFIÉ
// ============================================
export function getPasswordChangedEmail(props: EmailTemplateProps): string {
  const { userName, dashboardUrl, supportUrl } = props
  const name = userName?.split(' ')[0] || 'Cher utilisateur'

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Votre mot de passe a été modifié</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background-color: #ffffff; border-radius: 16px; padding: 32px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 32px; }
    .logo { font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .success-box { background: #ecfdf5; border-left: 4px solid #10b981; border-radius: 8px; padding: 16px; margin: 24px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 32px; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">✅ AURA & LOGOS</div>
        <h1 style="margin: 16px 0 8px; font-size: 24px;">Mot de passe modifié</h1>
      </div>

      <div class="success-box">
        <p style="margin: 0; font-size: 14px;">🔒 Votre mot de passe a été modifié avec succès.</p>
      </div>

      <p>Bonjour ${name},</p>
      
      <p>Ce message confirme que votre mot de passe AURA & LOGOS a été modifié récemment.</p>

      <p><strong>Si vous avez effectué cette modification</strong>, vous pouvez ignorer cet email.</p>

      <p><strong>Si vous n'avez pas modifié votre mot de passe</strong>, veuillez contacter notre support immédiatement.</p>

      <div style="text-align: center;">
        <a href="${dashboardUrl}" class="button">Accéder à mon compte →</a>
      </div>

      <hr />

      <div class="footer">
        <p>Une question ? <a href="${supportUrl}" style="color: #6366f1;">Contactez notre support</a></p>
        <p>&copy; 2024 AURA & LOGOS. Tous droits réservés.</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

// ============================================
// 4. EMAIL DE RAPPEL DE FIN D'ESSAI (J-2)
// ============================================
export function getTrialReminderEmail(props: EmailTemplateProps): string {
  const { userName, remainingDays = 2, remainingMinutes = 120, dashboardUrl, supportUrl } = props
  const name = userName?.split(' ')[0] || 'Cher créateur'

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Votre essai se termine bientôt</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background-color: #ffffff; border-radius: 16px; padding: 32px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .warning-box { background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .timer { font-size: 36px; font-weight: bold; color: #d97706; margin: 10px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .button-outline { display: inline-block; background: transparent; border: 1px solid #ef4444; color: #ef4444; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 8px; }
    .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="warning-box">
        <div style="font-size: 32px;">⏰</div>
        <h2 style="margin: 8px 0;">Votre essai se termine dans ${remainingDays} jours</h2>
        <div class="timer">${remainingMinutes} minutes restantes</div>
        <p style="margin: 0; color: #92400e;">Sur les 120 minutes offertes</p>
      </div>

      <p>Bonjour ${name},</p>
      
      <p>Votre période d'essai de 7 jours se termine bientôt. Voici ce qui va se passer :</p>
      
      <ul>
        <li>✅ Vous avez encore ${remainingMinutes} minutes de création</li>
        <li>🔄 Après l'essai, votre abonnement Pro (49€/mois) débutera automatiquement</li>
        <li>🔒 Vous conservez toutes vos créations</li>
      </ul>

      <div style="text-align: center;">
        <a href="${dashboardUrl}" class="button">Profiter de mes minutes restantes →</a>
        <br />
        <a href="${supportUrl}/cancel" class="button-outline">Annuler mon essai</a>
      </div>

      <hr />

      <p style="font-size: 14px; color: #6b7280;">
        💡 <strong>Important :</strong> Si vous annulez avant la fin de l'essai, vous serez remboursé intégralement.
      </p>

      <div class="footer">
        <p><a href="${supportUrl}" style="color: #6366f1;">Une question ? Contactez-nous</a></p>
      </div>
    </div>
  </div>
</body>
</html>`
}

// ============================================
// 5. EMAIL DE CONFIRMATION DE CONVERSION (abonnement débuté)
// ============================================
export function getConversionConfirmationEmail(props: EmailTemplateProps): string {
  const { userName, dashboardUrl, supportUrl } = props
  const name = userName?.split(' ')[0] || 'Cher créateur'

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Votre abonnement Pro est actif</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background-color: #ffffff; border-radius: 16px; padding: 32px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .success-box { background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .check { font-size: 48px; color: #059669; margin: 10px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="success-box">
        <div class="check">✅</div>
        <h2 style="margin: 8px 0;">Abonnement Pro activé !</h2>
        <p style="margin: 0; color: #065f46;">Votre période d'essai est terminée</p>
      </div>

      <p>Bonjour ${name},</p>
      
      <p>Votre période d'essai de 7 jours est terminée. Votre abonnement <strong>Pro (49€/mois)</strong> est maintenant actif.</p>
      
      <h3>Ce que vous retrouvez :</h3>
      <ul>
        <li>🎬 20 heures de génération par mois</li>
        <li>🎙️ Voix off HD en 6 langues</li>
        <li>🖼️ Pack images inclus (20/images par génération)</li>
        <li>📝 Assistant de réécriture IA</li>
        <li>🔊 Ducking audio professionnel</li>
        <li>✨ Suppression du filigrane</li>
      </ul>

      <div style="text-align: center;">
        <a href="${dashboardUrl}" class="button">Accéder à mon dashboard →</a>
      </div>

      <hr />

      <p style="font-size: 14px; color: #6b7280;">
        💡 <strong>Gérez votre abonnement :</strong> Vous pouvez annuler à tout moment depuis votre dashboard.
      </p>

      <div class="footer">
        <p><a href="${supportUrl}" style="color: #6366f1;">Support client</a> | <a href="${dashboardUrl}/billing" style="color: #6366f1;">Gérer mon abonnement</a></p>
      </div>
    </div>
  </div>
</body>
</html>`
}

// ============================================
// 6. EMAIL DE CONFIRMATION DE REMBOURSEMENT
// ============================================
export function getRefundConfirmationEmail(props: EmailTemplateProps): string {
  const { userName, supportUrl } = props
  const name = userName?.split(' ')[0] || 'Cher créateur'

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Confirmation de remboursement</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background-color: #ffffff; border-radius: 16px; padding: 32px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .refund-box { background: linear-gradient(135deg, #fee2e2, #fecaca); border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="refund-box">
        <div style="font-size: 32px;">💰</div>
        <h2 style="margin: 8px 0;">Remboursement effectué</h2>
        <p style="margin: 0; color: #991b1b;">Montant : 49€</p>
      </div>

      <p>Bonjour ${name},</p>
      
      <p>Conformément à votre demande, votre paiement de <strong>49€</strong> a été remboursé.</p>
      
      <p><strong>Délai de réception :</strong> Les fonds seront disponibles sur votre compte bancaire sous 5 à 10 jours ouvrés (selon votre banque).</p>

      <p>Nous sommes désolés de vous voir partir et nous espérons vous revoir bientôt.</p>

      <hr />

      <p style="font-size: 14px; color: #6b7280;">
        💡 <strong>Une question ?</strong> N'hésitez pas à nous contacter.
      </p>

      <div class="footer">
        <p><a href="${supportUrl}" style="color: #6366f1;">Contacter le support</a></p>
        <p>&copy; 2024 AURA & LOGOS</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

// ============================================
// 7. EMAIL DE FACTURE
// ============================================
export function getInvoiceEmail(props: EmailTemplateProps): string {
  const { userName, invoiceAmount, invoiceDate, invoicePdfUrl, dashboardUrl, supportUrl } = props
  const name = userName?.split(' ')[0] || 'Cher client'

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Votre facture AURA & LOGOS</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background-color: #ffffff; border-radius: 16px; padding: 32px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .invoice-box { background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .invoice-line { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header" style="text-align: center;">
        <div class="logo" style="font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef); -webkit-background-clip: text; background-clip: text; color: transparent;">📄 AURA & LOGOS</div>
        <h1 style="margin: 16px 0 8px; font-size: 24px;">Votre facture</h1>
      </div>

      <p>Bonjour ${name},</p>
      
      <p>Merci pour votre confiance. Voici le récapitulatif de votre facture.</p>

      <div class="invoice-box">
        <div class="invoice-line">
          <span>Date</span>
          <strong>${invoiceDate || new Date().toLocaleDateString('fr-FR')}</strong>
        </div>
        <div class="invoice-line">
          <span>Montant</span>
          <strong>${invoiceAmount ? `${invoiceAmount}€` : '49€'}</strong>
        </div>
        <div class="invoice-line">
          <span>Période</span>
          <strong>Mensuelle</strong>
        </div>
      </div>

      <div style="text-align: center;">
        ${invoicePdfUrl ? `<a href="${invoicePdfUrl}" class="button">📥 Télécharger la facture (PDF)</a>` : `
        <a href="${dashboardUrl}/billing" class="button">📥 Voir mes factures</a>
        `}
      </div>

      <hr />

      <p style="font-size: 14px; color: #6b7280;">
        Besoin d'une facture avec votre numéro de TVA ? <a href="${supportUrl}" style="color: #6366f1;">Contactez-nous</a>
      </p>

      <div class="footer">
        <p><a href="${supportUrl}" style="color: #6366f1;">Support client</a></p>
        <p>&copy; 2024 AURA & LOGOS</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

// ============================================
// 8. EMAIL DE CONFIRMATION D'INSCRIPTION NEWSLETTER
// ============================================
export function getNewsletterConfirmationEmail(props: EmailTemplateProps): string {
  const { userName, dashboardUrl, supportUrl } = props
  const name = userName?.split(' ')[0] || 'Cher lecteur'

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Confirmation d'inscription à la newsletter</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background-color: #ffffff; border-radius: 16px; padding: 32px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .success-box { background: #ecfdf5; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="success-box">
        <div style="font-size: 48px;">📧</div>
        <h2 style="margin: 8px 0;">Inscription confirmée !</h2>
      </div>

      <p>Bonjour ${name},</p>
      
      <p>Merci de vous être inscrit à notre newsletter !</p>
      
      <p>Vous recevrez désormais :</p>
      <ul>
        <li>📝 Nos meilleurs articles chaque semaine</li>
        <li>🎁 Des offres exclusives réservées aux abonnés</li>
        <li>💡 Des astuces pour optimiser votre création de contenu</li>
        <li>🚀 Les nouveautés d'AURA & LOGOS</li>
      </ul>

      <div style="text-align: center;">
        <a href="${dashboardUrl}" class="button">Découvrir AURA & LOGOS →</a>
      </div>

      <hr />

      <p style="font-size: 12px; color: #6b7280;">
        Vous pouvez vous désinscrire à tout moment en cliquant sur le lien en bas de chaque email.
      </p>

      <div class="footer">
        <p><a href="${supportUrl}" style="color: #6366f1;">Nous contacter</a></p>
        <p>&copy; 2024 AURA & LOGOS</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

// ============================================
// 9. EMAIL D'ALERTE DE SÉCURITÉ (nouvelle connexion)
// ============================================
export function getSecurityAlertEmail(props: EmailTemplateProps & { location?: string; device?: string }): string {
  const { userName, dashboardUrl, supportUrl, location, device } = props
  const name = userName?.split(' ')[0] || 'Cher utilisateur'

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Alerte de sécurité - Nouvelle connexion</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background-color: #ffffff; border-radius: 16px; padding: 32px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .alert-box { background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 16px; margin: 24px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .button-outline { display: inline-block; background: transparent; border: 1px solid #ef4444; color: #ef4444; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 8px; }
    .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="alert-box">
        <div style="font-size: 32px;">🔐</div>
        <h2 style="margin: 8px 0;">Nouvelle connexion détectée</h2>
      </div>

      <p>Bonjour ${name},</p>
      
      <p>Nous avons détecté une nouvelle connexion à votre compte AURA & LOGOS.</p>

      <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>📍 Localisation :</strong> ${location || 'Non disponible'}</p>
        <p style="margin: 4px 0;"><strong>💻 Appareil :</strong> ${device || 'Non disponible'}</p>
        <p style="margin: 4px 0;"><strong>⏰ Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
      </div>

      <div style="text-align: center;">
        <a href="${dashboardUrl}" class="button">✅ C'était moi</a>
        <br />
        <a href="${supportUrl}/security" class="button-outline">🔒 Ce n'était pas moi</a>
      </div>

      <hr />

      <p style="font-size: 14px; color: #6b7280;">
        Si vous n'êtes pas à l'origine de cette connexion, veuillez <strong>changer immédiatement votre mot de passe</strong> et contacter notre support.
      </p>

      <div class="footer">
        <p><a href="${supportUrl}" style="color: #6366f1;">Contacter le support</a></p>
        <p>&copy; 2024 AURA & LOGOS</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

// ============================================
// 10. EMAIL DE BIENVENUE SIMPLE (sans bonus)
// ============================================
export function getWelcomeEmail(props: EmailTemplateProps): string {
  const { userName, dashboardUrl, supportUrl } = props
  const name = userName?.split(' ')[0] || 'Cher créateur'

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bienvenue sur AURA & LOGOS</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background-color: #ffffff; border-radius: 16px; padding: 32px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 32px; }
    .logo { font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">✨ AURA & LOGOS</div>
        <h1 style="margin: 16px 0 8px; font-size: 24px;">Bienvenue, ${name} !</h1>
        <p style="color: #6b7280;">Votre voyage créatif commence ici</p>
      </div>

      <p>Merci d'avoir rejoint AURA & LOGOS !</p>
      
      <p>Notre plateforme vous permet de générer automatiquement du contenu vidéo et audio pour vos chaînes YouTube, podcasts et réseaux sociaux.</p>

      <h3>Pour commencer :</h3>
      <ol>
        <li>Choisissez une niche (Stoïcisme, Méditation, Histoire...)</li>
        <li>Entrez un sujet</li>
        <li>Générez votre contenu en quelques secondes</li>
      </ol>

      <div style="text-align: center;">
        <a href="${dashboardUrl}" class="button">Créer mon premier contenu →</a>
      </div>

      <div class="footer">
        <p>Une question ? <a href="${supportUrl}" style="color: #6366f1;">Contactez-nous</a></p>
        <p>&copy; 2024 AURA & LOGOS</p>
      </div>
    </div>
  </div>
</body>
</html>`
}