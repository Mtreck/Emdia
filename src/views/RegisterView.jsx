import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CurrencyInput from '../components/CurrencyInput';

export default function RegisterView({ onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [grossBalance, setGrossBalance] = useState('');
  const [payDay, setPayDay] = useState('');
  
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      return setError('A senha deve ter pelo menos 6 caracteres.');
    }
    if (!name || grossBalance === '' || !payDay) {
      return setError('Por favor, preencha todos os campos.');
    }

    try {
      await register(email, password, name, grossBalance, payDay);
    } catch (err) {
      setError('Falha ao criar conta. Esse email já pode estar em uso.');
      console.error(err);
    }
  };

  return (
    <div className="flex-col gap-lg" style={{ 
      minHeight: '100vh', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '20px'
    }}>
      <div className="glass flex-col gap-md" style={{ padding: '24px', width: '100%', maxWidth: '400px' }}>
        <h2 className="h3" style={{ textAlign: 'center', marginBottom: '16px' }}>Criar Conta</h2>
        
        {error && <div style={{ color: 'var(--danger-red)', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="flex-col gap-sm">
          <input 
            type="text" 
            placeholder="Seu Nome" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
          
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          
          <input 
            type="password" 
            placeholder="Senha (mín. 6 chars)" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <div className="flex-row gap-sm">
            <div className="flex-col gap-xs" style={{ flex: 1 }}>
              <label className="small-text">Renda Bruta (R$)</label>
              <CurrencyInput 
                value={grossBalance} 
                onChange={setGrossBalance} 
                placeholder="2.000,00" 
                style={styles.input} 
              />
            </div>
            
            <div className="flex-col gap-xs" style={{ width: '110px' }}>
              <label className="small-text">Dia que recebe</label>
              <input 
                type="number" 
                min="1" max="31"
                placeholder="Dia 5" 
                value={payDay}
                onChange={(e) => setPayDay(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <p className="small-text" style={{ fontSize: '11px', marginTop: '8px', marginBottom: '8px', lineHeight: '1.4', opacity: 0.75 }}>
            💡 <strong>Dica de Bancos:</strong> Se você recebe todo seu salário em um só banco, coloque o valor total aqui. Caso receba em mais de um banco, coloque a soma total aqui agora e, logo após criar a conta, você poderá dividi-los e dar cores a cada um no menu de Ajustes!
          </p>

          <button type="submit" style={styles.primaryBtn}>
            Criar Conta
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <span className="small-text">Já tem uma conta? </span>
          <button onClick={() => onNavigate('login')} style={{ color: 'var(--accent-neon-green)', background: 'none', border: 'none', fontWeight: '600' }}>
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  input: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '16px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  primaryBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'var(--accent-neon-green)',
    color: '#000',
    fontWeight: '600',
    borderRadius: 'var(--radius-sm)',
    marginTop: '8px',
    fontSize: '16px'
  }
};
