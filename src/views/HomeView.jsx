import React from 'react';
import { useFinanceData } from '../hooks/useFinanceData';
import { ArrowUpRight, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function HomeView({ onOpenSettings }) {
  const { data } = useFinanceData();
  const { currentUser, logout } = useAuth();
  
  const profileName = currentUser?.profile?.name || data.userName;
  const profileGrossBalance = currentUser?.profile?.grossBalance ?? data.grossBalance;
  
  // Current month key
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Helper
  const isPaid = (acc) => !!(acc.paidMonths && acc.paidMonths[currentMonthKey]);

  // Filters for current month
  const paidAccountsThisMonth = (data.accounts || []).filter(isPaid);
  const extraExpensesThisMonth = (data.expenses || []).filter(exp => 
    exp.createdAt && exp.createdAt.startsWith(currentMonthKey)
  );

  // Calculate Balance
  const totalPaidAccounts = paidAccountsThisMonth.reduce((sum, acc) => sum + acc.amount, 0);
  const totalExtraExpenses = extraExpensesThisMonth.reduce((sum, exp) => sum + exp.amount, 0);
  const totalSpent = totalPaidAccounts + totalExtraExpenses;
  const availableBalance = profileGrossBalance - totalSpent;

  // Calculate Top Category
  const categorySpending = {};
  (data.categories || []).forEach(cat => categorySpending[cat.id] = 0);
  
  paidAccountsThisMonth.forEach(acc => {
    if (categorySpending[acc.categoryId] !== undefined) {
      categorySpending[acc.categoryId] += acc.amount;
    }
  });
  
  categorySpending['cat-default'] = totalExtraExpenses;

  let topCategoryId = null;
  let maxSpent = -1;
  Object.keys(categorySpending).forEach(catId => {
    if (categorySpending[catId] > maxSpent) {
      maxSpent = categorySpending[catId];
      topCategoryId = catId;
    }
  });

  const topCategoryObj = (data.categories || []).find(c => c.id === topCategoryId) || { name: 'Nenhum Gasto', color: 'gray' };
  const topPercentage = totalSpent > 0 ? ((maxSpent / totalSpent) * 100).toFixed(0) : 0;

  // Recent Transactions
  const mappedPaid = paidAccountsThisMonth.map(acc => ({
    id: acc.id, name: acc.name, amount: acc.amount, date: 'Conta Fixa', 
    timestamp: acc.createdAt || ''
  }));
  const mappedExtras = extraExpensesThisMonth.map(exp => ({
    id: exp.id, name: exp.name, amount: exp.amount, date: 'Saída Extra', 
    timestamp: exp.createdAt || ''
  }));

  const recentTransactions = [...mappedPaid, ...mappedExtras]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 5); // Take top 5 recent

  return (
    <div className="animate-fade-in flex-col gap-lg" style={{ paddingBottom: '20px' }}>
      
      {/* Greeting and Balance Card */}
      <header className="flex-col gap-md" style={{ marginTop: '0' }}>
        <div className="flex-row justify-between" style={{ alignItems: 'center' }}>
          <span className="body-text" style={{ fontSize: '18px' }}>
            Olá, <span style={{ fontWeight: '600' }}>{profileName}</span> 👋
          </span>
          <button onClick={logout} style={{ ...styles.settingsBtn, padding: '4px', background: 'none' }} title="Sair">
            <LogOut size={20} color="var(--danger-red)" />
          </button>
        </div>
        
        <div className="glass" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid var(--accent-neon-green)' }}>
          <span className="small-text">Saldo Restante</span>
          <h1 className="h1" style={{ color: availableBalance < 0 ? 'var(--danger-red)' : 'var(--text-primary)', fontSize: '1.75rem' }}>
            R$ {availableBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h1>
        </div>
      </header>

      {/* Chart Section */}
      <section className="flex-col gap-md">
        <h2 className="h3">Maior Gasto (Este Mês)</h2>
        <div className="glass" style={styles.chartCard}>
          <div className="flex-row justify-between" style={{ marginBottom: '16px' }}>
            <span className="body-text" style={{ fontWeight: '500', color: topCategoryObj.color }}>{topCategoryObj.name}</span>
            <span style={{ fontWeight: '600' }}>R$ {maxSpent > 0 ? maxSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00'}</span>
          </div>
          
          <div style={styles.barContainer}>
            <div 
              style={{
                ...styles.barFill, 
                width: `${topPercentage}%`,
                backgroundColor: topCategoryObj.color
              }} 
            />
          </div>
          <span className="small-text" style={{ marginTop: '8px', display: 'block' }}>
            Representa {topPercentage}% dos seus gastos
          </span>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="flex-col gap-md">
        <h2 className="h3">Últimos Gastos (Pagos)</h2>
        <div className="flex-col gap-sm">
          {recentTransactions.map(tx => (
            <div key={tx.id} className="glass flex-row justify-between" style={styles.txCard}>
              <div className="flex-row gap-md">
                <div style={{
                  ...styles.txIcon, 
                  backgroundColor: 'var(--danger-red-dim)',
                  color: 'var(--danger-red)'
                }}>
                  <ArrowUpRight size={20} />
                </div>
                <div className="flex-col">
                  <span className="body-text" style={{ fontWeight: '500' }}>{tx.name}</span>
                  <span className="small-text">{tx.date}</span>
                </div>
              </div>
              <span style={{ fontWeight: '600' }}>
                - R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
          {recentTransactions.length === 0 && (
            <span className="small-text" style={{ textAlign: 'center', opacity: 0.5 }}>
              Nenhum gasto pago neste mês.
            </span>
          )}
        </div>
      </section>
    </div>
  );
}

const styles = {
  settingsBtn: {
    padding: '8px',
    backgroundColor: 'var(--surface-color-light)',
    borderRadius: 'var(--radius-full)',
  },
  chartCard: {
    padding: '20px',
  },
  barContainer: {
    width: '100%',
    height: '12px',
    backgroundColor: 'var(--surface-color)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 'var(--radius-full)',
    transition: 'width 1s ease-out',
  },
  txCard: {
    padding: '16px',
    alignItems: 'center',
  },
  txIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
};
