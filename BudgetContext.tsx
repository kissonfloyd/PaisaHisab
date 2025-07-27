import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Budget, Expense } from '../types';
import { generateId } from '../utils/helpers';

interface BudgetContextType {
  budgets: Budget[];
  expenses: Expense[];
  currentBudget: Budget | null;
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt'>) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  setCurrentBudget: (budget: Budget | null) => void;
  loading: boolean;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

interface BudgetProviderProps {
  children: React.ReactNode;
}

export const BudgetProvider: React.FC<BudgetProviderProps> = ({ children }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [budgetsData, expensesData] = await Promise.all([
        AsyncStorage.getItem('budgets'),
        AsyncStorage.getItem('expenses'),
      ]);

      if (budgetsData) {
        const parsedBudgets = JSON.parse(budgetsData);
        setBudgets(parsedBudgets);
        if (parsedBudgets.length > 0 && !currentBudget) {
          setCurrentBudget(parsedBudgets[0]);
        }
      }

      if (expensesData) {
        setExpenses(JSON.parse(expensesData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveBudgets = async (newBudgets: Budget[]) => {
    try {
      await AsyncStorage.setItem('budgets', JSON.stringify(newBudgets));
      setBudgets(newBudgets);
    } catch (error) {
      console.error('Error saving budgets:', error);
    }
  };

  const saveExpenses = async (newExpenses: Expense[]) => {
    try {
      await AsyncStorage.setItem('expenses', JSON.stringify(newExpenses));
      setExpenses(newExpenses);
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  };

  const addBudget = async (budgetData: Omit<Budget, 'id' | 'createdAt'>) => {
    const newBudget: Budget = {
      ...budgetData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    const newBudgets = [...budgets, newBudget];
    await saveBudgets(newBudgets);

    if (budgets.length === 0) {
      setCurrentBudget(newBudget);
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    const newExpenses = [...expenses, newExpense];
    await saveExpenses(newExpenses);
  };

  const deleteExpense = async (id: string) => {
    const newExpenses = expenses.filter(expense => expense.id !== id);
    await saveExpenses(newExpenses);
  };

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        expenses,
        currentBudget,
        addBudget,
        addExpense,
        deleteExpense,
        setCurrentBudget,
        loading,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};