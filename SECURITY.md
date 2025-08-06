# Security Measures for Referral System

## Overview
This document outlines the security measures implemented to protect the waitlist referral system from various attack vectors.

## Implemented Security Measures

### 1. Input Validation & Sanitization
- **Twitter ID Validation**: Strict format validation (numeric, 5-20 characters)
- **Twitter Handle Validation**: Alphanumeric and underscore only, max 15 characters
- **Email Validation**: Proper email format check with regex
- **Input Sanitization**: All inputs are sanitized before database storage
- **URL Validation**: Avatar URLs must start with `https://`

### 2. Rate Limiting
- **IP-based Rate Limiting**: 
  - Join endpoint: 10 requests per 5 minutes per IP
  - Status endpoint: 30 requests per minute per IP
- **Account-based Rate Limiting**: 3 join attempts per hour per Twitter account
- **Configurable**: Can be disabled via `RATE_LIMIT_ENABLED` env variable for development

### 3. Referral System Protection
- **Self-referral Prevention**: Users cannot refer themselves
- **Circular Referral Detection**: Prevents A→B→A referral loops
- **Referral Limit**: Maximum 100 referrals per user to prevent gaming
- **Checksum Validation**: Referral codes include checksums to prevent tampering
- **Code Sanitization**: Referral codes are sanitized and validated

### 4. Database Security
- **Unique Constraints**: Twitter ID must be unique
- **Email Deduplication**: Prevents multiple accounts with same email
- **Transaction Safety**: Atomic operations for referral counting
- **SQL Injection Prevention**: Using Prisma ORM with parameterized queries

### 5. Error Handling
- **Secure Error Messages**: Generic error messages to prevent information leakage
- **Error Logging**: Detailed errors logged server-side only
- **Graceful Degradation**: System continues functioning even with invalid referrals

### 6. Authentication & Authorization
- **Privy Integration**: Twitter OAuth for secure authentication
- **Header Validation**: Custom headers validated for API requests
- **CORS Configuration**: Proper CORS headers set for API endpoints

### 7. Data Privacy
- **Minimal Data Collection**: Only essential user data stored
- **No Password Storage**: Authentication handled by Twitter OAuth
- **Secure Data Transmission**: HTTPS enforced in production

## Environment Variables

```env
# Required for production
API_SECRET_KEY=""         # Generate with: openssl rand -hex 32
RATE_LIMIT_ENABLED="true" # Enable rate limiting in production
```

## Best Practices

1. **Regular Security Audits**: Review logs for suspicious patterns
2. **Monitor Rate Limits**: Adjust limits based on legitimate usage patterns
3. **Update Dependencies**: Keep Privy SDK and other dependencies updated
4. **Backup Strategy**: Regular database backups
5. **Incident Response**: Have a plan for handling security incidents

## Potential Improvements

1. **Redis for Rate Limiting**: Current in-memory storage resets on deployment
2. **JWT Verification**: Implement proper Privy JWT verification on server
3. **IP Allowlisting**: For admin endpoints
4. **Webhook Validation**: If integrating with external services
5. **Two-Factor Authentication**: For admin access

## Security Checklist

- [x] Input validation and sanitization
- [x] Rate limiting implementation
- [x] SQL injection prevention
- [x] XSS prevention
- [x] Self-referral prevention
- [x] Circular referral detection
- [x] Referral gaming prevention
- [x] Error message sanitization
- [x] HTTPS enforcement (production)
- [ ] JWT token verification (TODO: Implement with Privy SDK)
- [ ] Redis-based rate limiting (TODO: For production scaling)

## Reporting Security Issues

If you discover a security vulnerability, please report it to the development team immediately. Do not create public GitHub issues for security vulnerabilities.

## Testing

To test the security measures:

1. **Test rate limiting**: Make rapid repeated requests
2. **Test self-referral**: Try to use your own referral code
3. **Test input validation**: Submit malformed data
4. **Test SQL injection**: Attempt SQL injection in inputs
5. **Test referral tampering**: Modify referral codes

```bash
# Example: Test rate limiting
for i in {1..20}; do
  curl -X POST http://localhost:3000/api/waitlist/join \
    -H "Content-Type: application/json" \
    -d '{"twitterId":"123456789","twitterHandle":"test"}'
done
```