const currencyFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  maximumFractionDigits: 0,
})

export const formatCurrency = (value: number) => currencyFormatter.format(value)

export const formatTicketNumber = (value: string) =>
  value.replace(/(\d{3})(\d{3})/, '$1-$2')
