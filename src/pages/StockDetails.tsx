import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart4, 
  Activity, 
  DollarSign, 
  Building, 
  Eye,
  EyeOff,
  Calendar,
  Clock 
} from 'lucide-react';
import StockChart from '../components/StockChart';
import { stocks, generateChartData } from '../data/mockData';

const StockDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'All'>('1M');
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState<number>(1);
  const [isInWatchlist, setIsInWatchlist] = useState<boolean>(true);
  
  // Get stock data
  const stock = stocks.find(s => s.id === id);
  
  // Generate chart data based on timeframe
  const getDaysForTimeframe = (): number => {
    switch (timeframe) {
      case '1D': return 1;
      case '1W': return 7;
      case '1M': return 30;
      case '3M': return 90;
      case '6M': return 180;
      case '1Y': return 365;
      case 'All': return 1095; // 3 years
      default: return 30;
    }
  };
  
  const chartData = stock ? generateChartData(stock.id, getDaysForTimeframe()) : [];
  
  // Calculate order total
  const orderTotal = stock ? stock.price * quantity : 0;

  if (!stock) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Stock not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stock Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">{stock.name}</h1>
              <button 
                className="ml-2 p-1.5 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                onClick={() => setIsInWatchlist(!isInWatchlist)}
              >
                {isInWatchlist ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <p className="text-gray-600 text-sm mt-1">{stock.symbol} • NSE</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">₹{stock.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              <span className={`ml-2 flex items-center text-sm font-medium ${
                stock.change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {stock.change >= 0 ? (
                  <TrendingUp size={16} className="mr-1" />
                ) : (
                  <TrendingDown size={16} className="mr-1" />
                )}
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </span>
            </div>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <Clock size={12} className="mr-1" />
              <span>Last updated: Today, 3:30 PM</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stock Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Price Chart</h2>
            <div className="flex space-x-2">
              {(['1D', '1W', '1M', '3M', '6M', '1Y', 'All'] as const).map((tf) => (
                <button
                  key={tf}
                  className={`px-3 py-1 text-xs rounded-full ${
                    timeframe === tf 
                      ? 'bg-blue-100 text-blue-600 font-medium' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <StockChart 
              data={chartData} 
              width={800} 
              height={350} 
              color={stock.change >= 0 ? '#10B981' : '#EF4444'}
            />
          </div>
          
          {/* Stock Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <DollarSign size={14} className="mr-1" /> Market Cap
              </p>
              <p className="text-base font-medium mt-1">
                ₹{(stock.marketCap / 10000000).toFixed(2)} Cr
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <Activity size={14} className="mr-1" /> Volume
              </p>
              <p className="text-base font-medium mt-1">
                {stock.volume.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <Building size={14} className="mr-1" /> Sector
              </p>
              <p className="text-base font-medium mt-1">
                {stock.sector}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <BarChart4 size={14} className="mr-1" /> 52W Range
              </p>
              <p className="text-base font-medium mt-1">
                ₹{(stock.price * 0.85).toFixed(2)} - ₹{(stock.price * 1.15).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Order Panel */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-medium mb-4">Place Order</h2>
          
          {/* Order Type Selector */}
          <div className="flex mb-6">
            <button
              className={`flex-1 py-2 text-center rounded-l-md ${
                orderType === 'BUY' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setOrderType('BUY')}
            >
              Buy
            </button>
            <button
              className={`flex-1 py-2 text-center rounded-r-md ${
                orderType === 'SELL' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setOrderType('SELL')}
            >
              Sell
            </button>
          </div>
          
          {/* Quantity */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <div className="flex">
              <button
                className="px-3 py-2 rounded-l-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                className="flex-1 text-center p-2 border-t border-b border-gray-300 focus:outline-none focus:ring-0"
                min="1"
              />
              <button
                className="px-3 py-2 rounded-r-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500">₹</span>
              </div>
              <input
                type="text"
                value={stock.price.toFixed(2)}
                readOnly
                className="w-full pl-8 p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
          
          {/* Total */}
          <div className="mb-6">
            <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
              <span>Estimated Total</span>
              <span>
                {orderType === 'BUY' ? 'Debit' : 'Credit'}: ₹{orderTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${orderType === 'BUY' ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, (quantity / 10) * 100)}%` }}
              />
            </div>
          </div>
          
          {/* Action Button */}
          <button
            className={`w-full py-3 rounded-md font-medium text-white ${
              orderType === 'BUY' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {orderType === 'BUY' ? 'Buy' : 'Sell'} {stock.symbol}
          </button>
          
          {/* Additional Info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md text-xs text-gray-500">
            <div className="flex items-start mb-2">
              <Calendar size={14} className="mr-1.5 mt-0.5" />
              <span>Orders placed now will be executed when the market opens tomorrow at 9:15 AM.</span>
            </div>
            <div className="flex items-start">
              <span className="mr-1.5">ⓘ</span>
              <span>5% brokerage will be charged on the transaction value.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;