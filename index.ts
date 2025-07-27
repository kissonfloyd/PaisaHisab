export interface Budget {
  id: string;
  name: string;
  amount: number;
  createdAt: string;
}

export interface Expense {
  id: string;
  budgetId: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  createdAt: string;
  receiptPhoto?: string; // Base64 encoded image or file path
}

export type ExpenseCategory = 
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'bills'
  | 'other';

export const ExpenseCategories: Record<ExpenseCategory, string> = {
  food: 'भोजन र खानपान',
  transport: 'यातायात',
  entertainment: 'मनोरञ्जन',
  shopping: 'किनमेल',
  bills: 'बिल र सुविधाहरू',
  other: 'अन्य',
};

export interface AdState {
  isPremium: boolean;
  expenseCount: number;
  showInterstitial: boolean;
}

export interface ChartData {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}