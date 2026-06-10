import React, { useState } from 'react';
import CurrencyInput from '../CurrencyInput';

const BANK_COLORS = [
  '#FF3366', // Red
  '#9D4EDD', // Purple
  '#39FF14', // Neon Green
  '#00F0FF', // Cyan
  '#FFB800', // Yellow
  '#FF6B00', // Orange
  '#A0A0A0'  // Grey
];

export default function SettingsForm({ initialSources, onSubmit, onOpenTutorial }) {
  const [sources, setSources] = useState(
    initialSources && initialSources.length > 0
      ? initialSources 
      : [{ id: 'source-default', name: 'Saldo Geral', balance: 0, color: '#39FF14' }]
  );
  const [isLightMode, setIsLightMode] = useState(document.body.classList.contains('light-theme'));

  const toggleTheme = (e) => {
    e.preventDefault();
    document.body.classList.toggle('light-theme');
    setIsLightMode(!isLightMode);
  };

  const handleSourceChange = (id, field, value) => {
    setSources(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  const addSource = () => {
    setSources(prev => [
      ...prev,
      { id: `source-${Date.now()}`, name: '', balance: '', color: '#A0A0A0' }
    ]);
  };

  const removeSource = (id) => {
    setSources(prev => prev.filter(s => s.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validatedSources = sources.map(s => ({
      id: s.id,
      name: s.name.trim() || 'Banco Sem Nome',
      balance: s.balance === '' ? 0 : Number(s.balance),
      color: s.color || '#A0A0A0'
    }));
    onSubmit({
      sources: validatedSources
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

      <div className="flex-col gap-sm" style={{ paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex-row justify-between" style={{ alignItems: 'center' }}>
          <div>
            <label className="body-text" style={{ fontWeight: '600' }}>Criar Atalho</label>
            <p className="small-text">Instale o app na tela de início</p>
          </div>
          <button 
            type="button" 
            onClick={(e) => {
              e.preventDefault();
              onOpenTutorial();
            }} 
            style={styles.themeBtn}
          >
            📲 Instalar
          </button>
        </div>
      </div>

      <div className="flex-col gap-sm">
        <label className="body-text" style={{ fontWeight: '600' }}>Fontes de Renda / Bancos</label>
        <p className="small-text">Cadastre seus salários e contas bancárias separadamente.</p>
        
        <div className="flex-col gap-sm" style={{ marginTop: '8px' }}>
          {sources.map((src) => (
            <div key={src.id} style={styles.bankCard}>
              <div className="flex-row gap-sm" style={{ alignItems: 'center', width: '100%' }}>
                <input 
                  type="text" 
                  value={src.name} 
                  onChange={(e) => handleSourceChange(src.id, 'name', e.target.value)}
                  placeholder="Nome do Banco"
                  style={{ ...styles.input, flex: 2, padding: '12px' }}
                />
                <CurrencyInput 
                  value={src.balance}
                  onChange={(val) => handleSourceChange(src.id, 'balance', val)}
                  placeholder="0,00"
                  style={{ ...styles.input, flex: 1.5, padding: '12px' }}
                />
                {sources.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeSource(src.id)}
                    style={styles.removeBtn}
                  >
                    X
                  </button>
                )}
              </div>
              
              <div className="flex-row gap-sm" style={{ alignItems: 'center', marginTop: '6px' }}>
                <span className="small-text" style={{ fontSize: '11px', marginRight: '4px' }}>Cor:</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {BANK_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleSourceChange(src.id, 'color', color)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '10px',
                        backgroundColor: color,
                        border: (src.color || '#A0A0A0') === color ? '2px solid white' : '1px solid rgba(255,255,255,0.2)',
                        cursor: 'pointer',
                        padding: 0,
                        transform: (src.color || '#A0A0A0') === color ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          type="button" 
          onClick={addSource}
          style={styles.addBtn}
        >
          + Adicionar Banco
        </button>
      </div>

      <button type="submit" style={styles.submitBtn}>
        Salvar Configurações
      </button>
    </form>
  );
}

const styles = {
  bankCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid rgba(255,255,255,0.05)',
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
    backgroundColor: 'var(--accent-neon-green)',
    color: '#000',
    fontWeight: '600',
    borderRadius: 'var(--radius-sm)',
    marginTop: 'var(--space-md)',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer'
  },
  themeBtn: {
    padding: '12px 16px',
    backgroundColor: 'var(--surface-color-light)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid rgba(255,255,255,0.1)',
    fontWeight: '600',
    cursor: 'pointer'
  },
  removeBtn: {
    padding: '12px 16px',
    backgroundColor: 'var(--danger-red-dim)',
    color: 'var(--danger-red)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--danger-red)',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addBtn: {
    alignSelf: 'flex-start',
    marginTop: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--accent-neon-green)',
    cursor: 'pointer',
    background: 'none',
    border: 'none'
  }
};
