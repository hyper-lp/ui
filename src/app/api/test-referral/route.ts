import { NextResponse } from 'next/server'
import { encodeReferralCode, decodeReferralCode } from '@/utils/referral.util'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const twitterId = searchParams.get('id')
    const code = searchParams.get('code')
    
    if (twitterId) {
        // Test encoding
        const referralCode = encodeReferralCode(twitterId)
        const decodedId = decodeReferralCode(referralCode)
        
        return NextResponse.json({
            originalId: twitterId,
            encodedCode: referralCode,
            decodedId: decodedId,
            success: twitterId === decodedId,
            referralUrl: `${request.headers.get('origin')}/?ref=${referralCode}`
        })
    }
    
    if (code) {
        // Test decoding
        const decodedId = decodeReferralCode(code)
        const reEncodedCode = decodedId ? encodeReferralCode(decodedId) : ''
        
        return NextResponse.json({
            providedCode: code,
            decodedId: decodedId || 'FAILED TO DECODE',
            reEncodedCode: reEncodedCode,
            isValid: !!decodedId,
            checksumValid: code === reEncodedCode
        })
    }
    
    return NextResponse.json({ 
        error: 'Provide either ?id=TWITTER_ID or ?code=REFERRAL_CODE' 
    }, { status: 400 })
}