// One place for contact details and links. Anything null is hidden everywhere.
// Later this can be filled from GET /settings.
export default {
  legalName: 'BudgetAddaa E-Commerce Services Private Limited',
  email: 'support@appzeto.com',
  phones: [
    { label: '+91 76918 10506', href: 'tel:+917691810506' },
    { label: '+91 63750 95971', href: 'tel:+916375095971' },
  ],
  // Country code + number, digits only. null hides the WhatsApp button.
  whatsapp: '917691810506',
  address: 'Office No 501, Princess Center, 5th Floor, New Palasia, Indore, Madhya Pradesh 452001',
  // Found on the old site but not confirmed as yours. Add the real URLs to show them.
  social: { linkedin: null, instagram: null, x: null, github: null },
}
