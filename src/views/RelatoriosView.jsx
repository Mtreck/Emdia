import React, { useState } from 'react';
import { Share2, Download, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export default function RelatoriosView({ data }) {
  const [expandedGroups, setExpandedGroups] = useState({});
  
  // 1. Coletar todos os meses que possuem algum histórico (mais o mês atual)
  const monthKeysSet = new Set();
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  monthKeysSet.add(currentMonthKey);

  (data.accounts || []).forEach(acc => {
    if (acc.paidMonths) {
      Object.keys(acc.paidMonths).forEach(key => monthKeysSet.add(key));
    }
  });

  (data.expenses || []).forEach(exp => {
    if (exp.createdAt) {
      const key = exp.createdAt.substring(0, 7); // Extrai "YYYY-MM"
      monthKeysSet.add(key);
    }
  });

  (data.transfers || []).forEach(trans => {
    if (trans.month) {
      monthKeysSet.add(trans.month);
    }
  });

  // Ordena decrescente (mais novos primeiro)
  const monthKeys = Array.from(monthKeysSet).sort((a, b) => b.localeCompare(a));
  
  // Estado para controlar qual sanfona (mês) está aberta
  const [openMonth, setOpenMonth] = useState(monthKeys[0]);

  const toggleGroup = (monthKey, root) => {
    const stateKey = `${monthKey}-${root}`;
    setExpandedGroups(prev => ({ ...prev, [stateKey]: !prev[stateKey] }));
  };

  const getPrincipalWord = (name) => {
    if (!name) return 'outros';
    const clean = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const words = clean.split(/\s+/);
    const stopwords = ['de', 'do', 'da', 'dos', 'das', 'no', 'na', 'o', 'a', 'um', 'uma', 'para', 'pra', 'pro'];
    const validWords = words.filter(w => !stopwords.includes(w) && w.length > 1);
    return validWords.length > 0 ? validWords[0] : 'outros';
  };

  // Handlers
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async (monthKey, monthName, totalGeral, categoriesWithAccounts, extraExpensesSorted) => {
    let text = `📊 *Relatório EmDia - ${monthName.toUpperCase()}*\n`;
    text += `Total Gasto: R$ ${totalGeral.toFixed(2)}\n\n`;
    
    text += `*CONTAS FIXAS:*\n`;
    categoriesWithAccounts.forEach(cat => {
      text += `[${cat.name}]\n`;
      cat.accounts.forEach(acc => {
        text += `- ${acc.name}: R$ ${acc.amount.toFixed(2)}\n`;
      });
    });

    text += `\n*SAÍDAS EXTRAS:*\n`;
    extraExpensesSorted.forEach(exp => {
      const expDate = exp.createdAt ? new Date(exp.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '';
      text += `- ${expDate ? expDate + ' ' : ''}${exp.name}: R$ ${exp.amount.toFixed(2)}\n`;
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Relatório Financeiro ${monthName}`,
          text: text
        });
      } catch (err) {
        console.error('Erro ao compartilhar', err);
      }
    } else {
      alert("Seu navegador não suporta a função de compartilhar. Use o botão de PDF.");
    }
  };

  const renderMonthReport = (monthKey) => {
    const [year, month] = monthKey.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
    const monthName = dateObj.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    // Filtrar dados DENTRO desse mês específico
    const paidAccounts = (data.accounts || []).filter(acc => !!(acc.paidMonths && acc.paidMonths[monthKey]));
    const extraExpenses = (data.expenses || []).filter(exp => exp.createdAt && exp.createdAt.startsWith(monthKey));

    const totalPaid = paidAccounts.reduce((sum, acc) => sum + acc.amount, 0);
    const totalExtra = extraExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalGeral = totalPaid + totalExtra;

    // Calculate spent per bank for this month
    const bankSpending = (data.incomeSources || []).map(src => {
      const billsPaid = paidAccounts.filter(acc => {
        const paidVal = acc.paidMonths[monthKey];
        if (src.id === 'source-default') {
          return paidVal === true || paidVal === 'source-default';
        }
        return paidVal === src.id;
      });
      
      const extraPaid = extraExpenses.filter(exp => {
        if (src.id === 'source-default') {
          return !exp.sourceId || exp.sourceId === 'source-default';
        }
        return exp.sourceId === src.id;
      });

      const totalSpent = billsPaid.reduce((sum, acc) => sum + acc.amount, 0) +
                         extraPaid.reduce((sum, exp) => sum + exp.amount, 0);
                         
      const incomingTransfers = (data.transfers || []).filter(t => t.toId === src.id && t.month === monthKey).reduce((s, t) => s + t.amount, 0);
      const outgoingTransfers = (data.transfers || []).filter(t => t.fromId === src.id && t.month === monthKey).reduce((s, t) => s + t.amount, 0);
                         
      return {
        ...src,
        totalSpent,
        incomingTransfers,
        outgoingTransfers
      };
    }).filter(b => b.totalSpent > 0 || b.incomingTransfers > 0 || b.outgoingTransfers > 0);

    const monthTransfers = (data.transfers || []).filter(t => t.month === monthKey).map(t => {
      const fromSrc = (data.incomeSources || []).find(s => s.id === t.fromId);
      const toSrc = (data.incomeSources || []).find(s => s.id === t.toId);
      return { ...t, fromName: fromSrc?.name || 'Origem', toName: toSrc?.name || 'Destino' };
    });

    // Agrupamento
    const categoriesWithAccounts = (data.categories || []).map(cat => ({
      ...cat,
      accounts: paidAccounts.filter(acc => acc.categoryId === cat.id)
    })).filter(cat => cat.accounts.length > 0);

    const extraExpensesSorted = [...extraExpenses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
      <div className="animate-fade-in flex-col gap-md mt-sm" style={{ paddingBottom: '20px' }}>
        
        {/* Visão Geral */}
        <div className="glass" style={styles.summaryCard}>
          <div className="flex-row justify-between" style={{ alignItems: 'center' }}>
            <span className="body-text">Total Gasto:</span>
            <span className="h2 text-red">R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          {bankSpending.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
              <span className="small-text" style={{ fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Gastos por Conta/Origem:</span>
              {bankSpending.map(bank => (
                <div key={bank.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: bank.color || '#A0A0A0'
                      }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{bank.name}</span>
                    </div>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Gastos: R$ {bank.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  {(bank.incomingTransfers > 0 || bank.outgoingTransfers > 0) && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', paddingLeft: '14px', opacity: 0.8 }}>
                      {bank.incomingTransfers > 0 ? <span style={{ color: 'var(--accent-neon-green)' }}>+ R$ {bank.incomingTransfers.toLocaleString('pt-BR')} (Recebido)</span> : <span></span>}
                      {bank.outgoingTransfers > 0 ? <span style={{ color: 'var(--danger-red)' }}>- R$ {bank.outgoingTransfers.toLocaleString('pt-BR')} (Enviado)</span> : <span></span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumo Tela (Apenas na Tela) */}
        <div className="glass flex-row justify-between screen-only" style={{ padding: '12px 16px', marginTop: '12px' }}>
          <div className="flex-col">
            <span className="small-text" style={{ color: 'var(--text-secondary)' }}>Contas Fixas</span>
            <span className="body-text" style={{ fontWeight: '600' }}>R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex-col" style={{ textAlign: 'right' }}>
            <span className="small-text" style={{ color: 'var(--text-secondary)' }}>Saídas Extras</span>
            <span className="body-text" style={{ fontWeight: '600' }}>R$ {totalExtra.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Contas Fixas (Apenas Impressão) */}
        <section className="flex-col gap-sm print-only">
          <h2 className="h3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
            <FileText size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
            Contas Pagas
          </h2>
          {categoriesWithAccounts.length === 0 && <span className="small-text">Nenhuma conta paga neste mês.</span>}
          
          {categoriesWithAccounts.map(cat => (
            <div key={cat.id} className="flex-col mt-sm">
              <span style={{ color: cat.color, fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>{cat.name}</span>
              <div className="flex-col gap-xs">
                {cat.accounts.map(acc => (
                  <div key={acc.id} className="flex-row justify-between list-item" style={styles.listItem}>
                    <span className="body-text">{acc.name}</span>
                    <span style={{ fontWeight: '500' }}>R$ {acc.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Saídas Extras (Apenas Impressão) */}
        <section className="flex-col gap-sm mt-md print-only">
          <h2 className="h3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
            ✨ Saídas Extras (Detalhadas)
          </h2>
          {extraExpensesSorted.length === 0 && <span className="small-text">Nenhuma saída extra.</span>}

          <div className="flex-col gap-xs mt-sm">
            {extraExpensesSorted.map(exp => {
              const expDate = exp.createdAt ? new Date(exp.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '';
              return (
                <div key={exp.id} className="flex-row justify-between list-item" style={styles.listItem}>
                  <div className="flex-row gap-sm" style={{ alignItems: 'center' }}>
                    {expDate && <span style={{ color: 'var(--text-secondary)', fontSize: '12px', minWidth: '40px' }}>{expDate}</span>}
                    <span className="body-text">{exp.name}</span>
                  </div>
                  <span style={{ fontWeight: '500' }}>R$ {exp.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Transferências */}
        {monthTransfers.length > 0 && (
          <section className="flex-col gap-sm mt-md">
            <h2 className="h3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
              🔄 Transferências Internas
            </h2>
            <div className="flex-col gap-xs mt-sm">
              {monthTransfers.map(trans => {
                const transDate = trans.date ? new Date(trans.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '';
                return (
                  <div key={trans.id} className="flex-row justify-between list-item" style={styles.listItem}>
                    <div className="flex-row gap-sm" style={{ alignItems: 'center' }}>
                      {transDate && <span style={{ color: 'var(--text-secondary)', fontSize: '12px', minWidth: '40px' }}>{transDate}</span>}
                      <span className="body-text">{trans.fromName} → {trans.toName}</span>
                    </div>
                    <span style={{ fontWeight: '500' }}>R$ {trans.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Ações Visíveis Apenas na Tela */}
        <div className="flex-row gap-md mt-lg print-buttons" style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => handleShare(monthKey, monthName, totalGeral, categoriesWithAccounts, extraExpensesSorted)} style={styles.primaryBtn}>
            <Share2 size={20} /> Compartilhar
          </button>
          <button onClick={handlePrint} style={styles.secondaryBtn}>
            <Download size={20} /> PDF
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in flex-col gap-md" style={{ paddingBottom: '40px', paddingTop: '16px' }}>
      <h1 className="h2 no-print">Seus Relatórios</h1>
      <p className="small-text no-print">Acompanhe e exporte o histórico financeiro de cada mês.</p>
      
      {monthKeys.map(monthKey => {
        const isOpen = openMonth === monthKey;
        const [year, month] = monthKey.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
        const title = dateObj.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

        return (
          <div key={monthKey} className="flex-col printable-section" style={{ 
            marginTop: '16px', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden'
          }}>
            {/* Cabeçalho da Sanfona (Acordeão) */}
            <div 
              className="flex-row justify-between" 
              style={{ 
                padding: '16px', 
                backgroundColor: isOpen ? 'var(--surface-color-light)' : 'var(--surface-color)',
                cursor: 'pointer'
              }}
              onClick={() => setOpenMonth(isOpen ? null : monthKey)}
            >
              <span className="body-text" style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                {title}
              </span>
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {/* Conteúdo Expansível */}
            {isOpen && (
              <div style={{ padding: '0 16px' }}>
                {renderMonthReport(monthKey)}
              </div>
            )}
          </div>
        );
      })}

      <style dangerouslySetInnerHTML={{__html: `
        @media screen {
          .print-only { display: none !important; }
        }
        @media print {
          .screen-only { display: none !important; }
          body { background: white !important; color: black !important; overflow: auto; }
          .app-container { height: auto; }
          .main-content { padding: 0; padding-bottom: 0; overflow: visible; }
          nav, .no-print, .print-buttons, button, svg { display: none !important; }
          .printable-section { border: none !important; margin: 0 !important; }
          .glass { background: none !important; border: none !important; box-shadow: none !important; filter: none !important; backdrop-filter: none !important; color: black !important; padding: 0 !important; margin-bottom: 12px !important; }
          .list-item { border-bottom: 1px solid #ddd; padding: 6px 0 !important; margin-bottom: 4px; background: transparent !important; }
          * { color: black !important; }
          .text-red { color: #d00 !important; }
          h2.h3 { border-bottom: 2px solid #333 !important; color: #333 !important; margin-top: 20px !important; }
        }
      `}} />
    </div>
  );
}

const styles = {
  summaryCard: {
    padding: '16px 20px',
  },
  listItem: {
    padding: '8px 12px',
    backgroundColor: 'var(--surface-color)',
    borderRadius: 'var(--radius-sm)',
    marginBottom: '4px'
  },
  primaryBtn: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: 'var(--accent-neon-green)',
    color: '#000',
    fontWeight: '600',
    borderRadius: 'var(--radius-sm)',
  },
  secondaryBtn: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: 'var(--surface-color-light)',
    color: 'var(--text-primary)',
    fontWeight: '600',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid rgba(255,255,255,0.1)'
  }
};
