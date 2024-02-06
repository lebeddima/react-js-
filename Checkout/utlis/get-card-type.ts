type TCardType = 'VISA' | 'MASTERCARD'

export const getCardType = (cardNumber: number | string): TCardType | null => {
  const formattedCardNunber = cardNumber.toString().replace(/\D/g, '')

  const digits = formattedCardNunber.replace(/\D/g, '')

  if (/^4/.test(digits)) {
    return 'VISA'
  }

  if (/^5[1-5]/.test(digits)) {
    return 'MASTERCARD'
  }

  return null
}
