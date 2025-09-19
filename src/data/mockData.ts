export interface ChartData {
  date: string;
  account1: number;
  account2: number;
  account3: number;
  account4: number;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  change: number;
  changePercent: number;
}

// Generate sample data for the last 30 days
const generateChartData = (): ChartData[] => {
  const data: ChartData[] = [];
  const today = new Date();

  // Starting balances
  let account1 = 50000;
  let account2 = 25000;
  let account3 = 75000;
  let account4 = 40000;

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simulate different growth patterns
    // Growth Account - steady upward trend
    account1 += (Math.random() - 0.3) * 1000 + 200;

    // Conservative Account - slow but steady growth
    account2 += (Math.random() - 0.4) * 300 + 100;

    // Aggressive Account - volatile but high potential
    account3 += (Math.random() - 0.35) * 2000 + 300;

    // Balanced Account - moderate growth with some volatility
    account4 += (Math.random() - 0.35) * 800 + 150;

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      account1: Math.max(account1, 10000),
      account2: Math.max(account2, 5000),
      account3: Math.max(account3, 20000),
      account4: Math.max(account4, 10000),
    });
  }
  console.log('data:', data);

  return data;
};

export const chartData = generateChartData();

export const accounts: Account[] = [
  {
    id: 'account1',
    name: 'Growth',
    balance: chartData[chartData.length - 1].account1,
    change: chartData[chartData.length - 1].account1 - 50000,
    changePercent: ((chartData[chartData.length - 1].account1 - 50000) / 50000) * 100,
  },
  {
    id: 'account2',
    name: 'Conservative',
    balance: chartData[chartData.length - 1].account2,
    change: chartData[chartData.length - 1].account2 - 25000,
    changePercent: ((chartData[chartData.length - 1].account2 - 25000) / 25000) * 100,
  },
  {
    id: 'account3',
    name: 'Aggressive',
    balance: chartData[chartData.length - 1].account3,
    change: chartData[chartData.length - 1].account3 - 75000,
    changePercent: ((chartData[chartData.length - 1].account3 - 75000) / 75000) * 100,
  },
  {
    id: 'account4',
    name: 'Balanced',
    balance: chartData[chartData.length - 1].account4,
    change: chartData[chartData.length - 1].account4 - 40000,
    changePercent: ((chartData[chartData.length - 1].account4 - 40000) / 40000) * 100,
  },
  {
    id: 'account5',
    name: 'Balanced',
    balance: chartData[chartData.length - 1].account4,
    change: chartData[chartData.length - 1].account4 - 40000,
    changePercent: ((chartData[chartData.length - 1].account4 - 40000) / 40000) * 100,
  },
];
