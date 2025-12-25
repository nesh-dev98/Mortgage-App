
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import FinancialInsights from '../FinancialInsights';

const RentVsBuyCalculator: React.FC = () => {
  // Inputs
  const [homePrice, setHomePrice] = useState(500000);
  const [monthlyRent, setMonthlyRent] = useState(2800);
  const [appreciation, setAppreciation] = useState(4.0);
  const [rentIncrease, setRentIncrease] = useState(3.0);
  const [duration, setDuration] = useState(15);

  // Constants / Assumptions for a realistic model
  const downPaymentPercent = 0.20;
  const interestRate = 6.5;
  const loanTerm = 30;
  const closingCostsPercent = 0.02; // 2% of home price
  const maintenancePercent = 0.01; // 1% of home value annually
  const propertyTaxPercent = 0.012; // 1.2% of home value annually
  const insurancePercent = 0.003; // 0.3% of home value annually

  const [chartData, setChartData] = useState<any[]>([]);
  const [crossoverYear, setCrossoverYear] = useState<number | null>(null);

  useEffect(() => {
    const data = [];
    const downPayment = homePrice * downPaymentPercent;
    const loanAmount = homePrice - downPayment;
    const closingCosts = homePrice * closingCostsPercent;
    
    // Monthly Mortgage P&I
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);

    let cumulativeRent = 0;
    let currentRent = monthlyRent;
    let cumulativeBuyExpenses = downPayment + closingCosts;
    let foundCrossover = false;
    let crossYear = null;

    for (let year = 0; year <= duration; year++) {
      if (year === 0) {
        data.push({
          year: 0,
          rentCost: 0,
          buyCost: cumulativeBuyExpenses,
        });
        continue;
      }

      // Rent Calculations
      const annualRent = currentRent * 12;
      cumulativeRent += annualRent;
      currentRent *= (1 + rentIncrease / 100);

      // Buy Calculations
      const currentHomeValue = homePrice * Math.pow(1 + appreciation / 100, year);
      
      // Amortization (Remaining Balance)
      const monthsPassed = year * 12;
      const remainingBalance = loanAmount * (Math.pow(1 + monthlyRate, numPayments) - Math.pow(1 + monthlyRate, monthsPassed)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
      
      const annualPI = monthlyPI * 12;
      const annualTaxes = currentHomeValue * propertyTaxPercent;
      const annualInsurance = currentHomeValue * insurancePercent;
      const annualMaintenance = currentHomeValue * maintenancePercent;
      
      cumulativeBuyExpenses += (annualPI + annualTaxes + annualInsurance + annualMaintenance);
      
      const equity = currentHomeValue - remainingBalance;
      const netBuyCost = cumulativeBuyExpenses - equity;

      if (!foundCrossover && netBuyCost < cumulativeRent) {
        foundCrossover = true;
        crossYear = year;
      }

      data.push({
        year,
        rentCost: Math.round(cumulativeRent),
        buyCost: Math.round(netBuyCost),
      });
    }

    setChartData(data);
    setCrossoverYear(crossYear);
  }, [homePrice, monthlyRent, appreciation, rentIncrease, duration]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-1">Rent vs. Buy Analysis</h2>
          <p className="text-slate-500 text-sm">Compare the total financial impact of renting versus buying over time.</p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3 shadow-inner">
              <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Renting</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Monthly Rent ($)</label>
                <input 
                  type="number" 
                  value={monthlyRent} 
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Annual Rent Increase (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={rentIncrease} 
                  onChange={(e) => setRentIncrease(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white"
                />
              </div>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-3 shadow-inner">
              <h3 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Buying</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Home Price ($)</label>
                <input 
                  type="number" 
                  value={homePrice} 
                  onChange={(e) => setHomePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Home Appreciation (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={appreciation} 
                  onChange={(e) => setAppreciation(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 bg-white"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Comparison Duration: <span className="text-blue-600">{duration} Years</span></label>
            </div>
            <input 
              type="range" 
              min="1" 
              max="30" 
              value={duration} 
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <FinancialInsights 
          type="rent-vs-buy" 
          data={{ homePrice, monthlyRent, appreciation, rentIncrease, duration, crossoverYear }} 
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Cumulative Net Cost Comparison</h3>
          {crossoverYear ? (
            <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg text-xs font-medium border border-emerald-100 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Buying becomes more profitable than renting after <span className="font-bold underline">Year {crossoverYear}</span>.
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-700 px-4 py-3 rounded-lg text-xs font-medium border border-amber-100 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Renting remains cheaper over this {duration} year period based on current assumptions.
            </div>
          )}
        </div>

        <div className="flex-1 h-64 md:h-80 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="year" 
                label={{ value: 'Years', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#94a3b8' }} 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${(value / 1000).toLocaleString()}k`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Line 
                type="monotone" 
                name="Total Rent Cost" 
                dataKey="rentCost" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                name="Net Buying Cost (minus equity)" 
                dataKey="buyCost" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
           <div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Net Buying Cost</span>
             <div className="text-xl font-bold text-slate-800">
               ${chartData[chartData.length - 1]?.buyCost.toLocaleString() || 0}
             </div>
           </div>
           <div className="text-right">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Rent Paid</span>
             <div className="text-xl font-bold text-slate-800">
               ${chartData[chartData.length - 1]?.rentCost.toLocaleString() || 0}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RentVsBuyCalculator;
