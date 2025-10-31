import { DataItem } from '@/lib/types';
import { PINATA_KEY } from '@/config/config';
import axios, { AxiosProgressEvent } from 'axios';

export const uploadToIPFS = (data: File, progress: (event: AxiosProgressEvent) => void) =>
  new Promise<string>(async (resolve, reject) => {
    const formData = new FormData();
    formData.append('file', data);
    formData.append('pinataMetadata', JSON.stringify({ name: 'SQD' }));
    formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));

    try {
      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data`, // Updated to use getBoundary()
          Authorization: `Bearer ${PINATA_KEY}`,
        },
        onUploadProgress: progress,
      });

      resolve(`https://ipfs.io/ipfs/${res.data.IpfsHash}`);
    } catch (error) {
      console.error('IPFS upload error:', error);
      reject('IPFS projectInfo upload failed');
    }
  });

export function transformData(items: DataItem[], range: '1m' | '3m' | '1y') {
  // Calculate the start date based on range
  const now = new Date();
  const startDate = new Date();
  const endDate = new Date();

  switch (range) {
    case '1m':
      startDate.setTime(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '3m':
      // Set date to 1 first to prevent overflow then subtract months
      startDate.setUTCDate(1);
      startDate.setUTCMonth(now.getMonth() - 3);
      break;
    case '1y':
      // Similarly handle year change
      startDate.setUTCDate(1);
      startDate.setUTCFullYear(now.getFullYear() - 1);
      break;
  }
  startDate.setUTCHours(0, 0, 0, 0);

  endDate.setHours(23, 59, 59, 999);
  // console.log("startDate:", startDate, "now:", now, "endDate:", endDate);

  // Filter and process each account's data
  const processedAccounts = items.map((item) => {
    // Filter data within the date range and sort by date
    const filteredHistory = item.history
      .filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= now;
      })
      .sort((a, b) => a.date - b.date);

    // Find the first data point date within the range
    const firstDataDate = filteredHistory.length > 0 ? new Date(filteredHistory[0].date) : null;

    // Create a map for quick lookup
    const historyMap = new Map();
    filteredHistory.forEach((entry) => {
      const dateKey = new Date(entry.date).toDateString();
      historyMap.set(dateKey, entry.quantity);
    });

    return {
      login: item.login,
      historyMap,
      firstDataDate,
      lastKnownQuantity: filteredHistory.length > 0 ? filteredHistory[filteredHistory.length - 1].quantity : 0,
    };
  });
  // console.log('processedAccounts:', processedAccounts);

  // Generate continuous daily data
  const result = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateKey = currentDate.toDateString();
    const record: any = {
      date: currentDate.toISOString().split('T')[0], // YYYY-MM-DD format
    };
    // console.log('dateKey:', dateKey);

    // For each account, get the quantity for this date or use the appropriate fallback
    processedAccounts.forEach((account) => {
      if (account.historyMap.has(dateKey)) {
        // Use the actual quantity for this date
        record[account.login] = account.historyMap.get(dateKey);
        // Update last known quantity for future missing dates
        account.lastKnownQuantity = account.historyMap.get(dateKey);
      } else {
        // Check if current date is before the first data point
        if (account.firstDataDate && currentDate < account.firstDataDate) {
          // Use 0 for dates before the first data point
          record[account.login] = 0;
        } else {
          // Use the last known quantity for missing dates after first data point
          record[account.login] = account.lastKnownQuantity;
        }
      }
    });

    result.push(record);
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  // console.log('result:', result);

  // Ensure we have exactly the right number of days for the range
  const expectedDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // If we have fewer days than expected, pad with 0 values at the beginning
  if (result.length < expectedDays) {
    const missingDays = expectedDays - result.length;
    const paddedResult = [];

    // Add 0 values for missing days at the beginning
    for (let i = 0; i < missingDays; i++) {
      const paddedDate = new Date(startDate);
      paddedDate.setDate(paddedDate.getDate() - missingDays + i);

      const paddedRecord: any = {
        date: paddedDate.toISOString().split('T')[0],
      };

      // All accounts get 0 for these padded days
      processedAccounts.forEach((account) => {
        paddedRecord[account.login] = 0;
      });

      paddedResult.push(paddedRecord);
    }

    // Combine padded data with actual data
    return [...paddedResult, ...result];
  }

  return result;
}

export function capitalizeFirstLetter(str: string) {
  if (!str) return ''; // handle empty string
  return str.charAt(0).toUpperCase() + str.slice(1);
}
