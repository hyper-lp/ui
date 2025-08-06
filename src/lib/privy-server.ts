import { env } from '@/env/t3-env'
import { NextRequest } from 'next/server'
// import * as jose from 'jose' // Uncomment when implementing JWT verification

/**
 * Privy user data structure from JWT token
 */
export interface PrivyUser {
    id: string // Privy user ID
    linkedAccounts: Array<{
        type: string
        subject?: string // Twitter ID for Twitter accounts
        username?: string
        name?: string
        profilePictureUrl?: string
        email?: string
    }>
    createdAt: number
}

/**
 * Extract Privy user from JWT token
 * This is a simplified version - in production, use @privy-io/server-auth
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function verifyPrivyToken(_token: string): Promise<PrivyUser | null> {
    try {
        // In production, use Privy's server SDK:
        // import { PrivyClient } from '@privy-io/server-auth'
        // const privy = new PrivyClient(env.PRIVY_APP_ID!, env.PRIVY_APP_SECRET!)
        // const claims = await privy.verifyAuthToken(_token)

        if (!env.PRIVY_APP_SECRET) {
            console.warn('PRIVY_APP_SECRET not configured - using development mode')
            // In development without secret, accept tokens but log warning
            return null
        }

        // For production with Privy SDK (when available):
        // const secret = new TextEncoder().encode(env.PRIVY_APP_SECRET)
        // const { payload } = await jose.jwtVerify(_token, secret)
        // return payload as unknown as PrivyUser

        // Placeholder for now - implement with Privy SDK
        return null
    } catch (error) {
        console.error('Token verification failed:', error)
        return null
    }
}

/**
 * Extract and verify Privy authentication from request
 */
export async function getPrivyUser(request: NextRequest): Promise<PrivyUser | null> {
    try {
        // Check for authorization header
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null
        }

        const token = authHeader.slice(7)
        if (!token) {
            return null
        }

        return await verifyPrivyToken(token)
    } catch (error) {
        console.error('Failed to get Privy user:', error)
        return null
    }
}

/**
 * Extract Twitter account from Privy user
 */
export function getTwitterAccount(user: PrivyUser) {
    const twitterAccount = user.linkedAccounts.find((account) => account.type === 'twitter')
    if (!twitterAccount) {
        return null
    }

    return {
        id: twitterAccount.subject || '',
        username: twitterAccount.username || '',
        name: twitterAccount.name || null,
        profilePictureUrl: twitterAccount.profilePictureUrl || null,
    }
}

/**
 * Middleware to verify Privy authentication
 * Returns the Twitter account if authenticated, null otherwise
 */
export async function requireTwitterAuth(request: NextRequest) {
    const user = await getPrivyUser(request)
    if (!user) {
        // For development/testing, fallback to header-based auth
        if (process.env.NODE_ENV === 'development') {
            const twitterId = request.headers.get('x-twitter-id')
            const twitterHandle = request.headers.get('x-twitter-handle')

            if (twitterId && twitterHandle) {
                return {
                    id: twitterId,
                    username: twitterHandle,
                    name: request.headers.get('x-twitter-name') || null,
                    profilePictureUrl: request.headers.get('x-twitter-avatar') || null,
                }
            }
        }
        return null
    }

    return getTwitterAccount(user)
}

/**
 * Generate a secure session token
 */
export function generateSessionToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Hash a value using SHA-256
 */
export async function hashValue(value: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(value)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
