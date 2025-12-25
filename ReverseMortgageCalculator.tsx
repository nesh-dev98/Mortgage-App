
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import FinancialInsights from '../FinancialInsights';

const ReverseMortgageCalculator: React.FC = () => {
  const [age, setAge] = useState(72);
  const [homeValue, setHomeValue] = useState(650000);
  const [currentBalance, setCurrentBalance] = useState(120000);
  const [expectedRate, setExpectedRate] = useState(7.25);

  const [results, setResults] = useState({
    grossPrincipalLimit: 0,
    closingCosts: 0,
    payoffAmount: 0,
    netCashAvailable: 0,
    ltv: 0,
    isEligible: true
  });

  useEffect(() => {
    // HECM Rules: Min age 62
    if (age < 62) {
      setResults(prev => ({ ...prev, isEligible: false }));
      return;
    }

    // 2024 FHA Max Claim Amount limit
    const fhaLimit = 1149825;
    const effectiveValue = Math.min(homeValue, fhaLimit);

    /**
     * Simplified HECM Principal Limit Factor (PLF) Heuristic
     * Actual PLFs come from HUD tables based on age and 'Expected Interest Rate'.
     * Rule of thumb: Higher age + lower rates = higher PLF.
     * Heuristic: 0.38 at age 62, increasing roughly 1.1% per year of age.
     * Adjusted slightly down for higher interest rates.
     */
    const rateAdjustment = (expectedRate - 5.0) * 0.04; // Penalty for higher rates
    const basePLF = 0.38 + (age - 62) * 0.011 - rateAdjustment;
    const plf = Math.min(Math.max(basePLF, 0.1), 0.75); // Clamp between 10% and 75%

    const grossPL = effectiveValue * plf;
    
    // Reverse Mortgage Closing Costs are high (Upfront MIP is 2%, plus origination and 3rd party)
    const upfrontMIP = effectiveValue * 0.02;
    const estimatedOtherCosts = 5500;
    const totalClosingCosts = upfrontMIP + estimatedOtherCosts;

    const netCash = Math.max(0, grossPL - totalClosingCosts - currentBalance);

    setResults({
      grossPrincipalLimit: grossPL,
      closingCosts: totalClosingCosts,
      payoffAmount: currentBalance,
      netCashAvailable: netCash,
      ltv: (grossPL / homeValue) * 100,
      isEligible: true
    });
  }, [age, homeValue, currentBalance, expectedRate]);

  const chartData = [
    { name: 'Existing Mortgage Payoff', value: results.payoffAmount, color: '#94a3b8' },
    { name: 'Closing Costs & Fees', value: results.closingCosts, color: '#f59e0b' },
    { name: 'Cash to You', value: results.netCashAvailable, color: '#10b981' },
    { name: 'Remaining Equity', value: Math.max(0, homeValue - results.grossPrincipalLimit), color: '#e2e8f0' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-1">Reverse Mortgage (HECM) Estimator</h2>
          <p className="text-slate-500 text-sm">Convert a portion of your home equity into tax-free cash while staying in your home.</p>
        </div>

        {!results.isEligible && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex gap-3 items-start">
             <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             <div>
               <p className="text-sm font-bold text-rose-800">Ineligible: Age Requirement</p>
               <p className="text-xs text-rose-700">The youngest borrower must be at least 62 years old to qualify for a HUD-insured Reverse Mortgage.</p>
             </div>
          </div>
        )}

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Youngest Borrower Age</label>
              <input 
                type="number" 
                value={age} 
                onChange={(e) => setAge(Number(e.target.value))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 ${age < 62 ? 'bg-rose-50 border-rose-300' : 'bg-white border-slate-200 shadow-sm'}`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expected Interest Rate (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={expectedRate} 
                onChange={(e) => setExpectedRate(Number(e.target.value))}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estimated Home Value ($)</label>
              <input 
                type="number" 
                value={homeValue} 
                onChange={(e) => setHomeValue(Number(e.target.value))}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Balance to Payoff ($)</label>
              <input 
                type="number" 
                value={currentBalance} 
                onChange={(e) => setCurrentBalance(Number(e.target.value))}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 shadow-sm"
              />
            </div>
          </div>
        </div>

        <FinancialInsights 
          type="reverse-mortgage" 
          data={{ ...results, age, homeValue, currentBalance, expectedRate }} 
        />
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col items-center">
          <div className="w-full flex justify-between items-start mb-6">
            <div>
               <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Net Cash to Borrower</span>
               <div className="text-4xl font-black text-emerald-400">
                 ${results.netCashAvailable.toLocaleString(undefined, { maximumFractionDigits: 0 })}
               </div>
            </div>
            <div className="text-right">
               <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Principal Limit</span>
               <div className="text-xl font-bold">
                 ${results.grossPrincipalLimit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
               </div>
            </div>
          </div>

          <div className="w-full h-64 relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={chartData}
                   innerRadius={65}
                   outerRadius={90}
                   paddingAngle={4}
                   dataKey="value"
                   animationDuration={1000}
                   stroke="none"
                 >
                   {chartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
                 />
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Limit Factor</span>
                <span className="text-2xl font-black">{((results.grossPrincipalLimit / homeValue) * 100).toFixed(0)}%</span>
             </div>
          </div>

          <div className="w-full grid grid-cols-3 gap-2 mt-4">
             <div className="text-center">
               <div className="w-2 h-2 rounded-full bg-slate-500 mx-auto mb-1"></div>
               <div className="text-[9px] text-slate-400 font-bold uppercase">Payoff</div>
             </div>
             <div className="text-center">
               <div className="w-2 h-2 rounded-full bg-amber-500 mx-auto mb-1"></div>
               <div className="text-[9px] text-slate-400 font-bold uppercase">Costs</div>
             </div>
             <div className="text-center">
               <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto mb-1"></div>
               <div className="text-[9px] text-slate-400 font-bold uppercase">Net Cash</div>
             </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
           <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
             <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             How it Works
           </h4>
           <p className="text-xs text-slate-500 leading-relaxed">
             A reverse mortgage requires you to pay off your existing home loan first. The remaining funds are available to you as a lump sum, monthly payments, or a line of credit. 
             <span className="block mt-2 font-semibold text-slate-700">No monthly mortgage payments are required as long as you live in the home, pay taxes, and maintain insurance.</span>
           </p>
           <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Estimated Equity Remaining</span>
              <span className="text-slate-800 font-bold">${(homeValue - results.grossPrincipalLimit).toLocaleString()}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReverseMortgageCalculator;
