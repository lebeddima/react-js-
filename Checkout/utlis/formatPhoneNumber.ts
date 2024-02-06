function isAlreadyInPhoneNumberFormat(input: string): boolean {
  // This pattern matches phone numbers in the format "+X XXX XXX XXXX"
  const phoneNumberPattern = /^\+\d{1} \d{3} \d{3} \d{4}$/

  return phoneNumberPattern.test(input)
}

export const formatPhoneNumber = (phoneNumber: string): string => {
  if (isAlreadyInPhoneNumberFormat(phoneNumber)) return phoneNumber

  const formattedPhoneNumber = `+${phoneNumber.charAt(0)} ${phoneNumber.slice(
    1,
    4,
  )} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7)}`

  return formattedPhoneNumber
}
