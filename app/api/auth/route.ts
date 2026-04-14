// AURA & LOGOS - API Route NextAuth
// Endpoint d'authentification Google OAuth

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }