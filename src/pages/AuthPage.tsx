import React, { useState } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { Navigate } from 'react-router-dom';
import { Mail, Lock, Loader2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from '../components/Logo';

export default function AuthPage() {
  const { user, signInWithGoogle, signInWithEmail, registerWithEmail, signInGuest, error: globalError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const error = localError || globalError;

  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setLocalError(null);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      let message = 'Authentication failed';
      if (err.code === 'auth/invalid-credential') message = 'Invalid email or password';
      if (err.code === 'auth/email-already-in-use') message = 'This email is already registered';
      if (err.code === 'auth/user-not-found') message = 'No account found with this email';
      if (err.code === 'auth/wrong-password') message = 'Incorrect password';
      
      setLocalError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setLocalError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      const isUnauthorized = 
        err.code === 'auth/unauthorized-domain' || 
        (err.message && err.message.includes('auth/unauthorized-domain')) ||
        (err.message && err.message.includes('unauthorized-domain')) ||
        String(err).includes('unauthorized-domain');

      if (isUnauthorized) {
        setLocalError(`Domain Unauthorized: Google Auth is blocked because '${window.location.hostname}' is not authorized in your Firebase Project configuration yet.`);
      } else {
        setLocalError(err.message || 'Google sign-in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setLoading(true);
    setLocalError(null);
    try {
      await signInGuest();
    } catch (err: any) {
      console.error('Guest Auth Error:', err);
      setLocalError(err.message || 'Guest sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-momentum-bg flex flex-col items-center justify-center p-6 text-momentum-text font-sans overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-momentum-surface/30 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl relative my-8"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-momentum-accent/50 to-transparent"></div>
        
        <div className="flex flex-col items-center mb-8">
          <Logo size="xl" showText={false} className="mb-6" />
          <h1 className="text-3xl font-bold tracking-tight">Momentum</h1>
          <p className="text-momentum-text-dim text-sm mt-2">
            Build discipline with precision.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-momentum-text-dim uppercase tracking-wider ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-momentum-text-dim group-focus-within:text-momentum-accent transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="architect@momentum.io"
                required
                className="w-full bg-momentum-surface border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-momentum-accent/30 transition-all font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-momentum-text-dim uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-momentum-text-dim group-focus-within:text-momentum-accent transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-momentum-surface border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-momentum-accent/30 transition-all font-mono text-sm"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-400/10 rounded-xl border border-red-400/20 overflow-hidden"
              >
                <div className="p-4 space-y-2">
                  <p className="text-red-400 text-xs font-semibold uppercase tracking-wider">Authentication Error</p>
                  <p className="text-white/80 text-sm leading-relaxed">{error}</p>
                  {(error.includes('Domain Unauthorized') || error.includes('missing initial state')) && (
                    <div className="mt-3 p-3 bg-[#0a111e] rounded-xl border border-white/10 text-left">
                      <p className="text-[10px] text-momentum-accent font-bold uppercase tracking-wider mb-2">How to resolve Google Sign-In:</p>
                      {error.includes('Domain Unauthorized') ? (
                        <div className="space-y-2.5">
                          <p className="text-[11px] text-white/70 leading-relaxed">
                            Google blocklists unauthorized subdomains by default. To let Google Sign-In function perfectly inside your active development preview, you must register its hostname in your Firebase project:
                          </p>
                          <ol className="text-[11px] text-white/50 space-y-1.5 list-decimal ml-4">
                            <li>Open your <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-momentum-accent hover:underline inline-flex items-center gap-0.5">Firebase Console</a></li>
                            <li>Go to <strong className="text-white/80">Build &gt; Authentication &gt; Settings</strong> tab</li>
                            <li>Scroll down to <strong className="text-white/80">Authorized Domains</strong> list</li>
                            <li>Click <strong className="text-white/80">Add Domain</strong> and copy-paste this active hostname:</li>
                          </ol>
                          <div className="mt-2.5 flex items-center justify-between gap-2.5 bg-black/40 border border-white/5 rounded-xl px-3.1 py-2">
                            <code className="text-xs text-momentum-accent-light font-mono truncate select-all">{window.location.hostname}</code>
                            <button
                              type="button"
                              onClick={() => handleCopy(window.location.hostname)}
                              className="flex-shrink-0 text-momentum-text-dim hover:text-white transition-colors p-1"
                              title="Copy Hostname"
                            >
                              {copiedText === window.location.hostname ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          <p className="text-[10px] text-momentum-text-dim leading-snug">
                            💡 <strong>Tip:</strong> You must repeat these steps to register your production Vercel domains when importing/deploying!
                          </p>
                        </div>
                      ) : (
                        <ol className="text-[11px] text-white/60 space-y-1 list-decimal ml-4">
                          <li>Ensure cookies are enabled in phone settings</li>
                          <li>Try using Email/Password if Google check fails</li>
                          <li>WebView storage may be restricted by the device</li>
                        </ol>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-momentum-accent hover:bg-momentum-accent-light text-white rounded-2xl py-4 font-bold transition-all shadow-[0_10px_20px_theme('colors.momentum-accent-glow')] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Access Momentum' : 'Create Architecture')}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="h-px flex-1 bg-white/5"></div>
          <span className="text-[10px] text-momentum-text-dim uppercase tracking-widest font-bold">OR</span>
          <div className="h-px flex-1 bg-white/5"></div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl py-4 px-6 text-sm font-medium transition-all active:scale-[0.98]"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Authorize via Google
        </button>

        <button 
          onClick={handleGuestSignIn}
          disabled={loading}
          className="w-full mt-3 flex items-center justify-center gap-2 bg-[#121c2f] hover:bg-[#1e293b] border border-momentum-accent/20 hover:border-momentum-accent/40 text-momentum-accent-light rounded-2xl py-4 px-6 text-sm font-bold transition-all active:scale-[0.98] shadow-lg shadow-momentum-accent/5"
        >
          <span>✨</span> Instant Guest Sign-In (Skip Auth)
        </button>

        <div className="mt-8 text-center bg-white/5 p-4 rounded-2xl border border-white/5">
          <p className="text-[10px] text-momentum-text-dim uppercase tracking-wider mb-2">
            {isLogin ? "New user?" : "Existing user?"}
          </p>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-momentum-accent hover:text-white transition-colors font-bold"
          >
            {isLogin ? "Switch to Registry" : "Switch to Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
