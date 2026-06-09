import React, { useState } from 'react';
import './App.css';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import GastosView from './views/GastosView';
import RelatoriosView from './views/RelatoriosView';
import Modal from './components/Modal';
import CategoryForm from './components/forms/CategoryForm';
import ExtraExpenseForm from './components/forms/ExtraExpenseForm';
import AccountForm from './components/forms/AccountForm';
import SettingsForm from './components/forms/SettingsForm';
import { useFinanceData } from './hooks/useFinanceData';
import { useAuth } from './contexts/AuthContext';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [activeModal, setActiveModal] = useState(null); // 'category', 'account', 'extra', 'settings', null
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  
  const { data, addCategory, addExtraExpense, addAccount, updateUserName, updateBalance } = useFinanceData();
  const { currentUser } = useAuth();

  if (!currentUser) {
    if (authView === 'login') return <LoginView onNavigate={setAuthView} />;
    return <RegisterView onNavigate={setAuthView} />;
  }

  const handleFabAction = (action) => {
    setActiveModal(action);
  };

  const closeModal = () => setActiveModal(null);

  const renderView = () => {
    switch(currentView) {
      case 'home':
        return <HomeView onOpenSettings={() => setActiveModal('settings')} />;
      case 'gastos':
        return <GastosView />;
      case 'relatorios':
        return <RelatoriosView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      setView={setCurrentView} 
      onFabAction={handleFabAction}
      onOpenSettings={() => setActiveModal('settings')}
    >
      {renderView()}

      {/* Modals */}
      <Modal 
        isOpen={activeModal === 'category'} 
        onClose={closeModal} 
        title="Nova Categoria"
      >
        <CategoryForm onSubmit={(name, color) => {
          addCategory(name, color);
          closeModal();
        }} />
      </Modal>

      <Modal 
        isOpen={activeModal === 'extra'} 
        onClose={closeModal} 
        title="Saída Extra"
      >
        <ExtraExpenseForm onSubmit={(expenseData) => {
          addExtraExpense(expenseData);
          closeModal();
        }} />
      </Modal>

      <Modal 
        isOpen={activeModal === 'account'} 
        onClose={closeModal} 
        title="Nova Conta"
      >
        <AccountForm 
          categories={data.categories}
          onSubmit={(accountData) => {
            addAccount(accountData);
            closeModal();
          }} 
        />
      </Modal>

      <Modal 
        isOpen={activeModal === 'settings'} 
        onClose={closeModal} 
        title="Configurações"
      >
        <SettingsForm 
          initialName={data.userName}
          initialBalance={data.grossBalance}
          onSubmit={(settingsData) => {
            updateUserName(settingsData.name);
            updateBalance(settingsData.balance);
            closeModal();
          }} 
        />
      </Modal>
    </Layout>
  );
}

export default App;
