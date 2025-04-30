export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
}

export interface MarketIndex {
  id: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface PortfolioItem {
  id: string;
  stockId: string;
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  change: number;
  changePercent: number;
  value: number;
  pnl: number;
  pnlPercent: number;
}

export interface Order {
  id: string;
  stockId: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  timestamp: string;
}

export interface ChartData {
  date: string;
  value: number;
}

// Mock market indices data
export const marketIndices: MarketIndex[] = [
  { id: '1', name: 'NIFTY 50', value: 22353.8, change: 93.65, changePercent: 0.42 },
  { id: '2', name: 'SENSEX', value: 73667.6, change: 349.24, changePercent: 0.48 },
  { id: '3', name: 'NIFTY BANK', value: 49257.3, change: -82.35, changePercent: -0.17 },
  { id: '4', name: 'NIFTY IT', value: 37842.1, change: 521.75, changePercent: 1.40 },
];

// Mock stocks data
export const stocks: Stock[] = [
  { id: '1', symbol: 'RELIANCE', name: 'Reliance Industries', price: 2934.5, change: 32.7, changePercent: 1.13, volume: 4835621, marketCap: 1982456000000, sector: 'Oil & Gas' },
  { id: '2', symbol: 'TCS', name: 'Tata Consultancy Services', price: 3786.25, change: 42.8, changePercent: 1.14, volume: 1247863, marketCap: 1384562000000, sector: 'IT' },
  { id: '3', symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1467.8, change: -12.4, changePercent: -0.84, volume: 3628475, marketCap: 1126789000000, sector: 'Banking' },
  { id: '4', symbol: 'INFY', name: 'Infosys', price: 1587.15, change: 23.5, changePercent: 1.5, volume: 2184635, marketCap: 649123000000, sector: 'IT' },
  { id: '5', symbol: 'ICICIBANK', name: 'ICICI Bank', price: 974.65, change: -5.8, changePercent: -0.59, volume: 3821547, marketCap: 679845000000, sector: 'Banking' },
  { id: '6', symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1156.7, change: 18.4, changePercent: 1.61, volume: 2654871, marketCap: 647925000000, sector: 'Telecom' },
  { id: '7', symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1845.3, change: -8.7, changePercent: -0.47, volume: 1542368, marketCap: 366452000000, sector: 'Banking' },
  { id: '8', symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2347.8, change: 34.6, changePercent: 1.49, volume: 982654, marketCap: 549723000000, sector: 'FMCG' },
];

// Mock portfolio data
export const portfolio: PortfolioItem[] = [
  { id: '1', stockId: '1', symbol: 'RELIANCE', name: 'Reliance Industries', quantity: 10, averagePrice: 2850.5, currentPrice: 2934.5, change: 84, changePercent: 2.95, value: 29345, pnl: 840, pnlPercent: 2.95 },
  { id: '2', stockId: '2', symbol: 'TCS', name: 'Tata Consultancy Services', quantity: 5, averagePrice: 3700, currentPrice: 3786.25, change: 86.25, changePercent: 2.33, value: 18931.25, pnl: 431.25, pnlPercent: 2.33 },
  { id: '3', stockId: '4', symbol: 'INFY', name: 'Infosys', quantity: 15, averagePrice: 1600, currentPrice: 1587.15, change: -12.85, changePercent: -0.8, value: 23807.25, pnl: -192.75, pnlPercent: -0.8 },
  { id: '4', stockId: '6', symbol: 'BHARTIARTL', name: 'Bharti Airtel', quantity: 20, averagePrice: 1100, currentPrice: 1156.7, change: 56.7, changePercent: 5.15, value: 23134, pnl: 1134, pnlPercent: 5.15 },
];

// Mock orders data
export const orders: Order[] = [
  { id: '1', stockId: '1', symbol: 'RELIANCE', type: 'BUY', quantity: 5, price: 2850.5, status: 'COMPLETED', timestamp: '2023-04-15T10:30:45Z' },
  { id: '2', stockId: '1', symbol: 'RELIANCE', type: 'BUY', quantity: 5, price: 2850.5, status: 'COMPLETED', timestamp: '2023-04-15T10:32:15Z' },
  { id: '3', stockId: '2', symbol: 'TCS', type: 'BUY', quantity: 5, price: 3700, status: 'COMPLETED', timestamp: '2023-04-16T11:45:22Z' },
  { id: '4', stockId: '4', symbol: 'INFY', type: 'BUY', quantity: 15, price: 1600, status: 'COMPLETED', timestamp: '2023-04-17T14:20:10Z' },
  { id: '5', stockId: '6', symbol: 'BHARTIARTL', type: 'BUY', quantity: 20, price: 1100, status: 'COMPLETED', timestamp: '2023-04-18T09:15:33Z' },
  { id: '6', stockId: '3', symbol: 'HDFCBANK', type: 'BUY', quantity: 10, price: 1470, status: 'PENDING', timestamp: '2023-04-20T15:30:00Z' },
];

// Generate mock chart data for a stock
export const generateChartData = (stockId: string, days: number = 30): ChartData[] => {
  const stock = stocks.find(s => s.id === stockId);
  if (!stock) return [];
  
  const data: ChartData[] = [];
  const today = new Date();
  let baseValue = stock.price * 0.85; // Start from 85% of current price
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Add some randomness to create a realistic chart
    const randomChange = (Math.random() - 0.5) * 0.02; // Random between -1% and 1%
    baseValue = baseValue * (1 + randomChange);
    
    // Ensure the final value is close to the current price
    if (i === 0) {
      baseValue = stock.price;
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(baseValue.toFixed(2))
    });
  }
  
  return data;
};