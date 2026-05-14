import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value ?? 0));
}

export function formatDate(value: string | null | undefined, pattern = "dd 'de' MMM") {
  if (!value) return 'Sem data';
  try {
    return format(parseISO(value), pattern, { locale: ptBR });
  } catch {
    return 'Sem data';
  }
}

export function formatDateTime(value: string | null | undefined) {
  return formatDate(value, "dd/MM/yyyy 'às' HH:mm");
}

export function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function initials(name?: string | null) {
  if (!name) return 'HC';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}
