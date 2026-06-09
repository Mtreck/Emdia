import React, { useState } from 'react';
import { Plus, Tag, FileText, ArrowUpRight } from 'lucide-react';

export default function FAB({ onAction }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  // Prevent background click when open
  const handleOverlayClick = () => setIsOpen(false);

  return (
    <>
      {isOpen && (
        <div 
          style={styles.overlay} 
          onClick={handleOverlayClick}
          className="animate-fade-in"
        />
      )}
      
      <div style={styles.container}>
        {isOpen && (
          <div style={styles.menu} className="animate-slide-up">
            <button style={styles.menuItem} onClick={() => { onAction('category'); setIsOpen(false); }}>
              <span style={styles.menuLabel}>Categoria</span>
              <div style={styles.iconWrapper} className="glass">
                <Tag size={18} color="var(--accent-purple)" />
              </div>
            </button>
            <button style={styles.menuItem} onClick={() => { onAction('account'); setIsOpen(false); }}>
              <span style={styles.menuLabel}>Conta</span>
              <div style={styles.iconWrapper} className="glass">
                <FileText size={18} color="#fff" />
              </div>
            </button>
            <button style={styles.menuItem} onClick={() => { onAction('extra'); setIsOpen(false); }}>
              <span style={styles.menuLabel}>Saída Extra</span>
              <div style={styles.iconWrapper} className="glass">
                <ArrowUpRight size={18} color="var(--danger-red)" />
              </div>
            </button>
          </div>
        )}
        
        <button 
          style={{
            ...styles.mainBtn, 
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            backgroundColor: isOpen ? 'var(--surface-color-light)' : 'var(--accent-neon-green)',
            color: isOpen ? '#fff' : '#000'
          }}
          onClick={toggle}
        >
          <Plus size={28} />
        </button>
      </div>
    </>
  );
}

const styles = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10,
  },
  container: {
    position: 'absolute',
    bottom: '90px',
    right: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    zIndex: 20,
  },
  mainBtn: {
    width: '56px',
    height: '56px',
    borderRadius: '28px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(57, 255, 20, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '16px',
    marginBottom: '16px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  menuLabel: {
    color: '#fff',
    fontWeight: '500',
    fontSize: '14px',
    background: 'rgba(30, 30, 30, 0.8)',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
};
