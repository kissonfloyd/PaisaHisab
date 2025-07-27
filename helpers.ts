import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatCurrency = (amount: number): string => {
  return `रू ${amount.toLocaleString('en-IN')}`;
};

export const formatDate = (date: string): string => {
  return format(new Date(date), 'dd/MM/yyyy');
};

export const formatDateNepali = (date: string): string => {
  const d = new Date(date);
  const nepaliMonths = [
    'जनवरी', 'फेब्रुअरी', 'मार्च', 'अप्रिल', 'मे', 'जुन',
    'जुलाई', 'अगस्त', 'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर'
  ];
  
  return `${d.getDate()} ${nepaliMonths[d.getMonth()]} ${d.getFullYear()}`;
};

export const getDateRange = (range: 'week' | 'month' | 'last7' | 'last30') => {
  const today = new Date();
  
  switch (range) {
    case 'week':
      return {
        start: startOfWeek(today, { weekStartsOn: 1 }), // Monday start
        end: endOfWeek(today, { weekStartsOn: 1 }),
      };
    case 'month':
      return {
        start: startOfMonth(today),
        end: endOfMonth(today),
      };
    case 'last7':
      return {
        start: subDays(today, 6),
        end: today,
      };
    case 'last30':
      return {
        start: subDays(today, 29),
        end: today,
      };
    default:
      return {
        start: startOfMonth(today),
        end: endOfMonth(today),
      };
  }
};

export const groupExpensesByCategory = (expenses: any[]) => {
  const grouped = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {});

  return Object.entries(grouped).map(([category, amount]) => ({
    category,
    amount: amount as number,
  }));
};

export const groupExpensesByDate = (expenses: any[]) => {
  const grouped = expenses.reduce((acc, expense) => {
    const date = expense.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += expense.amount;
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([date, amount]) => ({
      date,
      amount: amount as number,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};