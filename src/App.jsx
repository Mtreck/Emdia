import React, { useState, useEffect } from 'react';
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
import TransferForm from './components/forms/TransferForm';
import { useFinanceData } from './hooks/useFinanceData';
import { useAuth } from './contexts/AuthContext';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import PWATutorial from './components/PWATutorial';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [activeModal, setActiveModal] = useState(null); // 'category', 'account', 'extra', 'settings', 'transfer', null
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  
  const { data, addCategory, updateCategory, deleteCategory, addExtraExpense, addAccount, updateAccount, addTransfer, updateUserName, updateBalance, updateIncomeSources, toggleAccountPaidStatus, deleteAccount, closeMonthEarly } = useFinanceData();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const shown = localStorage.getItem('emdia_pwa_prompt_shown');
      if (!shown) {
        const timer = setTimeout(() => {
          setActiveModal('tutorial');
          localStorage.setItem('emdia_pwa_prompt_shown', 'true');
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentUser]);

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
        return <HomeView onOpenSettings={() => setActiveModal('settings')} data={data} />;
      case 'gastos':
        return <GastosView data={data} toggleAccountPaidStatus={toggleAccountPaidStatus} deleteAccount={deleteAccount} updateCategory={updateCategory} deleteCategory={deleteCategory} updateAccount={updateAccount} />;
      case 'relatorios':
        return <RelatoriosView data={data} closeMonthEarly={closeMonthEarly} />;
      default:
        return <HomeView data={data} />;
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
        <ExtraExpenseForm 
          incomeSources={data.incomeSources}
          onSubmit={(expenseData) => {
            addExtraExpense(expenseData);
            closeModal();
          }} 
        />
      </Modal>

      <Modal 
        isOpen={activeModal === 'transfer'} 
        onClose={closeModal} 
        title="Transferir Saldo"
      >
        <TransferForm 
          sources={data.incomeSources}
          onSubmit={({ fromId, toId, amount }) => {
            addTransfer(fromId, toId, amount);
            closeModal();
          }} 
        />
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
          initialSources={data.incomeSources}
          initialBalance={data.grossBalance}
          onSubmit={(settingsData) => {
            if (settingsData.sources) {
              updateIncomeSources(settingsData.sources);
            }
            closeModal();
          }} 
          onOpenTutorial={() => setActiveModal('tutorial')}
        />
      </Modal>

      <Modal 
        isOpen={activeModal === 'tutorial'} 
        onClose={closeModal} 
        title="Como Instalar o App"
      >
        <PWATutorial onClose={closeModal} />
      </Modal>
    </Layout>
  );
}

export default App;
