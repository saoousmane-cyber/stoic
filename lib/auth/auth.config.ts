// AURA & LOGOS - Configuration d'authentification NextAuth
// Version sans SupabaseAdapter (fonctionne immédiatement)

import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { createClient } from '@supabase/supabase-js'

// Client Supabase pour les opérations manuelles
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified,
        }
      },
    }),
  ],
  // Pas de adapter pour l'instant - on gère manuellement
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log('Sign in attempt:', { user: user.email, provider: account?.provider })
      
      if (!user.email) {
        return false
      }

      try {
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single()

        if (!existingUser) {
          await supabase.from('users').insert({
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            plan: 'free',
            quota_used: 0,
            quota_limit: 5,
            quota_reset_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
            created_at: new Date().toISOString(),
          })
        }

        return true
      } catch (error) {
        console.error('SignIn callback error:', error)
        return true
      }
    },
    
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('plan, quota_used, quota_limit, quota_reset_date, id')
            .eq('email', session.user.email)
            .single()

          if (userData) {
            session.user.id = userData.id
            session.user.plan = userData.plan
            session.user.quotaUsed = userData.quota_used
            session.user.quotaLimit = userData.quota_limit
            session.user.quotaResetDate = userData.quota_reset_date
          }
        } catch (error) {
          console.error('Session callback error:', error)
        }
      }
      
      return session
    },
    
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      
      if (trigger === 'update' && session?.user) {
        token.plan = session.user.plan
        token.quotaUsed = session.user.quotaUsed
      }
      
      return token
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}