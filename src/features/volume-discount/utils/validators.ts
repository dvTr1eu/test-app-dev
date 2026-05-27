export type ValidationResult = true | string;

type NumberValidationOptions = {
  label?: string;
  integerOnly?: boolean;
  allowZero?: boolean;
  allowNegative?: boolean;
};

export function validateRequiredText(
  value: string,
  label = 'This field',
): ValidationResult {
  if (!value?.trim()) {
    return `${label} cannot be empty`;
  }

  return true;
}

export function validateNumber(
  value: string | number,
  options: NumberValidationOptions = {},
): ValidationResult {
  const {
    label = 'This field',
    integerOnly = false,
    allowZero = false,
    allowNegative = false,
  } = options;

  if (value === '' || value === null || value === undefined) {
    return `${label} is required`;
  }

  const normalized = String(value).trim();

  if (normalized === '') {
    return `${label} is required`;
  }

  const regex = integerOnly
    ? (allowNegative ? /^-?\d+$/ : /^\d+$/)
    : (allowNegative ? /^-?\d+\.?\d*$/ : /^\d+\.?\d*$/);

  if (!regex.test(normalized)) {
    return integerOnly
      ? `${label} must be a whole number`
      : `${label} must be a valid number`;
  }

  const num = Number(normalized);

  if (Number.isNaN(num)) {
    return `${label} must be a valid number`;
  }

  if (!allowNegative && num < 0) {
    return `${label} cannot be a negative number`;
  }

  if (!allowZero && num === 0) {
    return `${label} must be greater than 0`;
  }

  return true;
}

export function sanitizeIntegerInput(value: string): string {
  return value.replace(/\D/g, '');
}

export function sanitizeDecimalInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length <= 1) {
    return cleaned;
  }
  return `${parts[0]}.${parts.slice(1).join('')}`;
}

export function validateQuantity(value: string | number): ValidationResult {
  return validateNumber(value, {
    label: 'Quantity',
    integerOnly: true,
  });
}

export function validateAmount(value: string | number): ValidationResult {
  return validateNumber(value, {
    label: 'Amount',
    integerOnly: false,
  });
}
