import React, { useState } from 'react';
import { useFinanceData } from '../hooks/useFinanceData';
import { Share2, Download, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export default function RelatoriosView() {
  const { data } = useFinanceData();
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

  const handleShare = async (monthKey, monthName, totalGeral, categoriesWithAccounts, smartGroups) => {
    let text = `📊 *Relatório EmDia - ${monthName.toUpperCase()}*\n`;
    text += `Total Gasto: R$ ${totalGeral.toFixed(2)}\n\n`;
    
    text += `*CONTAS FIXAS:*\n`;
    categoriesWithAccounts.forEach(cat => {
      text += `[${cat.name}]\n`;
      cat.accounts.forEach(acc => {
        text += `- ${acc.name}: R$ ${acc.amount.toFixed(2)}\n`;
      });
    });

    text += `\n*SAÍDAS EXTRAS (Agrupadas):*\n`;
    smartGroups.forEach(group => {
      text += `- ${group.rootWord} (${group.count}x): R$ ${group.total.toFixed(2)}\n`;
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

    // Agrupamento
    const categoriesWithAccounts = (data.categories || []).map(cat => ({
      ...cat,
      accounts: paidAccounts.filter(acc => acc.categoryId === cat.id)
    })).filter(cat => cat.accounts.length > 0);

    const smartGroupsMap = {};
    extraExpenses.forEach(exp => {
      const root = getPrincipalWord(exp.name);
      if (!smartGroupsMap[root]) {
        smartGroupsMap[root] = { rootWord: root.charAt(0).toUpperCase() + root.slice(1), count: 0, total: 0, items: [] };
      }
      smartGroupsMap[root].count += 1;
      smartGroupsMap[root].total += exp.amount;
      smartGroupsMap[root].items.push(exp);
    });
    const smartGroups = Object.values(smartGroupsMap).sort((a, b) => b.total - a.total);

    return (
      <div className="animate-fade-in flex-col gap-md mt-sm" style={{ paddingBottom: '20px' }}>
        
        {/* Visão Geral */}
        <div className="glass" style={styles.summaryCard}>
          <div className="flex-row justify-between" style={{ alignItems: 'center' }}>
            <span className="body-text">Total Gasto:</span>
            <span className="h2 text-red">R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Contas Fixas */}
        <section className="flex-col gap-sm">
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
                  <div key={acc.id} className="flex-row justify-between" style={styles.listItem}>
                    <span className="body-text">{acc.name}</span>
                    <span style={{ fontWeight: '500' }}>R$ {acc.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Saídas Extras */}
        <section className="flex-col gap-sm mt-md">
          <h2 className="h3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
            ✨ Saídas Extras (Agrupadas)
          </h2>
          {smartGroups.length === 0 && <span className="small-text">Nenhuma saída extra.</span>}

          <div className="flex-col gap-md">
            {smartGroups.map(group => {
              const stateKey = `${monthKey}-${group.rootWord}`;
              const isExpanded = !!expandedGroups[stateKey];
              return (
                <div key={group.rootWord} className="glass" style={{ padding: '12px' }}>
                  <div 
                    className="flex-row justify-between" 
                    style={{ alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => toggleGroup(monthKey, group.rootWord)}
                  >
                    <div className="flex-row gap-sm" style={{ alignItems: 'center' }}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      <span className="body-text" style={{ fontWeight: '600' }}>
                        {group.rootWord} <span style={{ color: 'var(--text-secondary)', fontWeight: '400', fontSize: '12px' }}>({group.count}x)</span>
                      </span>
                    </div>
                    <span className="text-red" style={{ fontWeight: '600' }}>
                      R$ {group.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="flex-col mt-md" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', gap: '8px' }}>
                      {group.items.map(item => (
                        <div key={item.id} className="flex-row justify-between small-text">
                          <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                          <span>R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Ações Visíveis Apenas na Tela */}
        <div className="flex-row gap-md mt-lg" className="print-buttons" style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => handleShare(monthKey, monthName, totalGeral, categoriesWithAccounts, smartGroups)} style={styles.primaryBtn}>
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
        @media print {
          body { background: white; color: black; overflow: auto; }
          .app-container { height: auto; }
          .main-content { padding: 0; padding-bottom: 0; overflow: visible; }
          nav, .no-print, .print-buttons, button { display: none !important; }
          .printable-section { border: none !important; margin: 0 !important; }
          .glass { background: none; border: 1px solid #ccc; filter: none; backdrop-filter: none; color: black; }
          * { color: black !important; }
          .text-red { color: #d00 !important; }
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
