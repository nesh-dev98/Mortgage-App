
import React, { useState, useEffect } from 'react';
import { getFinancialInsight } from '../services/geminiService';

interface FinancialInsightsProps {
  type: string;
  data: any;
}

const FinancialInsights: React.FC<FinancialInsightsProps> = ({ type, data }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      const text = await getFinancialInsight(type, data);
      setInsight(text || null);
      setLoading(false);
    };

    const timer = setTimeout(() => {
        fetchInsight();
    }, 1000); // Debounce AI requests

    return () => clearTimeout(timer);
  }, [type, data.homePrice, data.downPayment, data.interestRate]);

  return (
    <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide">AI Advisor Insights</h4>
      </div>
      
      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-blue-100 rounded w-3/4"></div>
          <div className="h-4 bg-blue-100 rounded w-full"></div>
          <div className="h-4 bg-blue-100 rounded w-5/6"></div>
        </div>
      ) : (
        <div className="text-sm text-blue-800 leading-relaxed whitespace-pre-line">
          {insight || "Enter your information to see personalized mortgage strategies."}
        </div>
      )}
    </div>
  );
};

export default FinancialInsights;
