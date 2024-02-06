export const formatCardNumber = (cardNumber: string): string => {
  let maskedNumber = cardNumber.slice(-4).padStart(cardNumber.length, '*')

  // Insert spaces every 4 characters

  const match = maskedNumber.match(/.{1,4}/g)

  if (match) {
    return match.join(' ')
  }

  return ''
}
