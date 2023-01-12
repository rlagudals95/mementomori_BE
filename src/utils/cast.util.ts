export function toArray(value: string[] | string): string[] {
  if (!Array.isArray(value)) {
    return [value];
  }
  return value;
}

export function toFloat(value: string): number {
  return parseFloat(value.replace(/,/g, ''));
}

export function toBoolean(value?: string): boolean {
  if (!value) {
    return false;
  } else if (value === '0' || value === '1') {
    return value === '1';
  } else if (/^(?:yes|on|true|enabled)$/i.test(value)) {
    return true;
  } else if (/^(?:no|off|false|disabled)$/i.test(value)) {
    return false;
  }
  return false;
}

export function toYyyyMmDd(value: number): string {
  const yyyyMmDdWithDash = new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(value);
  return yyyyMmDdWithDash.replace(/-/g, '');
}
