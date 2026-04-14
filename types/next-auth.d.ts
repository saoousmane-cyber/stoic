// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends DefaultUser {
    plan?: 'free' | 'pro' | 'trial'
    quotaUsed?: number
    quotaLimit?: number
    quotaResetDate?: string
  }
  
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      plan?: 'free' | 'pro' | 'trial'
      quotaUsed?: number
      quotaLimit?: number
      quotaResetDate?: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    plan?: 'free' | 'pro' | 'trial'
    quotaUsed?: number
    quotaLimit?: number
  }
}