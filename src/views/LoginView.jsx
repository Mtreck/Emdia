import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginView({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError('Falha ao entrar. Verifique seu email e senha.');
      console.error(err);
    }
  };

  return (
    <div className="flex-col gap-lg" style={{ 
      height: '100vh', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '20px'
    }}>
      <div className="flex-col" style={{ alignItems: 'center', marginBottom: '20px' }}>
        <img src="/logo.png" alt="EmDia Logo" style={{ height: '80px', width: 'auto', objectFit: 'contain', marginBottom: '8px' }} />
        <p className="body-text text-secondary">Seu controle financeiro pessoal</p>
      </div>

      <div className="glass flex-col gap-md" style={{ padding: '24px', width: '100%', maxWidth: '400px' }}>
        <h2 className="h3" style={{ textAlign: 'center', marginBottom: '16px' }}>Entrar</h2>
        
        {error && <div style={{ color: 'var(--danger-red)', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="flex-col gap-sm">
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
            placeholder="Senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.primaryBtn}>
            Entrar
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <span className="small-text">Não tem uma conta? </span>
          <button onClick={() => onNavigate('register')} style={{ color: 'var(--accent-neon-green)', background: 'none', border: 'none', fontWeight: '600' }}>
            Cadastre-se
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
