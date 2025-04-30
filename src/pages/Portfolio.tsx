import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  ArrowUpDown,
  Search,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { portfolio, stocks } from '../data/mockData';

type SortKey = 'symbol' | 'quantity' | 'averagePrice' | 'currentPrice' | 'value' | 'pnl' | 'pnlPercent';
type SortDirection = 'asc' | 'desc';

const Portfolio = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('value');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Calculate portfolio metrics
  const totalInvestment = portfolio.reduce((sum, item) => sum + (item.averagePrice * item.quantity), 0);
  const currentValue = portfolio.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0);
  const overallPnl = currentValue - totalInvestment;
  const overallPnlPercent = (overallPnl / totalInvestment) * 100;
  
  // Filter portfolio based on search
  const filteredPortfolio = portfolio.filter(item => 
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort portfolio
  const sortedPortfolio = [...filteredPortfolio].sort((a, b) => {
    let aValue = a[sortKey];
    let bValue = b[sortKey];
    
    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    // Handle number comparison
    return sortDirection === 'asc' ? (aValue - bValue) : (bValue - aValue);
  });
  
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc'); // Default to descending for new sort
    }
  };
  
  const SortIcon = ({ currentKey }: { currentKey: SortKey }) => {
    if (sortKey !== currentKey) {
      return <ArrowUpDown size={14} className="ml-1 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="ml-1 text-gray-800" />
      : <ArrowDown size={14} className="ml-1 text-gray-800" />;
  };
  
  const handleStockClick = (stockId: string) => {
    navigate(`/stocks/${stockId}`);
  };
  
  // Calculate sector allocation for pie chart
  const sectorAllocation: Record<string, number> = {};
  portfolio.forEach(item => {
    const stock = stocks.find(s => s.id === item.stockId);
    if (stock) {
      const sector = stock.sector;
      const value = item.currentPrice * item.quantity;
      sectorAllocation[sector] = (sectorAllocation[sector] || 0) + value;
    }
  });
  
  const sectorColors: Record<string, string> = {
    'IT': '#3B82F6',
    'Banking': '#10B981',
    'Oil & Gas': '#F59E0B',
    'Telecom': '#8B5CF6',
    'FMCG': '#EC4899',
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between">
          <div>
            <h1 className="text-2xl font-bold">Your Portfolio</h1>
            <p className="text-gray-600">Manage and track your investments</p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex flex-col items-end">
            <div className="text-xl font-bold">₹{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
            <div className={`flex items-center ${overallPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {overallPnl >= 0 ? (
                <TrendingUp size={16} className="mr-1" />
              ) : (
                <TrendingDown size={16} className="mr-1" />
              )}
              <span>
                {overallPnl >= 0 ? '+' : ''}₹{Math.abs(overallPnl).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                &nbsp;({overallPnlPercent >= 0 ? '+' : ''}{overallPnlPercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                className="w-full px-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search holdings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('symbol')}
                    >
                      Stock
                      <SortIcon currentKey="symbol" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center ml-auto focus:outline-none"
                      onClick={() => handleSort('quantity')}
                    >
                      Qty
                      <SortIcon currentKey="quantity" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center ml-auto focus:outline-none"
                      onClick={() => handleSort('averagePrice')}
                    >
                      Avg. Cost
                      <SortIcon currentKey="averagePrice" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center ml-auto focus:outline-none"
                      onClick={() => handleSort('currentPrice')}
                    >
                      LTP
                      <SortIcon currentKey="currentPrice" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center ml-auto focus:outline-none"
                      onClick={() => handleSort('value')}
                    >
                      Value
                      <SortIcon currentKey="value" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center ml-auto focus:outline-none"
                      onClick={() => handleSort('pnlPercent')}
                    >
                      P&L %
                      <SortIcon currentKey="pnlPercent" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedPortfolio.length > 0 ? (
                  sortedPortfolio.map((item) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleStockClick(item.stockId)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{item.symbol}</div>
                        <div className="text-xs text-gray-500">{item.name}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        ₹{item.averagePrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        ₹{item.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        ₹{item.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap text-right text-sm font-medium ${
                        item.pnlPercent >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        <div className="flex items-center justify-end">
                          {item.pnlPercent >= 0 ? (
                            <TrendingUp size={16} className="mr-1" />
                          ) : (
                            <TrendingDown size={16} className="mr-1" />
                          )}
                          <span>
                            {item.pnlPercent >= 0 ? '+' : ''}{item.pnlPercent.toFixed(2)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500">
                      No stocks found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Portfolio Analytics */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <PieChart size={20} className="text-gray-600 mr-2" />
            <h2 className="text-lg font-medium">Sector Allocation</h2>
          </div>
          
          {/* Simple SVG Pie Chart */}
          <div className="flex justify-center mb-6">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <g transform="translate(100, 100)">
                {Object.entries(sectorAllocation).map(([sector, value], i, arr) => {
                  // Calculate the percentage and angles for the pie slice
                  const percentage = value / currentValue;
                  let previousAngle = 0;
                  
                  // Calculate accumulated percentage for the start angle
                  for (let j = 0; j < i; j++) {
                    previousAngle += (Object.values(sectorAllocation)[j] / currentValue) * 360;
                  }
                  
                  const startAngle = (previousAngle * Math.PI) / 180;
                  const endAngle = ((previousAngle + percentage * 360) * Math.PI) / 180;
                  
                  // Create SVG arc path
                  const x1 = 80 * Math.cos(startAngle);
                  const y1 = 80 * Math.sin(startAngle);
                  const x2 = 80 * Math.cos(endAngle);
                  const y2 = 80 * Math.sin(endAngle);
                  
                  // Determine if the arc should be drawn as a large arc
                  const largeArc = percentage > 0.5 ? 1 : 0;
                  
                  return (
                    <path
                      key={sector}
                      d={`M 0 0 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={sectorColors[sector] || `hsl(${i * 60}, 70%, 60%)`}
                      stroke="#fff"
                      strokeWidth="1"
                      className="transition-opacity hover:opacity-90"
                    />
                  );
                })}
              </g>
            </svg>
          </div>
          
          {/* Legend */}
          <div className="space-y-2">
            {Object.entries(sectorAllocation).map(([sector, value]) => {
              const percentage = (value / currentValue) * 100;
              return (
                <div key={sector} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-sm mr-2" 
                      style={{ backgroundColor: sectorColors[sector] || 'gray' }}
                    />
                    <span className="text-sm text-gray-700">{sector}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Statistics</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1 text-gray-500">Total Value:</td>
                  <td className="py-1 text-right font-medium">₹{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-500">Invested:</td>
                  <td className="py-1 text-right font-medium">₹{totalInvestment.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-500">Total P&L:</td>
                  <td className={`py-1 text-right font-medium ${
                    overallPnl >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {overallPnl >= 0 ? '+' : ''}₹{Math.abs(overallPnl).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-500">Return:</td>
                  <td className={`py-1 text-right font-medium ${
                    overallPnlPercent >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {overallPnlPercent >= 0 ? '+' : ''}{overallPnlPercent.toFixed(2)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-500">Holdings:</td>
                  <td className="py-1 text-right font-medium">{portfolio.length}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;