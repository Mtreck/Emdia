import BottomNav from './BottomNav';
import FAB from './FAB';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children, currentView, setView, onFabAction, onOpenSettings }) {
  const { logout } = useAuth();

  return (
    <div className="app-container" style={{ paddingTop: '70px' }}>
      {/* Global Top Bar */}
      <header style={{ 
        position: 'fixed', 
        top: 0, left: 0, right: 0, 
        height: '70px',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 20px',
        zIndex: 50,
        background: '#0A0A0A',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '0 0 16px 16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
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
