import React, { useState } from 'react';

const COLORS = [
  '#FF3366', // Red
  '#9D4EDD', // Purple
  '#39FF14', // Neon Green
  '#00F0FF', // Cyan
  '#FFB800', // Yellow
  '#FF6B00'  // Orange
];

export default function CategoryForm({ onSubmit, initialName = '', initialColor = COLORS[0], onDelete, submitLabel = "Criar Categoria" }) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name, color);
    setName('');
    setColor(COLORS[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-col gap-lg">
      <div className="flex-col gap-sm">
        <label className="small-text">Nome da Categoria</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Alimentação"
          style={styles.input}
          autoFocus
        />
      </div>

      <div className="flex-col gap-sm">
        <label className="small-text">Cor de Destaque</label>
        <div className="flex-row gap-md" style={{ flexWrap: 'wrap' }}>
          {COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              style={{
                ...styles.colorCircle,
                backgroundColor: c,
                border: color === c ? '2px solid white' : '2px solid transparent',
                transform: color === c ? 'scale(1.1)' : 'scale(1)'
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex-col gap-sm" style={{ marginTop: 'var(--space-md)' }}>
        <button type="submit" style={{ ...styles.submitBtn, marginTop: 0 }}>
          {submitLabel}
        </button>
        {onDelete && (
          <button 
            type="button" 
            onClick={onDelete} 
            style={{ ...styles.submitBtn, marginTop: 0, backgroundColor: 'transparent', color: 'var(--danger-red)', border: '1px solid var(--danger-red)' }}
          >
            Excluir Categoria
          </button>
        )}
      </div>
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
  colorCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    transition: 'all 0.2s ease',
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
  }
};
