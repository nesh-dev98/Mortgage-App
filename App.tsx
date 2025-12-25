
import React, { useState } from 'react';
import { CalculatorTab } from './types';
import TabNavigation from './components/TabNavigation';
import PurchaseCalculator from './components/calculators/PurchaseCalculator';
import RefinanceCalculator from './components/calculators/RefinanceCalculator';
import ReverseMortgageCalculator from './components/calculators/ReverseMortgageCalculator';
import RentVsBuyCalculator from './components/calculators/RentVsBuyCalculator';
import RateBuydownCalculator from './components/calculators/RateBuydownCalculator';
import CashOutCalculator from './components/calculators/CashOutCalculator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>(CalculatorTab.PURCHASE);

  const renderContent = () => {
    switch (activeTab) {
      case CalculatorTab.PURCHASE:
        return <PurchaseCalculator />;
      case CalculatorTab.REFINANCE:
        return <RefinanceCalculator />;
      case CalculatorTab.REVERSE:
        return <ReverseMortgageCalculator />;
      case CalculatorTab.RENT_VS_BUY:
        return <RentVsBuyCalculator />;
      case CalculatorTab.BUYDOWN:
        return <RateBuydownCalculator />;
      case CalculatorTab.CASH_OUT:
        return <CashOutCalculator />;
      default:
        return <PurchaseCalculator />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-6xl mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Mortgage Calculator Suite</h1>
        <p className="text-slate-500 mt-2">Comprehensive financial planning tools for home ownership and equity management.</p>
      </header>

      <main className="w-full max-w-6xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="p-6 md:p-10 transition-all duration-300">
          {renderContent()}
        </div>
      </main>

      <footer className="w-full max-w-6xl mt-12 text-center text-slate-400 text-sm pb-8">
        <p>© 2024 Financial Planning Suite. All calculations are estimates for informational purposes only.</p>
      </footer>
    </div>
  );
};

export default App;
