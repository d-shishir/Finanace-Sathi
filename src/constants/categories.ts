import type { Category } from '@/types';

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'Food & Dining', icon: '🍕', color: '#F97316' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: '#3B82F6' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#8B5CF6' },
  { id: 'bills', name: 'Bills & Utilities', icon: '📄', color: '#EF4444' },
  { id: 'health', name: 'Health', icon: '💊', color: '#10B981' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#EC4899' },
  { id: 'other', name: 'Other', icon: '📌', color: '#6B7280' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', icon: '💰', color: '#10B981' },
  { id: 'freelance', name: 'Freelance', icon: '💻', color: '#6366F1' },
  { id: 'investment', name: 'Investment', icon: '📈', color: '#14B8A6' },
  { id: 'gift', name: 'Gift', icon: '🎁', color: '#F59E0B' },
  { id: 'other', name: 'Other', icon: '📌', color: '#6B7280' },
];

export const ALL_CATEGORIES: Category[] = [
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES.filter((c) => !EXPENSE_CATEGORIES.find((e) => e.id === c.id)),
];

export function getCategoryById(id: string): Category {
  return (
    ALL_CATEGORIES.find((c) => c.id === id) ?? {
      id: 'other',
      name: 'Other',
      icon: '📌',
      color: '#6B7280',
    }
  );
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'NPR', symbol: 'रू', name: 'Nepalese Rupee' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
];

export const PAYMENT_METHODS = [
  { id: 'cash' as const, name: 'Cash', icon: '💵' },
  { id: 'card' as const, name: 'Card', icon: '💳' },
  { id: 'bank' as const, name: 'Bank Transfer', icon: '🏦' },
  { id: 'wallet' as const, name: 'Digital Wallet', icon: '📱' },
  { id: 'upi' as const, name: 'UPI', icon: '⚡' },
];

export const FINANCIAL_PRIORITIES = [
  { id: 'save_more', label: 'Save More Money', icon: '🐷' },
  { id: 'reduce_spending', label: 'Reduce Spending', icon: '📉' },
  { id: 'build_emergency', label: 'Build Emergency Fund', icon: '🛡️' },
  { id: 'pay_debt', label: 'Pay Off Debt', icon: '💳' },
  { id: 'invest', label: 'Start Investing', icon: '📈' },
  { id: 'budget', label: 'Better Budgeting', icon: '📊' },
];
