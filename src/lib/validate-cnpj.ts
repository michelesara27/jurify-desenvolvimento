export const sanitizeDigits = (value: string) => value.replace(/\D/g, "");

export const isValidCNPJ = (cnpjRaw: string): boolean => {
  const cnpj = sanitizeDigits(cnpjRaw);
  if (!cnpj || cnpj.length !== 14) return false;
  if (/^([0-9])\1{13}$/.test(cnpj)) return false;

  const calcDigit = (numbers: string, multipliers: number[]) => {
    const sum = numbers
      .split("")
      .reduce((acc, n, i) => acc + parseInt(n, 10) * multipliers[i], 0);
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const base = cnpj.slice(0, 12);
  const d1 = calcDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calcDigit(base + d1, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return cnpj === base + String(d1) + String(d2);
};

export const formatCNPJ = (value: string) => {
  const v = sanitizeDigits(value).slice(0, 14);
  return v
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};