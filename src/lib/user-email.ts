const EMAIL_PATTERN = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
const WALLET_ADDRESS_PATTERN = /^0x[a-f0-9]{40}$/i

export function isWalletPlaceholderEmail(email?: string | null) {
  const rawEmail = email?.trim() ?? ''
  if (!rawEmail) {
    return false
  }

  const localPart = rawEmail.split('@')[0]
  return WALLET_ADDRESS_PATTERN.test(localPart)
}

export function hasUsableUserEmail(email?: string | null) {
  const rawEmail = email?.trim() ?? ''
  return Boolean(rawEmail && EMAIL_PATTERN.test(rawEmail) && !isWalletPlaceholderEmail(rawEmail))
}
