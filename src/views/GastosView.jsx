import React from 'react';
import { useFinanceData } from '../hooks/useFinanceData';
import { Check, CreditCard, Calendar } from 'lucide-react';

export default function GastosView() {
  const { data, toggleAccountPaidStatus } = useFinanceData();
  
  // Define current month key: "2026-06"
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Helper to know if an account is paid this month
  const isPaid = (acc) => !!(acc.paidMonths && acc.paidMonths[currentMonthKey]);

  // Calculations
  const pendingAccounts = (data.accounts || []).filter(acc => !isPaid(acc));
  const totalPending = pendingAccounts.reduce((sum, acc) => sum + acc.amount, 0);

  // Group accounts by category
  const categoriesWithAccounts = (data.categories || []).map(cat => {
    return {
      ...cat,
      accounts: (data.accounts || []).filter(acc => acc.categoryId === cat.id)
    };
  }).filter(cat => cat.accounts.length > 0);

  return (
    <div className="animate-fade-in flex-col gap-lg" style={{ paddingBottom: '20px', paddingTop: '16px' }}>
      {/* Header Widget */}
      <div className="glass" style={styles.summaryCard}>
        <div className="flex-col gap-sm">
          <span className="small-text">Contas a pagar este mês</span>
          <div className="flex-row justify-between" style={{ alignItems: 'flex-end' }}>
            <h1 className="h1" style={{ fontSize: '2.5rem' }}>{pendingAccounts.length}</h1>
            <span className="h2 text-red">R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* List by Category */}
      {categoriesWithAccounts.map(cat => (
        <section key={cat.id} className="flex-col gap-sm">
          <h2 className="h3" style={{ color: cat.color, borderBottom: `1px solid ${cat.color}40`, paddingBottom: '8px' }}>
            {cat.name}
          </h2>
          
          <div className="flex-col gap-md mt-sm">
            {cat.accounts.map(acc => {
              const paid = isPaid(acc);
              
              return (
                <div key={acc.id} className="glass flex-col gap-sm" style={{ padding: '16px' }}>
                  <div className="flex-row justify-between">
                    <span className="body-text" style={{ fontWeight: '600' }}>{acc.name}</span>
                    <span style={{ 
                      fontWeight: '600', 
                      color: paid ? 'var(--text-secondary)' : 'var(--text-primary)',
                      textDecoration: paid ? 'line-through' : 'none'
                    }}>
                      R$ {acc.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="flex-row justify-between" style={{ alignItems: 'center', marginTop: '4px' }}>
                    <div className="flex-row gap-sm small-text" style={{ alignItems: 'center', opacity: paid ? 0.5 : 1 }}>
                      {acc.type === 'recorrente' ? (
                        <><Calendar size={14} /> Dia {acc.dueDay} (Útil)</>
                      ) : (
                        <><CreditCard size={14} /> Parcela {acc.installments.current}/{acc.installments.total}</>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => toggleAccountPaidStatus(acc.id, currentMonthKey)}
                      style={{
                        ...styles.payBtn,
                        backgroundColor: paid ? 'var(--accent-neon-green-dim)' : 'var(--danger-red)',
                        color: paid ? 'var(--accent-neon-green)' : '#fff',
                        border: paid ? '1px solid var(--accent-neon-green)' : '1px solid var(--danger-red)'
                      }}
                    >
                      {paid ? (
                        <><Check size={16} /> Pago</>
                      ) : (
                        'Pagar'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {categoriesWithAccounts.length === 0 && (
        <div className="flex-col" style={{ alignItems: 'center', opacity: 0.5, marginTop: '40px' }}>
          <span className="body-text">Nenhuma conta cadastrada ainda.</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  summaryCard: {
    padding: '20px',
    border: '1px solid rgba(255, 51, 102, 0.3)', // Slight red border for urgency
  },
  payBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 16px',
    borderRadius: 'var(--radius-full)',
    fontWeight: '600',
    fontSize: '12px',
    transition: 'all 0.3s ease'
  }
};
