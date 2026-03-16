
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { getStoredUsers, updateUserProfile } from '../services/userStorageService';

interface LoginProps {
  onLogin: (user: User) => void;
  onCancel: () => void;
}

type Step = 'login' | 'forgot' | 'verify' | 'reset';

const RESEND_SECONDS = 90;

const Login: React.FC<LoginProps> = ({ onLogin, onCancel }) => {
  const [step, setStep] = useState<Step>('login');

  // Login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot / verify / reset
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [recoveryMsg, setRecoveryMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // ── Step 1: login ────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      const user = getStoredUsers().find(u => u.username === username && u.password === password);
      if (user) {
        onLogin({ ...user, lastLogin: new Date().toISOString() });
      } else {
        setError('Credenciales incorrectas. Verifique usuario y contraseña.');
      }
      setIsLoading(false);
    }, 1200);
  };

  // ── Step 2: send code ────────────────────────────────────────────────────────
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryMsg(null);
    if (!recoveryEmail.includes('@')) {
      setRecoveryMsg({ type: 'err', text: 'Tu usuario debe ser un email válido para recuperar la contraseña.' });
      return;
    }
    const user = getStoredUsers().find(u => u.username === recoveryEmail);
    if (!user) {
      setRecoveryMsg({ type: 'err', text: 'No existe una cuenta con ese usuario.' });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: recoveryEmail }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Error al enviar el código.');
      setCountdown(RESEND_SECONDS);
      setStep('verify');
    } catch (err: any) {
      setRecoveryMsg({ type: 'err', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 3: verify code ──────────────────────────────────────────────────────
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryMsg(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: recoveryEmail, code: codeInput }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Código incorrecto.');
      setStep('reset');
    } catch (err: any) {
      setRecoveryMsg({ type: 'err', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 4: reset password ───────────────────────────────────────────────────
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryMsg(null);
    if (newPass.length < 6) {
      setRecoveryMsg({ type: 'err', text: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }
    if (newPass !== confirmPass) {
      setRecoveryMsg({ type: 'err', text: 'Las contraseñas no coinciden.' });
      return;
    }
    const user = getStoredUsers().find(u => u.username === recoveryEmail);
    if (!user) { setRecoveryMsg({ type: 'err', text: 'Usuario no encontrado.' }); return; }
    updateUserProfile(user.id, { password: newPass });
    setRecoveryMsg({ type: 'ok', text: 'Contraseña actualizada. Ya podés iniciar sesión.' });
    setTimeout(() => {
      setStep('login');
      setRecoveryMsg(null);
      setRecoveryEmail('');
      setCodeInput('');
      setNewPass('');
      setConfirmPass('');
    }, 2500);
  };

  const backToLogin = () => {
    setStep('login');
    setRecoveryMsg(null);
    setRecoveryEmail('');
    setCodeInput('');
  };

  // ── Shared UI pieces ─────────────────────────────────────────────────────────
  const iconLogo = (
    <div className="w-16 h-16 bg-brand-red rounded-2xl flex items-center justify-center shadow-xl shadow-brand-red/20 mx-auto mb-6">
      <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="40" height="18" fill="white" fillOpacity="0.2" />
        <line x1="10" y1="10" x2="38" y2="10" stroke="white" strokeWidth="2"/>
        <line x1="10" y1="16" x2="38" y2="16" stroke="white" strokeWidth="2"/>
        <path d="M4 44V26L24 38L44 26V44" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );

  const inputClass = "w-full px-8 py-5 bg-slate-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-brand-red/10 outline-none font-bold text-brand-black placeholder-slate-300";
  const msgEl = recoveryMsg && (
    <div className={`p-4 rounded-2xl text-xs font-bold text-center border animate-in fade-in duration-300 ${
      recoveryMsg.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
    }`}>
      {recoveryMsg.text}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[150] bg-slate-50 flex items-center justify-center p-6 animate-in fade-in duration-500 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.06)] border border-white">

          {/* ── LOGIN ────────────────────────────────────────────────────── */}
          {step === 'login' && (
            <>
              <header className="text-center mb-10">
                {iconLogo}
                <h1 className="text-3xl font-black text-brand-black tracking-tight mb-2">Acceso Seguro</h1>
                <p className="text-brand-gray font-medium text-sm uppercase tracking-widest">Bermudez-Moya Admin</p>
              </header>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nombre de Usuario</label>
                  <input type="text" required className={inputClass} placeholder="Ej: admin" value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Contraseña de Acceso</label>
                  <input type="password" required className={inputClass} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold text-center border border-red-100 animate-in shake duration-300">{error}</div>
                )}
                <button type="submit" disabled={isLoading} className="w-full py-5 bg-brand-black text-white font-black rounded-[1.5rem] uppercase tracking-widest text-xs hover:bg-brand-red shadow-2xl shadow-black/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                  {isLoading ? <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg> : 'Verificar Identidad'}
                </button>
              </form>
              <div className="mt-6 space-y-2">
                <button onClick={() => { setStep('forgot'); setRecoveryMsg(null); }} className="w-full py-3 text-brand-red text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-70 transition-opacity">
                  Olvidé mi contraseña
                </button>
                <button onClick={onCancel} className="w-full py-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-slate-900 transition-colors">
                  Regresar al Portal Público
                </button>
              </div>
            </>
          )}

          {/* ── FORGOT: enter email ───────────────────────────────────────── */}
          {step === 'forgot' && (
            <>
              <header className="text-center mb-10">
                {iconLogo}
                <h1 className="text-2xl font-black text-brand-black tracking-tight mb-2">Recuperar Acceso</h1>
                <p className="text-brand-gray font-medium text-sm">Ingresá tu usuario (email) y te enviaremos un código.</p>
              </header>
              <form onSubmit={handleSendCode} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tu Usuario (email)</label>
                  <input type="text" required className={inputClass} placeholder="usuario@email.com" value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value)} />
                </div>
                {msgEl}
                <button type="submit" disabled={isLoading} className="w-full py-5 bg-brand-black text-white font-black rounded-[1.5rem] uppercase tracking-widest text-xs hover:bg-brand-red shadow-2xl shadow-black/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                  {isLoading ? <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg> : 'Enviar Código'}
                </button>
              </form>
              <button onClick={backToLogin} className="w-full mt-6 py-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-slate-900 transition-colors">
                ← Volver
              </button>
            </>
          )}

          {/* ── VERIFY: enter 6-digit code ────────────────────────────────── */}
          {step === 'verify' && (
            <>
              <header className="text-center mb-10">
                {iconLogo}
                <h1 className="text-2xl font-black text-brand-black tracking-tight mb-2">Verificar Código</h1>
                <p className="text-brand-gray font-medium text-sm">Revisá tu email <strong>{recoveryEmail}</strong> e ingresá el código de 6 dígitos.</p>
              </header>
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Código de 6 dígitos</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    className={`${inputClass} text-center text-3xl tracking-[0.5em] font-black`}
                    placeholder="——————"
                    value={codeInput}
                    onChange={e => setCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                </div>
                {msgEl}
                <button type="submit" disabled={isLoading || codeInput.length !== 6} className="w-full py-5 bg-brand-black text-white font-black rounded-[1.5rem] uppercase tracking-widest text-xs hover:bg-brand-red shadow-2xl shadow-black/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                  {isLoading ? <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg> : 'Confirmar Código'}
                </button>
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Reenviar en {countdown}s</p>
                  ) : (
                    <button type="button" onClick={handleSendCode as any} className="text-[10px] text-brand-red font-black uppercase tracking-widest hover:opacity-70 transition-opacity">
                      Reenviar código
                    </button>
                  )}
                </div>
              </form>
              <button onClick={backToLogin} className="w-full mt-4 py-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-slate-900 transition-colors">
                ← Volver
              </button>
            </>
          )}

          {/* ── RESET: new password ───────────────────────────────────────── */}
          {step === 'reset' && (
            <>
              <header className="text-center mb-10">
                {iconLogo}
                <h1 className="text-2xl font-black text-brand-black tracking-tight mb-2">Nueva Contraseña</h1>
                <p className="text-brand-gray font-medium text-sm">Elegí una contraseña segura para tu cuenta.</p>
              </header>
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nueva Contraseña</label>
                  <input type="password" required className={inputClass} placeholder="••••••••" value={newPass} onChange={e => setNewPass(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Confirmar Contraseña</label>
                  <input type="password" required className={inputClass} placeholder="••••••••" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
                </div>
                {msgEl}
                <button type="submit" className="w-full py-5 bg-brand-black text-white font-black rounded-[1.5rem] uppercase tracking-widest text-xs hover:bg-brand-red shadow-2xl shadow-black/10 transition-all">
                  Guardar Contraseña
                </button>
              </form>
            </>
          )}

        </div>

        <p className="text-center mt-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] pointer-events-none">
          High-Sync Authentication v2.5
        </p>
      </div>
    </div>
  );
};

export default Login;
