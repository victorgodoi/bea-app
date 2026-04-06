export function formatCurrency(amount: number, currency = 'BRL') {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(amount);
}

export function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function parseDateInput(ddmmaaaa: string): string | undefined {
  if (ddmmaaaa.length !== 10) return undefined;
  const [day, month, year] = ddmmaaaa.split('/');
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (isNaN(d) || isNaN(m) || isNaN(y)) return undefined;
  if (m < 1 || m > 12 || d < 1 || d > 31) return undefined;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export function todayFormatted(): string {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = String(now.getFullYear());
  return `${d}/${m}/${y}`;
}

export function formatAmountInput(text: string): string {
  const digits = text.replace(/\D/g, '');
  if (!digits) return '';
  const cents = parseInt(digits, 10);
  const reais = (cents / 100).toFixed(2);
  const [intPart, decPart] = reais.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formattedInt},${decPart}`;
}
