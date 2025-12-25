
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import FinancialInsights from '../FinancialInsights';

const RefinanceCalculator: React.FC = () => {
  const [currentBalance, setCurrentBalance] = useState(350000);
  const [currentRate, setCurrentRate] = useState(7.25);
  const [newRate, setNewRate] = useState(5.75);
  const [newTerm, setNewTerm] = useState(30);
  const [refiCosts, setRefiCosts] = useState(6000);

  const [results, setResults] = useState({
    currentPayment: 0,
    newPayment: 0,
    monthlySavings: 0,
    breakEvenMonths: 0
  });

  useEffect(() => {
    // Current Payment Estimation (assuming 30yr fixed for current as well for comparison)
    const calculatePI = (p: number, r: number, t: number) => {
      const monthlyRate = r / 100 / 12;
      const numPayments = t * 12;
      if (monthlyRate === 0) return p / numPayments;
      return p * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    };

    const currentPI = calculatePI(currentBalance, currentRate, 30);
    const newPI = calculatePI(currentBalance, newRate, newTerm);
    const savings = currentPI - newPI;
    const breakEven = savings > 0 ? refiCosts / savings : 0;

    setResults({
      currentPayment: currentPI,
      newPayment: newPI,
      monthlySavings: savings,
      breakEvenMonths: breakEven
    });
  }, [currentBalance, currentRate, newRate, newTerm, refiCosts]);

  const chartData = [
    { name: 'Current', value: results.currentPayment, color: '#94a3b8' },
    { name: 'Proposed', value: results.newPayment, color: '#2563eb' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-1">Refinance Analysis</h2>
          <p className="text-slate-500 text-sm">Compare your current terms with today's rates to see potential savings.</p>
        </div>
        
        <div className="space-y-5">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 shadow-inner">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Loan Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Remaining Balance ($)</label>
                <input 
                  type="number" 
                  value={currentBalance} 
                  onChange={(e) => setCurrentBalance(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Current Rate (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={currentRate} 
                  onChange={(e) => setCurrentRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-4 shadow-inner">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">New Loan Proposal</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">New Rate (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={newRate} 
                  onChange={(e) => setNewRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">New Term (Years)</label>
                <select 
                  value={newTerm} 
                  onChange={(e) => setNewTerm(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900"
                >
                  <option value={30}>30 Years</option>
                  <option value={20}>20 Years</option>
                  <option value={15}>15 Years</option>
                  <option value={10}>10 Years</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Estimated Closing Costs ($)</label>
              <input 
                type="number" 
                value={refiCosts} 
                onChange={(e) => setRefiCosts(Number(e.target.value))}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white"
              />
            </div>
          </div>
        </div>

        <FinancialInsights 
          type="refinance" 
          data={{ ...results, currentBalance, currentRate, newRate, newTerm, refiCosts }} 
        />
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-1">Monthly Savings</span>
              <div className={`text-3xl font-bold ${results.monthlySavings > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${Math.abs(results.monthlySavings).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-sm font-normal ml-1 text-slate-400">{results.monthlySavings >= 0 ? 'Saved' : 'Increase'}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-1">Break-Even Point</span>
              <div className="text-3xl font-bold text-white">
                {results.monthlySavings > 0 ? Math.ceil(results.breakEvenMonths) : '∞'}
                <span className="text-sm font-normal ml-1 text-slate-400">Months</span>
              </div>
            </div>
          </div>

          <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-slate-500">Comparison of Monthly Principal & Interest Payments</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
           <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
             <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             Savings Summary
           </h4>
           <div className="space-y-3">
             <div className="flex justify-between text-sm">
               <span className="text-slate-500">Total Savings (5 Years)</span>
               <span className="font-semibold text-emerald-600">${(results.monthlySavings * 60 - (results.monthlySavings > 0 ? refiCosts : 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-slate-500">Total Interest Difference</span>
               <span className="font-semibold text-slate-800">Calculated upon request</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RefinanceCalculator;
