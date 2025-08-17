/**
 * Encode Twitter ID to base36 for shorter, cleaner referral codes
 * @param twitterId - The numeric Twitter ID
 * @returns base36 encoded string
 */
export function encodeReferralCode(twitterId: string): string {
    try {
        // Validate input
        if (!twitterId || typeof twitterId !== 'string') {
            throw new Error('Invalid Twitter ID')
        }

        // Remove any non-numeric characters and convert to base36
        const numericId = twitterId.replace(/\D/g, '')

        // Validate numeric ID
        if (!numericId || numericId.length < 5 || numericId.length > 20) {
            throw new Error('Invalid Twitter ID format')
        }

        const encoded = parseInt(numericId, 10).toString(36)

        // Add a simple checksum character for integrity
        const checksum = numericId.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0) % 36
        return `${encoded}${checksum.toString(36)}`
    } catch (error) {
        console.error('Encoding error:', error)
        // Return empty string on error to prevent invalid codes
        return ''
    }
}

/**
 * Decode base36 referral code back to Twitter ID
 * @param referralCode - The base36 encoded referral code with checksum
 * @returns The original Twitter ID or empty string if invalid
 */
export function decodeReferralCode(referralCode: string): string {
    try {
        // Validate input
        if (!referralCode || typeof referralCode !== 'string' || referralCode.length < 2) {
            return ''
        }

        // Sanitize input
        const sanitized = referralCode.toLowerCase().replace(/[^a-z0-9]/g, '')

        if (sanitized.length < 2) {
            return ''
        }

        // Extract checksum (last character)
        const checksumChar = sanitized[sanitized.length - 1]
        const encodedPart = sanitized.slice(0, -1)

        // Try to parse as base36
        const decoded = parseInt(encodedPart, 36).toString()

        // Validate it's a reasonable Twitter ID (numeric and reasonable length)
        if (!/^\d+$/.test(decoded) || decoded.length < 5 || decoded.length > 20) {
            return ''
        }

        // Verify checksum
        const expectedChecksum = decoded.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0) % 36
        const actualChecksum = parseInt(checksumChar, 36)

        if (expectedChecksum !== actualChecksum) {
            console.warn('[Decode] Invalid referral code checksum')
            return ''
        }

        return decoded
    } catch (error) {
        console.error('[Decode] Decoding error:', error)
        return ''
    }
}

/**
 * Generate referral URL with encoded Twitter ID
 * @param twitterId - The Twitter ID to encode
 * @param baseUrl - The base URL of the application
 * @returns The complete referral URL or empty string if invalid
 */
export function generateReferralUrl(twitterId: string, baseUrl: string): string {
    try {
        // Validate inputs
        if (!twitterId || !baseUrl) {
            return ''
        }

        // Validate base URL format
        const url = new URL(baseUrl)
        if (!url.protocol.startsWith('http')) {
            return ''
        }

        const referralCode = encodeReferralCode(twitterId)
        if (!referralCode) {
            return ''
        }

        // Use URL constructor for safe URL building
        const referralUrl = new URL(baseUrl)
        referralUrl.searchParams.set('ref', referralCode)
        return referralUrl.toString()
    } catch (error) {
        console.error('URL generation error:', error)
        return ''
    }
}
