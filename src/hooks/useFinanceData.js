import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const initialData = {
  userName: 'Nome',
  grossBalance: 0,
  incomeSources: [
    { id: 'source-default', name: 'Saldo Geral', balance: 0, color: '#39FF14' }
  ],
  categories: [
    { id: 'cat-default', name: 'Saídas Extras', color: 'var(--danger-red)' }
  ],
  accounts: [], // { id, name, categoryId, type: 'recorrente'|'parcelada', amount, dueDay, installments: { total, current }, paidMonths: { 'YYYY-MM': sourceId } }
  expenses: [], // { id, name, amount, date, sourceId }
  transfers: [] // { id, fromId, toId, amount, date, month }
};

export function useFinanceData() {
  const { currentUser } = useAuth();
  const STORAGE_KEY = currentUser ? `@emdia_data_${currentUser.uid}` : '@emdia_data';

  const [data, setData] = useState(initialData);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastLoadedKeyRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      let migratedSources = parsed.incomeSources || [];
      if (migratedSources.length === 0) {
        const fallbackBalance = parsed.grossBalance || currentUser?.profile?.grossBalance || 0;
        migratedSources = [
          { id: 'source-default', name: 'Saldo Geral', balance: fallbackBalance, color: '#39FF14' }
        ];
      }
      setData({ 
        ...initialData, 
        ...parsed, 
        incomeSources: migratedSources,
        accounts: parsed.accounts || [], 
        expenses: parsed.expenses || [],
        transfers: parsed.transfers || []
      });
    } else {
      const defaultBalance = currentUser?.profile?.grossBalance || 0;
      setData({
        ...initialData,
        grossBalance: defaultBalance,
        incomeSources: [
          { id: 'source-default', name: 'Saldo Geral', balance: defaultBalance, color: '#39FF14' }
        ]
      });
    }
    lastLoadedKeyRef.current = STORAGE_KEY;
    setIsLoaded(true);
  }, [STORAGE_KEY, currentUser]);

  useEffect(() => {
    if (isLoaded && lastLoadedKeyRef.current === STORAGE_KEY) {
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

  const updateCategory = (id, name, color) => {
    setData(prev => ({
      ...prev,
      categories: (prev.categories || []).map(cat => cat.id === id ? { ...cat, name, color } : cat)
    }));
  };

  const deleteCategory = (id) => {
    setData(prev => ({
      ...prev,
      categories: (prev.categories || []).filter(cat => cat.id !== id),
      accounts: (prev.accounts || []).filter(acc => acc.categoryId !== id)
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

  const updateAccount = (id, updatedData) => {
    setData(prev => ({
      ...prev,
      accounts: (prev.accounts || []).map(acc => acc.id === id ? { ...acc, ...updatedData } : acc)
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

  const addTransfer = (fromId, toId, amount) => {
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const newTransfer = {
      id: `trans-${Date.now()}`,
      fromId,
      toId,
      amount: Number(amount),
      date: now.toISOString(),
      month: currentMonthKey
    };
    setData(prev => ({
      ...prev,
      transfers: [...(prev.transfers || []), newTransfer]
    }));
  };

  const updateUserName = (name) => {
    setData(prev => ({ ...prev, userName: name }));
  };

  const updateBalance = (balance) => {
    setData(prev => ({ 
      ...prev, 
      grossBalance: balance,
      incomeSources: prev.incomeSources.map(s => s.id === 'source-default' ? { ...s, balance } : s)
    }));
  };

  const updateIncomeSources = (sources) => {
    const totalBalance = sources.reduce((sum, s) => sum + Number(s.balance || 0), 0);
    setData(prev => ({
      ...prev,
      incomeSources: sources,
      grossBalance: totalBalance
    }));
  };

  // Helper to mark an account as paid for a specific month (e.g., '2026-06')
  const toggleAccountPaidStatus = (accountId, monthKey, sourceId) => {
    setData(prev => ({
      ...prev,
      accounts: (prev.accounts || []).map(acc => {
        if (acc.id === accountId) {
          const paidMonths = { ...acc.paidMonths };
          if (paidMonths[monthKey]) {
            // Unpay
            delete paidMonths[monthKey];
          } else {
            // Pay and assign source
            paidMonths[monthKey] = sourceId || 'source-default';
          }
          return {
            ...acc,
            paidMonths
          };
        }
        return acc;
      })
    }));
  };

  const deleteAccount = (accountId) => {
    setData(prev => ({
      ...prev,
      accounts: (prev.accounts || []).filter(acc => acc.id !== accountId)
    }));
  };

  return {
    data,
    addCategory,
    updateCategory,
    deleteCategory,
    addAccount,
    updateAccount,
    addExtraExpense,
    addTransfer,
    updateUserName,
    updateBalance,
    updateIncomeSources,
    toggleAccountPaidStatus,
    deleteAccount
  };
}
