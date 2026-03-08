export type TransactionType = 'income' | 'expense' | 'transfer';

export type PaymentMethod = 'cash' | 'card' | 'bank' | 'wallet' | 'upi';

export type CategoryId =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'bills'
  | 'health'
  | 'entertainment'
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'gift'
  | 'other';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: CategoryId;
  date: string; // ISO string
  note: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  categoryId: CategoryId;
  amount: number;
  spent: number;
  month: string; // YYYY-MM format
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  currency: string;
  currencySymbol: string;
  monthlyIncome: number;
  priorities: string[];
  onboardingComplete: boolean;
  darkMode: boolean;
}

export interface MonthlyReport {
  month: string;
  totalIncome: number;
  totalExpense: number;
  savings: number;
  savingsRate: number;
  topCategory: CategoryId;
  categoryBreakdown: Record<CategoryId, number>;
}

export interface InsightMessage {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  icon: string;
}
