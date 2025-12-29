/**
 * Formats a phone number for tel: links
 * Removes all non-digit characters except +
 * @param phone - Phone number string
 * @returns Cleaned phone number for tel: links
 */
export function formatPhoneForTel(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

