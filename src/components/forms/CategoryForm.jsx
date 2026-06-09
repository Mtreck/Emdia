import React, { useState } from 'react';

const COLORS = [
  '#FF3366', // Red
  '#9D4EDD', // Purple
  '#39FF14', // Neon Green
  '#00F0FF', // Cyan
  '#FFB800', // Yellow
  '#FF6B00'  // Orange
];

export default function CategoryForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);

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

      <button type="submit" style={styles.submitBtn}>
        Criar Categoria
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
