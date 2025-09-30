import { DataItem } from '@/lib/types';

export function transformData(items: DataItem[]) {
  // Find the max length of history arrays
  const maxLength = Math.max(...items.map((item) => item.history.length));

  // Result array
  const result = [];

  // Prepare padded histories for each item
  const paddedHistories = items.map((item) => {
    const diff = maxLength - item.history.length;
    if (diff > 0) {
      // Create padding with zero quantity and undefined/null dates, or use some default date like 0 or earliest date
      const padding = Array(diff).fill({ quantity: 0, date: 0 });
      // Prepend padding to the original history array
      return padding.concat(item.history);
    }
    return item.history;
  });

  // Loop over each index up to maxLength
  for (let i = 0; i < maxLength; i++) {
    // Object to hold date and aggregated quantities
    const record: any = { date: '' };

    // For each item (account)
    for (let j = 0; j < items.length; j++) {
      const paddedHistory = paddedHistories[j];
      const item = items[j];

      // For padded entries, date might be 0 or dummy, so set date from first real history item if not set
      if (paddedHistory[i]) {
        if (!record.date) {
          // Use null or empty string for padding dates (date=0), otherwise convert
          record.date = paddedHistory[i].date ? new Date(paddedHistory[i].date).toISOString() : '';
        }
        record[item.accountId] = paddedHistory[i].quantity || 0;
      }
    }

    result.push(record);
  }

  return result;
}
