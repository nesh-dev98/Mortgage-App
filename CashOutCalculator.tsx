
import React, { useState, useEffect } from 'react';
import FinancialInsights from '../FinancialInsights';

const CashOutCalculator: React.FC = () => {
  const [homeValue, setHomeValue] = useState(550000);
  const [currentBalance, setCurrentBalance] = useState(250000);
  const [cashRequested, setCashRequested] = useState(50000);
  const [newRate, setNewRate] = useState(6.25);
  const [newTerm, setNewTerm] = useState(30);

  const [results, setResults] = useState({
    newLoanAmount: 0,
    ltv: 0,
    newMonthlyPI: 0,
    totalCashToBorrower: 0
  });

  useEffect(() => {
    const newLoan = currentBalance + cashRequested;
    const ltvRatio = (newLoan / homeValue) * 100;
    
    const monthlyRate = newRate / 100 / 12;
    const numPayments = newTerm * 12;
    let monthlyPI = 0;
    
    if (monthlyRate === 0) {
      monthlyPI = newLoan / numPayments;
    } else {
      monthlyPI = newLoan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    setResults({
      newLoanAmount: newLoan,
      ltv: ltvRatio,
      newMonthlyPI: monthlyPI,
      totalCashToBorrower: cashRequested
    });
  }, [homeValue, currentBalance, cashRequested, newRate, newTerm]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-1">Cash Out & Consolidation</h2>
          <p className="text-slate-500 text-sm">Leverage your home equity for debt consolidation or major expenses.</p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Home Market Value ($)</label>
              <input 
                type="number" 
                value={homeValue} 
                onChange={(e) => setHomeValue(Number(e.target.value))}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 shadow-sm"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Mortgage Balance ($)</label>
              <input 
                type="number" 
                value={currentBalance} 
                onChange={(e) => setCurrentBalance(Number(e.target.value))}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 shadow-sm"
              />
            </div>
          </div>

          <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-inner">
             <label className="block text-xs font-bold text-indigo-600 uppercase mb-2">Additional Cash Requested ($)</label>
             <input 
                type="number" 
                value={cashRequested} 
                onChange={(e) => setCashRequested(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-xl text-indigo-900 shadow-sm"
              />
              <p className="text-[10px] text-indigo-400 mt-2 italic">*Most lenders limit cash-out to 80% of home value.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">New Rate (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={newRate} 
                onChange={(e) => setNewRate(Number(e.target.value))}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">New Term</label>
              <select 
                value={newTerm} 
                onChange={(e) => setNewTerm(Number(e.target.value))}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 shadow-sm"
              >
                <option value={30}>30 Years</option>
                <option value={20}>20 Years</option>
                <option value={15}>15 Years</option>
              </select>
            </div>
          </div>
        </div>

        <FinancialInsights 
          type="cash-out" 
          data={{ ...results, homeValue, currentBalance, cashRequested, newRate, newTerm }} 
        />
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Estimated New Monthly Payment</span>
            <div className="text-5xl font-extrabold mt-2 mb-8">
              ${results.newMonthlyPI.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-white/10 pb-2">
                <div>
                  <span className="text-indigo-200 text-[10px] font-bold uppercase block">New Loan Amount</span>
                  <span className="text-xl font-bold">${results.newLoanAmount.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-indigo-200 text-[10px] font-bold uppercase block">Loan-to-Value (LTV)</span>
                  <span className={`text-xl font-bold ${results.ltv > 80 ? 'text-amber-300' : 'text-white'}`}>
                    {results.ltv.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl">
                 <span className="text-indigo-100 text-sm font-medium">Total Cash to You</span>
                 <span className="text-2xl font-black text-white">${results.totalCashToBorrower.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Decorative element */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="text-sm font-bold text-amber-900 mb-1">Important Consideration</h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Cash-out refinances replace your current rate with a new one on the <span className="font-bold underline">entire balance</span>. 
                If your current rate is significantly lower than {newRate}%, a Home Equity Line of Credit (HELOC) might be more cost-effective.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashOutCalculator;
