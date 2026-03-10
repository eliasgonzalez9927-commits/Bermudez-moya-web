
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
  onCancel: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulación de autenticación (Mock) con validación de credenciales
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.username === username && u.password === password);
      if (user) {
        onLogin({ ...user, lastLogin: new Date().toISOString() });
      } else {
        setError('Credenciales incorrectas. Verifique usuario y contraseña.');
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-50 flex items-center justify-center p-6 animate-in fade-in duration-500 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.06)] border border-white">
          <header className="text-center mb-10">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-red-200 mx-auto mb-6">BM</div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Acceso Seguro</h1>
            <p className="text-slate-400 font-medium text-sm uppercase tracking-widest">Bermudez-Moya Admin</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nombre de Usuario</label>
              <input 
                type="text" 
                required
                className="w-full px-8 py-5 bg-slate-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-red-500/10 outline-none font-bold text-slate-700 placeholder-slate-300"
                placeholder="Ej: admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Contraseña de Acceso</label>
              <input 
                type="password" 
                required
                className="w-full px-8 py-5 bg-slate-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-red-500/10 outline-none font-bold text-slate-700 placeholder-slate-300"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold text-center border border-red-100 animate-in shake duration-300">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-5 bg-slate-900 text-white font-black rounded-[1.5rem] uppercase tracking-widest text-xs hover:bg-red-600 shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : 'Verificar Identidad'}
            </button>
          </form>

          <button 
            onClick={onCancel}
            className="w-full mt-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-slate-900 transition-colors"
          >
            Regresar al Portal Público
          </button>
        </div>
        
        <p className="text-center mt-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] pointer-events-none">
          High-Sync Authentication v2.5
        </p>
      </div>
    </div>
  );
};

export default Login;
