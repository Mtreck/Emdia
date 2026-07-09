import React, { useState } from 'react';
import { Check, CreditCard, Calendar, Trash2, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import Modal from '../components/Modal';
import CategoryForm from '../components/forms/CategoryForm';
import AccountForm from '../components/forms/AccountForm';

export default function GastosView({ data, toggleAccountPaidStatus, deleteAccount, updateCategory, deleteCategory, updateAccount }) {
  const [payingAccount, setPayingAccount] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  
  // Define current month key: "2026-06"
  let currentMonthKey = data.activeMonthKey;
  if (!currentMonthKey) {
    const now = new Date();
    currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  // Helper to know if an account is paid this month
  const isPaid = (acc) => !!(acc.paidMonths && acc.paidMonths[currentMonthKey]);

  // Calculations
  const pendingAccounts = (data.accounts || []).filter(acc => !isPaid(acc));
  const totalPending = pendingAccounts.reduce((sum, acc) => sum + acc.amount, 0);

  // Group accounts by category
  const regularCategories = (data.categories || []).filter(c => c.id !== 'cat-default');
  const defaultCategory = (data.categories || []).find(c => c.id === 'cat-default');

  const categoriesWithAccounts = regularCategories.map(cat => ({
    ...cat,
    accounts: (data.accounts || []).filter(acc => acc.categoryId === cat.id)
  }));

  if (defaultCategory) {
    const extraExpensesThisMonth = (data.expenses || []).filter(exp =>
      (exp.month || exp.createdAt?.substring(0, 7)) === currentMonthKey
    );
    categoriesWithAccounts.push({
      ...defaultCategory,
      isDefault: true,
      accounts: extraExpensesThisMonth
    });
  }

  const handlePayClick = (acc) => {
    if (isPaid(acc)) {
      // If already paid, toggle unpaid immediately
      toggleAccountPaidStatus(acc.id, currentMonthKey);
    } else if (data.incomeSources && data.incomeSources.length > 1) {
      // Prompt user to select which bank to pay from
      setPayingAccount(acc);
    } else {
      // Pay with default bank source
      toggleAccountPaidStatus(acc.id, currentMonthKey, data.incomeSources?.[0]?.id || 'source-default');
    }
  };

  const handleDeleteClick = (acc, e) => {
    e.stopPropagation();
    if (window.confirm(`Deseja realmente apagar a conta "${acc.name}"?`)) {
      deleteAccount(acc.id);
    }
  };

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
      {categoriesWithAccounts.map(cat => {
        const isExpanded = expandedCategories[cat.id] !== false;
        
        return (
        <section key={cat.id} className="flex-col gap-sm">
          <div 
            className="flex-row justify-between" 
            style={{ borderBottom: `1px solid ${cat.color}40`, paddingBottom: '8px', cursor: 'pointer', alignItems: 'center' }}
            onClick={() => setExpandedCategories(prev => ({ ...prev, [cat.id]: !isExpanded }))}
          >
            <div className="flex-row gap-sm" style={{ alignItems: 'center' }}>
              <h2 className="h3" style={{ color: cat.color, borderBottom: 'none', paddingBottom: 0 }}>
                {cat.name}
              </h2>
              {!cat.isDefault && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setEditingCategory(cat); }}
                  style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: 0.5 }}
                  title="Editar Categoria"
                >
                  <Pencil size={16} color={cat.color} />
                </button>
              )}
            </div>
            {isExpanded ? <ChevronUp style={{ color: cat.color }} /> : <ChevronDown style={{ color: cat.color }} />}
          </div>
          
          {isExpanded && (
          <div className="flex-col gap-md mt-sm">
            {cat.accounts.map(acc => {
              const isExtra = acc.id && acc.id.startsWith('exp-');
              const paid = isExtra ? true : isPaid(acc);
              
              return (
                <div key={acc.id} className="glass flex-col gap-sm" style={{ padding: '16px' }}>
                  <div className="flex-row justify-between" style={{ alignItems: 'center' }}>
                    <div className="flex-row gap-sm" style={{ alignItems: 'center' }}>
                      <span className="body-text" style={{ fontWeight: '600' }}>{acc.name}</span>
                      {!isExtra && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingAccount(acc); }}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: 0.5,
                            transition: 'opacity 0.2s',
                          }}
                          title="Editar Conta"
                        >
                          <Pencil size={16} color="var(--text-primary)" />
                        </button>
                      )}
                    </div>
                    <span style={{ 
                      fontWeight: '600', 
                      color: paid ? 'var(--text-secondary)' : 'var(--text-primary)',
                      textDecoration: paid && !isExtra ? 'line-through' : 'none'
                    }}>
                      R$ {acc.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="flex-row justify-between" style={{ alignItems: 'center', marginTop: '4px' }}>
                    <div className="flex-row gap-sm small-text" style={{ alignItems: 'center', opacity: paid ? 0.5 : 1 }}>
                      {acc.type === 'recorrente' ? (
                        <><Calendar size={14} /> Dia {acc.dueDay} (Útil)</>
                      ) : acc.type === 'parcelada' ? (
                        <><CreditCard size={14} /> Parcela {acc.installments.current}/{acc.installments.total}</>
                      ) : (
                        <><Calendar size={14} /> {acc.createdAt ? new Date(acc.createdAt).toLocaleDateString('pt-BR') : 'Extra'}</>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => !isExtra && handlePayClick(acc)}
                      style={{
                        ...styles.payBtn,
                        backgroundColor: paid ? 'var(--accent-neon-green-dim)' : 'var(--danger-red)',
                        color: paid ? 'var(--accent-neon-green)' : '#fff',
                        border: paid ? '1px solid var(--accent-neon-green)' : '1px solid var(--danger-red)',
                        cursor: isExtra ? 'default' : 'pointer'
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
            {cat.accounts.length === 0 && (
              <span className="small-text" style={{ opacity: 0.5, marginTop: '8px' }}>Nenhuma conta nesta categoria.</span>
            )}
          </div>
          )}
        </section>
        );
      })}

      {categoriesWithAccounts.length === 0 && (
        <div className="flex-col" style={{ alignItems: 'center', opacity: 0.5, marginTop: '40px' }}>
          <span className="body-text">Nenhuma categoria cadastrada ainda.</span>
        </div>
      )}

      {/* Payment Bank Picker Modal */}
      {payingAccount && (
        <Modal 
          isOpen={!!payingAccount} 
          onClose={() => setPayingAccount(null)} 
          title="Selecione o Banco"
        >
          <div className="flex-col gap-md" style={{ padding: '4px 0' }}>
            <p className="small-text">De qual conta deseja deduzir o valor de <strong style={{ color: '#fff' }}>{payingAccount.name}</strong>?</p>
            <div className="flex-col gap-sm" style={{ marginTop: '12px' }}>
              {(data.incomeSources || []).map(src => {
                // Calculate bank available balance
                const billsPaid = (data.accounts || []).filter(a => {
                  const paidVal = a.paidMonths && a.paidMonths[currentMonthKey];
                  if (src.id === 'source-default') {
                    return paidVal === true || paidVal === 'source-default';
                  }
                  return paidVal === src.id;
                });
                
                const extraPaid = (data.expenses || []).filter(e => {
                  const isCurrentMonth = (e.month || e.createdAt?.substring(0, 7)) === currentMonthKey;
                  if (!isCurrentMonth) return false;
                  if (src.id === 'source-default') {
                    return !e.sourceId || e.sourceId === 'source-default';
                  }
                  return e.sourceId === src.id;
                });

                const spent = billsPaid.reduce((sum, a) => sum + a.amount, 0) +
                              extraPaid.reduce((sum, e) => sum + e.amount, 0);
                
                const incomingTransfers = (data.transfers || []).filter(t => t.toId === src.id && t.month === currentMonthKey).reduce((s, t) => s + t.amount, 0);
                const outgoingTransfers = (data.transfers || []).filter(t => t.fromId === src.id && t.month === currentMonthKey).reduce((s, t) => s + t.amount, 0);
                
                const currentAvailable = src.balance + incomingTransfers - outgoingTransfers - spent;

                return (
                  <button
                    key={src.id}
                    onClick={() => {
                      toggleAccountPaidStatus(payingAccount.id, currentMonthKey, src.id);
                      setPayingAccount(null);
                    }}
                    style={styles.bankSelectBtn}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: src.color || '#A0A0A0'
                      }} />
                      <span style={{ fontWeight: '600' }}>{src.name}</span>
                    </div>
                    <span style={{ color: currentAvailable < 0 ? 'var(--danger-red)' : 'var(--accent-neon-green)', fontWeight: '600' }}>
                      R$ {currentAvailable.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <Modal 
          isOpen={!!editingCategory} 
          onClose={() => setEditingCategory(null)} 
          title="Editar Categoria"
        >
          <CategoryForm 
            initialName={editingCategory.name}
            initialColor={editingCategory.color}
            submitLabel="Salvar Categoria"
            onSubmit={(name, color) => {
              updateCategory(editingCategory.id, name, color);
              setEditingCategory(null);
            }}
            onDelete={() => {
              if (window.confirm('Atenção: Ao excluir a categoria, todas as contas vinculadas a ela também serão excluídas. Deseja realmente excluir?')) {
                deleteCategory(editingCategory.id);
                setEditingCategory(null);
              }
            }}
          />
        </Modal>
      )}

      {/* Edit Account Modal */}
      {editingAccount && (
        <Modal 
          isOpen={!!editingAccount} 
          onClose={() => setEditingAccount(null)} 
          title="Editar Conta"
        >
          <AccountForm 
            categories={data.categories}
            initialData={editingAccount}
            submitLabel="Salvar Conta"
            onSubmit={(accountData) => {
              updateAccount(editingAccount.id, accountData);
              setEditingAccount(null);
            }}
            onDelete={() => {
              if (window.confirm(`Deseja realmente apagar a conta "${editingAccount.name}"?`)) {
                deleteAccount(editingAccount.id);
                setEditingAccount(null);
              }
            }}
          />
        </Modal>
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
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer'
  },
  bankSelectBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'var(--surface-color-light)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    fontSize: '15px'
  }
};
