import React, { useState } from 'react';
import CurrencyInput from '../CurrencyInput';

export default function AccountForm({ categories, onSubmit }) {
  const [type, setType] = useState('recorrente'); // 'recorrente' | 'parcelada'
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  
  // Recorrente fields
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState(''); // Dia útil (ex: 5)
  
  // Parcelada fields
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [installments, setInstallments] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;
    
    if (type === 'recorrente') {
      if (amount === '') return;
      onSubmit({
        type: 'recorrente',
        name,
        categoryId,
        amount: amount,
        dueDay: parseInt(dueDay, 10)
      });
    } else {
      if (installmentAmount === '' || !installments) return;
      const total = installmentAmount * parseInt(installments, 10);
      onSubmit({
        type: 'parcelada',
        name,
        categoryId,
        amount: installmentAmount,
        installments: {
          total: parseInt(installments, 10),
          current: 1
        },
        totalAmount: total
      });
    }
  };

  const totalCalculated = type === 'parcelada' && installmentAmount !== '' && installments 
    ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(installmentAmount * parseInt(installments, 10))
    : '0,00';

  return (
    <form onSubmit={handleSubmit} className="flex-col gap-lg">
      
      {/* Tipo Toggle */}
      <div style={styles.toggleContainer} className="glass">
        <button
          type="button"
          style={{ ...styles.toggleBtn, backgroundColor: type === 'recorrente' ? 'var(--surface-color-light)' : 'transparent', color: type === 'recorrente' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          onClick={() => setType('recorrente')}
        >
          Recorrente
        </button>
        <button
          type="button"
          style={{ ...styles.toggleBtn, backgroundColor: type === 'parcelada' ? 'var(--surface-color-light)' : 'transparent', color: type === 'parcelada' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          onClick={() => setType('parcelada')}
        >
          Parcelada
        </button>
      </div>

      <div className="flex-col gap-sm">
        <label className="small-text">Nome da Conta</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Conta de Luz" style={styles.input} />
      </div>

      <div className="flex-col gap-sm">
        <label className="small-text">Categoria</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={styles.input}>
          <option value="" disabled>Selecione...</option>
          {categories.filter(c => c.id !== 'cat-default').map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {type === 'recorrente' ? (
        <>
          <div className="flex-col gap-sm">
            <label className="small-text">Valor (R$)</label>
            <CurrencyInput value={amount} onChange={setAmount} placeholder="0,00" style={styles.input} />
          </div>
          <div className="flex-col gap-sm">
            <label className="small-text">Vencimento (Dia Útil do mês)</label>
            <input type="number" min="1" max="31" value={dueDay} onChange={(e) => setDueDay(e.target.value)} placeholder="Ex: 5" style={styles.input} />
          </div>
        </>
      ) : (
        <>
          <div className="flex-row gap-md">
            <div className="flex-col gap-sm" style={{ flex: 1 }}>
              <label className="small-text">Valor da Parcela (R$)</label>
              <CurrencyInput value={installmentAmount} onChange={setInstallmentAmount} placeholder="0,00" style={styles.input} />
            </div>
            <div className="flex-col gap-sm" style={{ flex: 1 }}>
              <label className="small-text">Qtd. Parcelas</label>
              <input type="number" min="2" value={installments} onChange={(e) => setInstallments(e.target.value)} placeholder="Ex: 12" style={styles.input} />
            </div>
          </div>
          
          {totalCalculated !== '0,00' && (
             <div className="glass flex-row justify-between" style={{ padding: '16px', borderRadius: 'var(--radius-sm)' }}>
               <span className="small-text">Total da Compra:</span>
               <span style={{ fontWeight: '600', color: 'var(--accent-purple)' }}>R$ {totalCalculated}</span>
             </div>
          )}
        </>
      )}

      <button type="submit" style={{...styles.submitBtn, backgroundColor: type === 'recorrente' ? 'var(--accent-neon-green)' : 'var(--accent-purple)'}}>
        Cadastrar Conta
      </button>
    </form>
  );
}

const styles = {
  toggleContainer: {
    display: 'flex',
    padding: '4px',
    borderRadius: 'var(--radius-md)',
  },
  toggleBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: 'calc(var(--radius-md) - 4px)',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  input: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'var(--surface-color-light)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '16px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  submitBtn: {
    width: '100%',
    padding: '16px',
    color: '#000',
    fontWeight: '600',
    borderRadius: 'var(--radius-sm)',
    marginTop: 'var(--space-md)',
    fontSize: '16px',
    color: '#fff',
  }
};
