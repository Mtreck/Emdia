import React, { useState } from 'react';
import CurrencyInput from '../CurrencyInput';

export default function SettingsForm({ initialBalance, onSubmit }) {
  const [balance, setBalance] = useState(initialBalance || '');
  const [isLightMode, setIsLightMode] = useState(document.body.classList.contains('light-theme'));

  const toggleTheme = (e) => {
    e.preventDefault();
    document.body.classList.toggle('light-theme');
    setIsLightMode(!isLightMode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      balance: balance === '' ? 0 : balance
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex-col gap-lg">
      <div className="flex-col gap-sm" style={{ paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex-row justify-between" style={{ alignItems: 'center' }}>
          <div>
            <label className="body-text" style={{ fontWeight: '600' }}>Tema Visual</label>
            <p className="small-text">Mudar para tema {isLightMode ? 'Escuro' : 'Claro'}</p>
          </div>
          <button onClick={toggleTheme} style={styles.themeBtn}>
            {isLightMode ? '🌙 Escuro' : '☀️ Claro'}
          </button>
        </div>
      </div>

      <div className="flex-col gap-sm">
        <label className="small-text">Salário Bruto Mensal (R$)</label>
        <CurrencyInput 
          value={balance}
          onChange={setBalance}
          placeholder="3.000,00"
          style={styles.input}
        />
      </div>

      <button type="submit" style={styles.submitBtn}>
        Salvar Configurações
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
    fontSize: '16px'
  },
  themeBtn: {
    padding: '12px 16px',
    backgroundColor: 'var(--surface-color-light)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid rgba(255,255,255,0.1)',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
