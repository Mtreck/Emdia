import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      // Delay unmount to allow slide-down animation
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show && !isOpen) return null;

  return createPortal(
    <>
      <div 
        style={{ ...styles.overlay, opacity: isOpen ? 1 : 0 }} 
        onClick={onClose} 
      />
      <div 
        className="glass animate-slide-up"
        style={{ 
          ...styles.modal, 
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          opacity: isOpen ? 1 : 0
        }}
      >
        <div style={styles.header}>
          <h2 className="h3">{title}</h2>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={24} color="var(--text-secondary)" />
          </button>
        </div>
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
    transition: 'opacity 0.3s ease',
  },
  modal: {
    position: 'fixed',
    bottom: 0, left: 0, right: 0,
    maxHeight: '90vh',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 'var(--radius-lg)',
    borderTopRightRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--surface-color)',
    zIndex: 1010,
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1)',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--space-md) var(--space-lg)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  closeBtn: {
    padding: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  content: {
    padding: 'var(--space-lg)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  }
};
