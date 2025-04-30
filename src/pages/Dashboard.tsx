import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity, DollarSign, Eye } from 'lucide-react';
import MarketIndices from '../components/MarketIndices';
import StockList from '../components/StockList';
import { marketIndices, stocks, portfolio } from '../data/mockData';

const Dashboard = () => {
  // Calculate portfolio metrics
  const totalInvestment = portfolio.reduce((sum, item) => sum + (item.averagePrice * item.quantity), 0);
  const currentValue = portfolio.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0);
  const overallPnl = currentValue - totalInvestment;
  const overallPnlPercent = (overallPnl / totalInvestment) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Market Indices */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
        <MarketIndices indices={marketIndices} />
      </div>

      {/* Portfolio Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Portfolio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-start">
              <div className="p-2 rounded-md bg-blue-100 text-blue-600 mr-3">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Current Value</p>
                <p className="text-xl font-semibold mt-1">₹{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-start">
              <div className="p-2 rounded-md bg-purple-100 text-purple-600 mr-3">
                <BarChart3 size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Invested</p>
                <p className="text-xl font-semibold mt-1">₹{totalInvestment.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-start">
              <div className={`p-2 rounded-md ${overallPnl >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} mr-3`}>
                {overallPnl >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">P&L</p>
                <div className={`flex items-center ${overallPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  <p className="text-xl font-semibold mt-1">
                    {overallPnl >= 0 ? '+' : ''}₹{Math.abs(overallPnl).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm ml-2 mt-1">
                    ({overallPnlPercent >= 0 ? '+' : ''}{overallPnlPercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist / Top Gainers */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Eye size={20} className="text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold">Watchlist</h2>
        </div>
        <StockList 
          stocks={stocks.filter(stock => 
            portfolio.some(item => item.stockId === stock.id)
          )} 
          title="Your Watchlist"
        />
      </div>

      {/* Top Stocks */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Activity size={20} className="text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold">Market Movers</h2>
        </div>
        <StockList 
          stocks={[...stocks].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)).slice(0, 5)} 
          title="Top Market Movers"
        />
      </div>
    </div>
  );
};

export default Dashboard;