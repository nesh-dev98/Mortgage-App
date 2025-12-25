
// Fix: Import React to resolve 'React' namespace issues for React.ReactNode
import React from 'react';

export enum CalculatorTab {
  PURCHASE = 'purchase',
  REFINANCE = 'refinance',
  REVERSE = 'reverse',
  RENT_VS_BUY = 'rent-vs-buy',
  BUYDOWN = 'buydown',
  CASH_OUT = 'cash-out'
}

export interface TabConfig {
  id: CalculatorTab;
  label: string;
  // Fix: Reference to React.ReactNode requires React to be imported
  icon: React.ReactNode;
}

export interface CalculationResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  amortization: Array<{
    month: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}
