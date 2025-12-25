
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import FinancialInsights from '../FinancialInsights';

const PurchaseCalculator: React.FC = () => {
  // Inputs
  const [homePrice, setHomePrice] = useState(450000);
  const [downPayment, setDownPayment] = useState(90000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [yearlyTax, setYearlyTax] = useState(5400); // ~1.2% default
  const [yearlyInsurance, setYearlyInsurance] = useState(1200);

  // Results
  const [results, setResults] = useState({
    monthlyPI: 0,
    monthlyTax: 0,
    monthlyInsurance: 0,
    totalMonthly: 0,
    totalInterest: 0,
    totalPayment: 0
  });

  useEffect(() => {
    const principal = Math.max(0, homePrice - downPayment);
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    let monthlyPI = 0;
    if (monthlyRate === 0) {
      monthlyPI = principal / numberOfPayments;
    } else {
      monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }
    
    const monthlyTax = yearlyTax / 12;
    const monthlyInsurance = yearlyInsurance / 12;
    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance;
    
    setResults({
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      totalMonthly,
      totalInterest: (monthlyPI * numberOfPayments) - principal,
      totalPayment: (totalMonthly * numberOfPayments)
    });
  }, [homePrice, downPayment, interestRate, loanTerm, yearlyTax, yearlyInsurance]);

  const downPaymentPercent = ((downPayment / homePrice) * 100).toFixed(1);

  const chartData = [
    { name: 'Principal & Interest', value: results.monthlyPI, color: '#2563eb' },
    { name: 'Property Tax', value: results.monthlyTax, color: '#10b981' },
    { name: 'Home Insurance', value: results.monthlyInsurance, color: '#f59e0b' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-1 text-balance">New Home Purchase</h2>
          <p className="text-slate-500 text-sm">Fine-tune your monthly budget with taxes and insurance included.</p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Home Price ($)</label>
              <input 
                type="number" 
                value={homePrice} 
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Down Payment ($)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={downPayment} 
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 pr-16 shadow-sm"
                />
                <div className="absolute right-3 top-2 text-slate-400 text-xs font-semibold">
                  {downPaymentPercent}%
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Interest Rate (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={interestRate} 
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Loan Term</label>
              <select 
                value={loanTerm} 
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 shadow-sm"
              >
                <option value={30}>30 Years Fixed</option>
                <option value={15}>15 Years Fixed</option>
                <option value={10}>10 Years Fixed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Property Tax (Yearly)</label>
              <input 
                type="number" 
                value={yearlyTax} 
                onChange={(e) => setYearlyTax(Number(e.target.value))}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Insurance (Yearly)</label>
              <input 
                type="number" 
                value={yearlyInsurance} 
                onChange={(e) => setYearlyInsurance(Number(e.target.value))}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 shadow-sm"
              />
            </div>
          </div>
        </div>

        <FinancialInsights 
          type="purchase" 
          data={{ ...results, homePrice, downPayment, interestRate, loanTerm, yearlyTax, yearlyInsurance }} 
        />
      </div>

      <div className="bg-slate-50/50 rounded-2xl p-8 flex flex-col items-center justify-center border border-slate-200 shadow-inner">
        <div className="text-center mb-6">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Monthly Payment</span>
          <div className="text-5xl font-extrabold text-slate-900 mt-2">
            ${results.totalMonthly.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="flex items-center justify-center gap-4 mt-3">
             <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">P&I: ${results.monthlyPI.toFixed(0)}</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Tax: ${results.monthlyTax.toFixed(0)}</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Ins: ${results.monthlyInsurance.toFixed(0)}</span>
             </div>
          </div>
        </div>

        <div className="w-full h-72 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={75}
                outerRadius={105}
                paddingAngle={4}
                dataKey="value"
                animationDuration={800}
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 'Monthly']} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-xs font-bold text-slate-400 uppercase">Principal</span>
             <span className="text-xl font-bold text-slate-800">${(homePrice - downPayment).toLocaleString()}</span>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-4 mt-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Interest</span>
            <div className="text-xl font-bold text-slate-800">${results.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Payoff</span>
            <div className="text-xl font-bold text-slate-800">${results.totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCalculator;
