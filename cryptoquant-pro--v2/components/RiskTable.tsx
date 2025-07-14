
import React from 'react';

const riskData = [
  { asset: 'BTC', sharpe: 1.25, drawdown: '-55%', volatility: '45%', correlation: 1.0 },
  { asset: 'ETH', sharpe: 1.10, drawdown: '-65%', volatility: '60%', correlation: 0.85 },
  { asset: 'TOTAL', sharpe: 1.15, drawdown: '-60%', volatility: '50%', correlation: 0.95 },
  { asset: 'SOL', sharpe: 0.95, drawdown: '-80%', volatility: '90%', correlation: 0.78 },
  { asset: 'XRP', sharpe: 0.45, drawdown: '-90%', volatility: '110%', correlation: 0.65 },
];

const RiskTable: React.FC = () => {
  return (
    <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-lg h-full">
      <h3 className="text-lg font-semibold text-brand-text mb-4">Risk Metrics</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-brand-secondary uppercase border-b border-brand-border">
            <tr>
              <th className="py-3 px-4">Asset</th>
              <th className="py-3 px-4">Sharpe</th>
              <th className="py-3 px-4">Drawdown</th>
              <th className="py-3 px-4">Volatility</th>
            </tr>
          </thead>
          <tbody className="text-brand-text">
            {riskData.map((row) => (
              <tr key={row.asset} className="border-b border-brand-border last:border-b-0 hover:bg-gray-800/50">
                <td className="py-3 px-4 font-medium">{row.asset}</td>
                <td className="py-3 px-4">{row.sharpe.toFixed(2)}</td>
                <td className="py-3 px-4 text-brand-danger">{row.drawdown}</td>
                <td className="py-3 px-4">{row.volatility}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(RiskTable);
