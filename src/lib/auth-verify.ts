import { NextRequest } from 'next/server'

/**
 * Verify Privy authentication token
 * In production, this should use Privy's server-side SDK to verify JWT tokens
 * For now, we implement basic validation
 */
export async function verifyPrivyAuth(request: NextRequest): Promise<{ isValid: boolean; userId?: string }> {
    try {
        // Get authorization header
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { isValid: false }
        }

        const token = authHeader.slice(7)

        // In production, verify JWT with Privy's public key
        // For now, we'll do basic validation
        if (!token || token.length < 20) {
            return { isValid: false }
        }

        // TODO: Implement proper JWT verification with Privy SDK
        // const decoded = await verifyPrivyJWT(token)
        // return { isValid: true, userId: decoded.sub }

        // For development, accept any properly formatted token
        // This should be replaced with proper verification in production
        return { isValid: true }
    } catch (error) {
        console.error('Auth verification error:', error)
        return { isValid: false }
    }
}

/**
 * Extract and validate Twitter ID from request
 */
export function extractTwitterId(request: NextRequest): string | null {
    const twitterId = request.headers.get('x-twitter-id')

    if (!twitterId) {
        return null
    }

    // Validate Twitter ID format
    if (!/^\d+$/.test(twitterId) || twitterId.length < 5 || twitterId.length > 20) {
        return null
    }

    return twitterId
}

/**
 * CORS headers for API responses
 */
export function getCorsHeaders(): HeadersInit {
    return {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Twitter-Id',
        'Access-Control-Max-Age': '86400',
    }
}
