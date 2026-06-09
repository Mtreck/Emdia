import React from 'react';
import { Home, List, PieChart, Settings } from 'lucide-react';

export default function BottomNav({ currentView, setView, onOpenSettings }) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'gastos', icon: List, label: 'Gastos' },
    { id: 'relatorios', icon: PieChart, label: 'Relatórios' },
    { id: 'settings', icon: Settings, label: 'Ajustes', isAction: true }
  ];

  return (
    <nav style={styles.nav} className="glass">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => item.isAction ? onOpenSettings() : setView(item.id)}
            style={{ ...styles.navItem, color: isActive ? 'var(--accent-neon-green)' : 'var(--text-secondary)' }}
          >
            <Icon size={24} />
            <span style={{ ...styles.label, fontWeight: isActive ? '600' : '400' }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 'env(safe-area-inset-bottom)',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    transition: 'color 0.2s',
  },
  label: {
    fontSize: '10px',
  }
};
