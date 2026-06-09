import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const initialData = {
  userName: 'Nome',
  grossBalance: 0,
  categories: [
    { id: 'cat-default', name: 'Saídas Extras', color: 'var(--danger-red)' }
  ],
  accounts: [], // { id, name, categoryId, type: 'recorrente'|'parcelada', amount, dueDay, installments: { total, current }, paidMonths: { 'YYYY-MM': true } }
  expenses: [] // { id, name, amount, date }
};

export function useFinanceData() {
  const { currentUser } = useAuth();
  const STORAGE_KEY = currentUser ? `@emdia_data_${currentUser.uid}` : '@emdia_data';

  const [data, setData] = useState(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setData({ ...initialData, ...parsed, accounts: parsed.accounts || [], expenses: parsed.expenses || [] });
    } else {
      setData(initialData);
    }
    setIsLoaded(true);
  }, [STORAGE_KEY]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, STORAGE_KEY, isLoaded]);

  const addCategory = (name, color) => {
    const newCat = { id: `cat-${Date.now()}`, name, color };
    setData(prev => ({
      ...prev,
      categories: [...(prev.categories || []), newCat]
    }));
  };

  const addAccount = (account) => {
    const newAccount = {
      id: `acc-${Date.now()}`,
      paidMonths: {}, // Keeps track of which months this account was paid
      createdAt: new Date().toISOString(),
      ...account
    };
    setData(prev => ({
      ...prev,
      accounts: [...(prev.accounts || []), newAccount]
    }));
  };

  const addExtraExpense = (expense) => {
    const newExpense = {
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...expense
    };
    setData(prev => ({
      ...prev,
      expenses: [...(prev.expenses || []), newExpense]
    }));
  };

  const updateUserName = (name) => {
    setData(prev => ({ ...prev, userName: name }));
  };

  const updateBalance = (balance) => {
    setData(prev => ({ ...prev, grossBalance: balance }));
  };

  // Helper to mark an account as paid for a specific month (e.g., '2026-06')
  const toggleAccountPaidStatus = (accountId, monthKey) => {
    setData(prev => ({
      ...prev,
      accounts: (prev.accounts || []).map(acc => {
        if (acc.id === accountId) {
          const isPaid = !!acc.paidMonths[monthKey];
          return {
            ...acc,
            paidMonths: {
              ...acc.paidMonths,
              [monthKey]: !isPaid
            }
          };
        }
        return acc;
      })
    }));
  };

  return {
    data,
    addCategory,
    addAccount,
    addExtraExpense,
    updateUserName,
    updateBalance,
    toggleAccountPaidStatus
  };
}
