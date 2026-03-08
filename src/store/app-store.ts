import 'react-native-get-random-values';
import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import type {
  Transaction,
  Budget,
  SavingsGoal,
  UserProfile,
  CategoryId,
  TransactionType,
  PaymentMethod,
} from '@/types';
import { getCurrentMonth } from '@/utils/formatters';
import {
  SAMPLE_TRANSACTIONS,
  SAMPLE_BUDGETS,
  SAMPLE_GOALS,
} from '@/utils/sample-data';

interface AppState {
  profile: UserProfile;
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  isLoading: boolean;

  setProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: () => void;

  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  addBudget: (categoryId: CategoryId, amount: number) => void;
  updateBudget: (id: string, amount: number) => void;
  deleteBudget: (id: string) => void;

  addGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  depositToGoal: (id: string, amount: number) => void;

  getMonthlyIncome: (month?: string) => number;
  getMonthlyExpense: (month?: string) => number;
  getTotalBalance: () => number;
  getTotalSavings: () => number;
  getCategorySpending: (month?: string) => Record<string, number>;
  getWeeklySpending: () => number[];
  getTodayExpenses: () => Transaction[];
  getFilteredTransactions: (filters: {
    type?: TransactionType;
    categoryId?: CategoryId;
    startDate?: string;
    endDate?: string;
    paymentMethod?: PaymentMethod;
    search?: string;
  }) => Transaction[];

  resetAllData: () => void;
  loadSampleData: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  email: '',
  currency: 'USD',
  currencySymbol: '$',
  monthlyIncome: 0,
  priorities: [],
  onboardingComplete: false,
  darkMode: false,
};

export const useAppStore = create<AppState>((set, get) => ({
  profile: DEFAULT_PROFILE,
  transactions: [],
  budgets: [],
  goals: [],
  isLoading: false,

  setProfile: (partial) =>
    set((state) => ({ profile: { ...state.profile, ...partial } })),

  completeOnboarding: () =>
    set((state) => ({
      profile: { ...state.profile, onboardingComplete: true },
    })),

  addTransaction: (tx) => {
    const now = new Date().toISOString();
    const newTx: Transaction = { ...tx, id: uuid(), createdAt: now, updatedAt: now };
    set((state) => {
      const transactions = [newTx, ...state.transactions];
      const budgets = state.budgets.map((b) => {
        if (tx.type === 'expense' && b.categoryId === tx.categoryId) {
          const txMonth = tx.date.slice(0, 7);
          if (b.month === txMonth) {
            return { ...b, spent: b.spent + tx.amount };
          }
        }
        return b;
      });
      return { transactions, budgets };
    });
  },

  updateTransaction: (id, partial) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...partial, updatedAt: new Date().toISOString() } : t
      ),
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  addBudget: (categoryId, amount) => {
    const now = new Date().toISOString();
    const currentSpent = get()
      .transactions.filter(
        (t) =>
          t.type === 'expense' &&
          t.categoryId === categoryId &&
          t.date.slice(0, 7) === getCurrentMonth()
      )
      .reduce((sum, t) => sum + t.amount, 0);

    set((state) => ({
      budgets: [
        ...state.budgets,
        {
          id: uuid(),
          categoryId,
          amount,
          spent: currentSpent,
          month: getCurrentMonth(),
          createdAt: now,
        },
      ],
    }));
  },

  updateBudget: (id, amount) =>
    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === id ? { ...b, amount } : b)),
    })),

  deleteBudget: (id) =>
    set((state) => ({ budgets: state.budgets.filter((b) => b.id !== id) })),

  addGoal: (goal) => {
    const now = new Date().toISOString();
    set((state) => ({
      goals: [...state.goals, { ...goal, id: uuid(), createdAt: now, updatedAt: now }],
    }));
  },

  updateGoal: (id, partial) =>
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, ...partial, updatedAt: new Date().toISOString() } : g
      ),
    })),

  deleteGoal: (id) =>
    set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),

  depositToGoal: (id, amount) =>
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id
          ? {
              ...g,
              currentAmount: Math.min(g.currentAmount + amount, g.targetAmount),
              updatedAt: new Date().toISOString(),
            }
          : g
      ),
    })),

  getMonthlyIncome: (month) => {
    const m = month || getCurrentMonth();
    return get()
      .transactions.filter((t) => t.type === 'income' && t.date.slice(0, 7) === m)
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getMonthlyExpense: (month) => {
    const m = month || getCurrentMonth();
    return get()
      .transactions.filter((t) => t.type === 'expense' && t.date.slice(0, 7) === m)
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getTotalBalance: () => {
    const { transactions } = get();
    return transactions.reduce((sum, t) => {
      if (t.type === 'income') return sum + t.amount;
      if (t.type === 'expense') return sum - t.amount;
      return sum;
    }, 0);
  },

  getTotalSavings: () => {
    return get().goals.reduce((sum, g) => sum + g.currentAmount, 0);
  },

  getCategorySpending: (month) => {
    const m = month || getCurrentMonth();
    const spending: Record<string, number> = {};
    get()
      .transactions.filter((t) => t.type === 'expense' && t.date.slice(0, 7) === m)
      .forEach((t) => {
        spending[t.categoryId] = (spending[t.categoryId] || 0) + t.amount;
      });
    return spending;
  },

  getWeeklySpending: () => {
    const now = new Date();
    const days: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);
      const dayTotal = get()
        .transactions.filter(
          (t) => t.type === 'expense' && t.date.slice(0, 10) === dateStr
        )
        .reduce((sum, t) => sum + t.amount, 0);
      days.push(dayTotal);
    }
    return days;
  },

  getTodayExpenses: () => {
    const today = new Date().toISOString().slice(0, 10);
    return get().transactions.filter(
      (t) => t.type === 'expense' && t.date.slice(0, 10) === today
    );
  },

  getFilteredTransactions: (filters) => {
    let txs = get().transactions;
    if (filters.type) txs = txs.filter((t) => t.type === filters.type);
    if (filters.categoryId) txs = txs.filter((t) => t.categoryId === filters.categoryId);
    if (filters.paymentMethod)
      txs = txs.filter((t) => t.paymentMethod === filters.paymentMethod);
    if (filters.startDate) txs = txs.filter((t) => t.date >= filters.startDate!);
    if (filters.endDate) txs = txs.filter((t) => t.date <= filters.endDate!);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      txs = txs.filter(
        (t) =>
          t.note.toLowerCase().includes(q) || t.categoryId.includes(q)
      );
    }
    return txs.sort((a, b) => b.date.localeCompare(a.date));
  },

  resetAllData: () =>
    set({
      profile: DEFAULT_PROFILE,
      transactions: [],
      budgets: [],
      goals: [],
    }),

  loadSampleData: () =>
    set({
      transactions: SAMPLE_TRANSACTIONS,
      budgets: SAMPLE_BUDGETS,
      goals: SAMPLE_GOALS,
    }),
}));
