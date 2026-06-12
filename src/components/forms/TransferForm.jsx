import React, { useState } from 'react';
import CurrencyInput from '../CurrencyInput';

export default function TransferForm({ sources, onSubmit }) {
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fromId || !toId || fromId === toId || amount === '' || Number(amount) <= 0) return;
    onSubmit({ fromId, toId, amount });
  };

  return (
    <form onSubmit={handleSubmit} className="flex-col gap-lg">
      <div className="flex-col gap-sm">
        <label className="small-text">De (Banco de Origem)</label>
        <select value={fromId} onChange={(e) => setFromId(e.target.value)} style={styles.input} required>
          <option value="" disabled>Selecione a origem...</option>
          {sources.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-col gap-sm">
        <label className="small-text">Para (Banco de Destino)</label>
        <select value={toId} onChange={(e) => setToId(e.target.value)} style={styles.input} required>
          <option value="" disabled>Selecione o destino...</option>
          {sources.map(s => (
            <option key={s.id} value={s.id} disabled={s.id === fromId}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-col gap-sm">
        <label className="small-text">Valor da Transferência (R$)</label>
        <CurrencyInput value={amount} onChange={setAmount} placeholder="0,00" style={styles.input} />
      </div>

      <button type="submit" style={styles.submitBtn}>
        Confirmar Transferência
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
  submitBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'var(--accent-neon-green)',
    color: '#000',
    fontWeight: '600',
    borderRadius: 'var(--radius-sm)',
    marginTop: 'var(--space-md)',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer'
  }
};
