import BottomNav from './BottomNav';
import FAB from './FAB';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children, currentView, setView, onFabAction, onOpenSettings }) {
  const { logout } = useAuth();

  return (
    <div className="app-container">
      {/* Global Top Bar */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 'calc(env(safe-area-inset-top, 0px) + 8px) 20px 8px 20px',
        background: '#0A0A0A',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '0 0 16px 16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        width: '100%',
        minHeight: '70px',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
          <img src="/logo.png" alt="EmDia Logo" style={{ height: '56px', width: 'auto', objectFit: 'contain' }} />
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>
      <FAB onAction={onFabAction} />
      <BottomNav currentView={currentView} setView={setView} onOpenSettings={onOpenSettings} />
    </div>
  );
}

const styles = {
  iconBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    padding: '8px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  }
};
