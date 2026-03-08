import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

export function formatCurrency(amount: number, symbol = '$'): string {
  const absAmount = Math.abs(amount);
  if (absAmount >= 1_000_000) {
    return `${symbol}${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (absAmount >= 1_000) {
    return `${symbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `${symbol}${amount.toFixed(2)}`;
}

export function formatCompactCurrency(amount: number, symbol = '$'): string {
  const absAmount = Math.abs(amount);
  if (absAmount >= 1_000_000) return `${symbol}${(amount / 1_000_000).toFixed(1)}M`;
  if (absAmount >= 1_000) return `${symbol}${(amount / 1_000).toFixed(1)}k`;
  return `${symbol}${amount.toFixed(0)}`;
}

export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

export function formatTime(dateStr: string): string {
  return format(parseISO(dateStr), 'h:mm a');
}

export function formatRelativeDate(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
}

export function formatMonth(dateStr: string): string {
  return format(parseISO(dateStr + '-01'), 'MMMM yyyy');
}

export function getCurrentMonth(): string {
  return format(new Date(), 'yyyy-MM');
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

export function getMonthRange(monthStr: string): { start: string; end: string } {
  const [year, month] = monthStr.split('-').map(Number);
  const start = new Date(year, month - 1, 1).toISOString();
  const lastDay = new Date(year, month, 0).getDate();
  const end = new Date(year, month - 1, lastDay, 23, 59, 59).toISOString();
  return { start, end };
}
