import React, { useState } from 'react';
import CurrencyInput from '../CurrencyInput';

export default function ExtraExpenseForm({ onSubmit, incomeSources, expense }) {
  const isEditing = !!expense;
  const [name, setName] = useState(expense?.name || '');
  const [amount, setAmount] = useState(expense?.amount ?? '');
  const [sourceId, setSourceId] = useState(expense?.sourceId || incomeSources?.[0]?.id || 'source-default');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;

    onSubmit({
      name,
      amount: amount,
      sourceId: sourceId
    });

    if (!isEditing) {
      setName('');
      setAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-col gap-lg">
      <div className="flex-col gap-sm">
        <label className="small-text">O que você gastou?</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Lanche na rua"
          style={styles.input}
          autoFocus
        />
      </div>

      <div className="flex-col gap-sm">
        <label className="small-text">Valor (R$)</label>
        <CurrencyInput 
          value={amount}
          onChange={setAmount}
          placeholder="0,00"
          style={styles.input}
        />
      </div>

      {incomeSources && incomeSources.length > 1 && (
        <div className="flex-col gap-sm">
          <label className="small-text">Banco / Origem</label>
          <div style={{ position: 'relative' }}>
            <select 
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              style={styles.select}
            >
              {incomeSources.map(src => (
                <option key={src.id} value={src.id} style={{ background: 'var(--surface-color)' }}>
                  {src.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <button type="submit" style={styles.submitBtn}>
        {isEditing ? 'Salvar Alterações' : 'Registrar Saída Extra'}
      </button>
    </form>
  );
}

const styles = {
  input: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'var(--surface-color-light)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '16px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  select: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'var(--surface-color-light)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
    outline: 'none',
    cursor: 'pointer',
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'rgba(255,255,255,0.5)\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    backgroundSize: '16px',
    appearance: 'none',
    paddingRight: '40px'
  },
  submitBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'var(--danger-red)',
    color: '#fff',
    fontWeight: '600',
    borderRadius: 'var(--radius-sm)',
    marginTop: 'var(--space-md)',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer'
  }
};
