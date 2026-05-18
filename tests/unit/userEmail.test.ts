import { describe, expect, it } from 'vitest'
import { hasUsableUserEmail, isWalletPlaceholderEmail } from '@/lib/user-email'

describe('userEmail', () => {
  it('treats Better Auth SIWE placeholder emails as unusable', () => {
    const email = '0xbc040c5a56d757986475005f8cde8e41fe3e2486@demo.kuest.com'

    expect(isWalletPlaceholderEmail(email)).toBe(true)
    expect(hasUsableUserEmail(email)).toBe(false)
  })

  it('accepts normal email addresses', () => {
    expect(isWalletPlaceholderEmail('trader@example.com')).toBe(false)
    expect(hasUsableUserEmail('trader@example.com')).toBe(true)
  })

  it('rejects missing and malformed emails', () => {
    expect(hasUsableUserEmail(null)).toBe(false)
    expect(hasUsableUserEmail('not-an-email')).toBe(false)
  })
})
