import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MarketIndex } from '../data/mockData';

interface MarketIndicesProps {
  indices: MarketIndex[];
}

const MarketIndices: React.FC<MarketIndicesProps> = ({ indices }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {indices.map((index) => (
        <div 
          key={index.id} 
          className="flex-1 min-w-[200px] bg-white rounded-lg shadow-sm p-4 border border-gray-100 animate-fade-in"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">{index.name}</h3>
              <p className="text-xl font-semibold mt-1">{index.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
            </div>
            <div className={`flex items-center ${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {index.change >= 0 ? (
                <TrendingUp size={18} className="mr-1" />
              ) : (
                <TrendingDown size={18} className="mr-1" />
              )}
              <span className="font-medium">
                {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketIndices;