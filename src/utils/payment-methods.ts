export const PAYMENT_TYPE_OPTIONS = [
  { label: 'Cartão de Crédito', value: 'credit' },
  { label: 'Cartão de Débito', value: 'debit' },
  { label: 'Cartão Pré-pago', value: 'prepaid' },
  { label: 'Dinheiro', value: 'cash' },
  { label: 'PIX', value: 'pix' },
  { label: 'Transferência Bancária', value: 'bank_transfer' },
];

export const FLAG_OPTIONS = [
  { label: 'Visa', value: 'visa' },
  { label: 'Mastercard', value: 'mastercard' },
  { label: 'Elo', value: 'elo' },
  { label: 'American Express', value: 'american_express' },
  { label: 'Outro', value: 'other' },
];

export function convertExpirationDate(mmaaDate: string): string | undefined {
  if (!mmaaDate || mmaaDate.length !== 5) return undefined;

  const [month, year] = mmaaDate.split('/');

  const monthNum = parseInt(month, 10);
  if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return undefined;
  }

  const fullYear = `20${year}`;
  const paddedMonth = month.padStart(2, '0');
  return `${fullYear}-${paddedMonth}-01`;
}
