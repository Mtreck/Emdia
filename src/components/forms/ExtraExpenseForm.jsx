import React, { useState } from 'react';
import CurrencyInput from '../CurrencyInput';

export default function ExtraExpenseForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;
    
    onSubmit({
      name,
      amount: amount
    });
    
    setName('');
    setAmount('');
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

      <button type="submit" style={styles.submitBtn}>
        Registrar Saída Extra
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
    backgroundColor: 'var(--danger-red)',
    color: '#fff',
    fontWeight: '600',
    borderRadius: 'var(--radius-sm)',
    marginTop: 'var(--space-md)',
    fontSize: '16px'
  }
};
