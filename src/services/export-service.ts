import { File, Paths } from 'expo-file-system';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import type { Transaction } from '@/types';
import { getCategoryById, PAYMENT_METHODS } from '@/constants/categories';
import { format, parseISO } from 'date-fns';

export async function exportTransactionsToCSV(
  transactions: Transaction[],
  currencySymbol: string,
): Promise<void> {
  const headers = ['Date', 'Type', 'Category', 'Amount', 'Payment Method', 'Note'];
  const rows = transactions
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((tx) => {
      const category = getCategoryById(tx.categoryId);
      const pm = PAYMENT_METHODS.find((p) => p.id === tx.paymentMethod);
      return [
        format(parseISO(tx.date), 'yyyy-MM-dd HH:mm'),
        tx.type,
        category.name,
        `${currencySymbol}${tx.amount.toFixed(2)}`,
        pm?.name ?? tx.paymentMethod,
        `"${tx.note.replace(/"/g, '""')}"`,
      ].join(',');
    });

  const csv = [headers.join(','), ...rows].join('\n');
  const filename = `finance-sathi-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;

  const file = new File(Paths.cache, filename);
  file.create({ overwrite: true });
  file.write(csv);

  if (await isAvailableAsync()) {
    await shareAsync(file.uri, {
      mimeType: 'text/csv',
      UTI: 'public.comma-separated-values-text',
    });
  }
}
