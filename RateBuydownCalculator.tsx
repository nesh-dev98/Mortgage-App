
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import FinancialInsights from '../FinancialInsights';

type BuydownType = '2-1-temporary' | '1-0-temporary' | 'permanent';

const RateBuydownCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState(400000);
  const [baseRate, setBaseRate] = useState(7.0);
  const [term, setTerm] = useState(30);
  const [buydownType, setBuydownType] = useState<BuydownType>('2-1-temporary');
  const [points, setPoints] = useState(1); // For permanent buydown

  const [schedule, setSchedule] = useState<any[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  const calculateMonthlyPI = (p: number, r: number, t: number) => {
    const monthlyRate = r / 100 / 12;
    const numPayments = t * 12;
    if (monthlyRate === 0) return p / numPayments;
    return p * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  useEffect(() => {
    let newSchedule = [];
    let calculatedCost = 0;
    const basePI = calculateMonthlyPI(loanAmount, baseRate, term);

    if (buydownType === '2-1-temporary') {
      const year1Rate = baseRate - 2;
      const year2Rate = baseRate - 1;
      const year1PI = calculateMonthlyPI(loanAmount, year1Rate, term);
      const year2PI = calculateMonthlyPI(loanAmount, year2Rate, term);

      newSchedule = [
        { period: 'Year 1', rate: year1Rate, payment: year1PI, savings: (basePI - year1PI) * 12 },
        { period: 'Year 2', rate: year2Rate, payment: year2PI, savings: (basePI - year2PI) * 12 },
        { period: 'Years 3-30', rate: baseRate, payment: basePI, savings: 0 }
      ];
      calculatedCost = (basePI - year1PI) * 12 + (basePI - year2PI) * 12;
    } else if (buydownType === '1-0-temporary') {
      const year1Rate = baseRate - 1;
      const year1PI = calculateMonthlyPI(loanAmount, year1Rate, term);

      newSchedule = [
        { period: 'Year 1', rate: year1Rate, payment: year1PI, savings: (basePI - year1PI) * 12 },
        { period: 'Years 2-30', rate: baseRate, payment: basePI, savings: 0 }
      ];
      calculatedCost = (basePI - year1PI) * 12;
    } else {
      // Permanent: 1 point usually reduces rate by 0.25%
      const reduction = points * 0.25;
      const newRate = Math.max(0, baseRate - reduction);
      const newPI = calculateMonthlyPI(loanAmount, newRate, term);

      newSchedule = [
        { period: 'Entire Term', rate: newRate, payment: newPI, savings: (basePI - newPI) * 12 * term }
      ];
      calculatedCost = (points / 100) * loanAmount;
    }

    setSchedule(newSchedule);
    setTotalCost(calculatedCost);
  }, [loanAmount, baseRate, term, buydownType, points]);

  const chartData = schedule.map(s => ({
    name: s.period,
    payment: s.payment,
    rate: s.rate
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-1">Rate Buydown Analysis</h2>
          <p className="text-slate-500 text-sm">Strategize your interest savings with temporary or permanent rate reductions.</p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Loan Amount ($)</label>
              <input 
                type="number" 
                value={loanAmount} 
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Base Interest Rate (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={baseRate} 
                onChange={(e) => setBaseRate(Number(e.target.value))}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 shadow-sm"
              />
            </div>
          </div>

          <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 shadow-inner">
            <label className="block text-xs font-bold text-blue-600 uppercase mb-3">Select Buydown Strategy</label>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => setBuydownType('2-1-temporary')}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${buydownType === '2-1-temporary' ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-100' : 'bg-transparent border-blue-100 text-slate-600 hover:bg-white'}`}
              >
                <div>
                  <div className="font-bold text-sm">2-1 Temporary Buydown</div>
                  <div className="text-[10px] text-slate-500">2% off Year 1, 1% off Year 2</div>
                </div>
                {buydownType === '2-1-temporary' && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
              </button>
              <button 
                onClick={() => setBuydownType('1-0-temporary')}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${buydownType === '1-0-temporary' ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-100' : 'bg-transparent border-blue-100 text-slate-600 hover:bg-white'}`}
              >
                <div>
                  <div className="font-bold text-sm">1-0 Temporary Buydown</div>
                  <div className="text-[10px] text-slate-500">1% off Year 1</div>
                </div>
                {buydownType === '1-0-temporary' && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
              </button>
              <button 
                onClick={() => setBuydownType('permanent')}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${buydownType === 'permanent' ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-100' : 'bg-transparent border-blue-100 text-slate-600 hover:bg-white'}`}
              >
                <div>
                  <div className="font-bold text-sm">Permanent Discount Points</div>
                  <div className="text-[10px] text-slate-500">Fixed rate reduction for loan life</div>
                </div>
                {buydownType === 'permanent' && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
              </button>
            </div>
          </div>

          {buydownType === 'permanent' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Points to Purchase: <span className="text-blue-600">{points} Point(s)</span></label>
              <input 
                type="range" 
                min="0" 
                max="4" 
                step="0.125"
                value={points} 
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-bold">
                <span>0 POINTS</span>
                <span>EST. -{(points * 0.25).toFixed(3)}% RATE</span>
                <span>4 POINTS</span>
              </div>
            </div>
          )}
        </div>

        <FinancialInsights 
          type="buydown" 
          data={{ ...schedule[0], loanAmount, baseRate, buydownType, totalCost }} 
        />
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block">Upfront Cost / Escrow</span>
              <div className="text-4xl font-black text-white mt-1">
                ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block">Strategy</span>
              <div className="text-sm font-bold text-blue-400 mt-1 uppercase">
                {buydownType.replace('-', ' ').replace('temporary', '')}
              </div>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 'Monthly P&I']}
                />
                <Bar dataKey="payment" radius={[6, 6, 0, 0]} barSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#475569' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Period</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Interest</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Payment</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Annual Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedule.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 font-bold text-slate-800">{item.period}</td>
                  <td className="px-4 py-4 text-blue-600 font-semibold">{item.rate.toFixed(2)}%</td>
                  <td className="px-4 py-4 text-slate-700 font-medium">${item.payment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  <td className="px-4 py-4">
                    {item.savings > 0 ? (
                      <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md text-[11px]">
                        +${item.savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    ) : (
                      <span className="text-slate-400">--</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-slate-50 text-[10px] text-slate-400 italic">
            *Temporary buydowns are usually seller-paid to help buyers qualify or lower initial costs. Permanent buydowns are typically borrower-paid to lower costs over the life of the loan.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateBuydownCalculator;
