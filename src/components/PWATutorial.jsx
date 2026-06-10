import React, { useState, useEffect } from 'react';
import { Share2, PlusSquare, MoreVertical, Smartphone } from 'lucide-react';

export default function PWATutorial({ onClose }) {
  const [platform, setPlatform] = useState('android');

  useEffect(() => {
    // Try to auto-detect platform
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
      setPlatform('ios');
    } else {
      setPlatform('android');
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <img 
          src="/pwa.png" 
          alt="EmDia PWA Icon" 
          style={styles.pwaIcon} 
        />
        <div style={styles.heroText}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: '0 0 4px 0' }}>
            Instalar EmDia no Celular
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
            Adicione o app à sua tela inicial para ter acesso rápido e tela cheia, como um aplicativo nativo!
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button 
          style={{ 
            ...styles.tabButton, 
            borderBottom: platform === 'android' ? '2px solid var(--accent-neon-green)' : 'none',
            color: platform === 'android' ? 'var(--accent-neon-green)' : 'var(--text-secondary)'
          }}
          onClick={() => setPlatform('android')}
        >
          <Smartphone size={16} style={{ marginRight: '6px' }} /> Android
        </button>
        <button 
          style={{ 
            ...styles.tabButton, 
            borderBottom: platform === 'ios' ? '2px solid var(--accent-neon-green)' : 'none',
            color: platform === 'ios' ? 'var(--accent-neon-green)' : 'var(--text-secondary)'
          }}
          onClick={() => setPlatform('ios')}
        >
          <Smartphone size={16} style={{ marginRight: '6px' }} /> iOS (iPhone)
        </button>
      </div>

      {/* Instructions */}
      <div style={styles.instructionsContainer}>
        {platform === 'android' ? (
          <div style={styles.steps}>
            <div style={styles.step}>
              <div style={styles.stepNumber}>1</div>
              <p style={styles.stepText}>
                No navegador Google Chrome, toque no botão de menu <strong style={{ color: '#fff' }}><MoreVertical size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> (três pontinhos)</strong> no canto superior direito.
              </p>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>2</div>
              <p style={styles.stepText}>
                Selecione a opção <strong style={{ color: '#fff' }}>"Instalar aplicativo"</strong> ou <strong style={{ color: '#fff' }}>"Adicionar à tela de início"</strong>.
              </p>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>3</div>
              <p style={styles.stepText}>
                Clique em <strong style={{ color: '#fff' }}>"Instalar"</strong> ou <strong style={{ color: '#fff' }}>"Adicionar"</strong> na janela que aparecer para confirmar.
              </p>
            </div>
          </div>
        ) : (
          <div style={styles.steps}>
            <div style={styles.step}>
              <div style={styles.stepNumber}>1</div>
              <p style={styles.stepText}>
                No navegador Safari, toque no botão de <strong style={{ color: '#fff' }}>Compartilhar <Share2 size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /></strong> na barra inferior da tela.
              </p>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>2</div>
              <p style={styles.stepText}>
                Role a lista de opções para baixo e selecione <strong style={{ color: '#fff' }}>"Adicionar à Tela de Início" <PlusSquare size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /></strong>.
              </p>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>3</div>
              <p style={styles.stepText}>
                Toque em <strong style={{ color: '#fff' }}>"Adicionar"</strong> no canto superior direito para finalizar a instalação.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Understood Button */}
      <button onClick={onClose} style={styles.understandBtn}>
        Entendi!
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '4px 0',
  },
  heroSection: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.02)',
    padding: '16px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  pwaIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
  },
  heroText: {
    flex: 1,
  },
  tabContainer: {
    display: 'flex',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  tabButton: {
    flex: 1,
    padding: '12px',
    fontWeight: '600',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    transition: 'all 0.2s ease',
  },
  instructionsContainer: {
    minHeight: '160px',
    padding: '8px 0',
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  step: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  stepNumber: {
    background: 'var(--surface-color-light)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--accent-neon-green)',
    width: '24px',
    height: '24px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: '700',
    flexShrink: 0,
  },
  stepText: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: 0,
    lineHeight: '1.5',
  },
  understandBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'var(--accent-neon-green)',
    color: '#000',
    fontWeight: '700',
    borderRadius: 'var(--radius-sm)',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  }
};
