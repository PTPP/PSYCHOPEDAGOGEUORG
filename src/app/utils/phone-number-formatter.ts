export function createE164PhoneNumber(phoneNumber: string): string {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  if (digitsOnly.length >= 9) {
    return `+48${digitsOnly.slice(-9)}`;
  }
  return phoneNumber; // Zwróć oryginalną wartość, jeśli jest nieprawidłowa
}
