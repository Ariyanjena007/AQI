import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, ShieldCheck, ArrowRight, HardDrive } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('ariyan@aq-intelligence.org');
  const [password, setPassword] = useState('sample-password');
  const [nodeToken, setNodeToken] = useState('UNO-Q-AUTH-9821');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4 py-12 transition-colors"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-mono font-bold text-base shadow-xs"
              style={{
                background: 'linear-gradient(135deg, var(--brand), var(--brand-hover))',
              }}
            >
              AQ
            </div>
          </Link>
          <h2
            className="text-2xl font-heading font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {isRegister ? 'Register Research Node' : 'Sign in to AQ Intelligence'}
          </h2>
          <p
            className="text-xs font-mono"
            style={{ color: 'var(--text-muted)' }}
          >
            Access real-time telemetry and edge predictive intelligence
          </p>
        </div>

        {/* Card */}
        <div
          className="border rounded-xl p-7 shadow-md transition-colors"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Tabs */}
          <div
            className="grid grid-cols-2 gap-1 p-1 rounded-lg border mb-6 text-xs font-mono"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <button
              onClick={() => setIsRegister(false)}
              className="py-2 rounded-md font-medium transition-colors"
              style={
                !isRegister
                  ? {
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      boxShadow: '0 1px 2px hsla(220, 30%, 10%, 0.1)',
                      fontWeight: 600,
                    }
                  : {
                      color: 'var(--text-muted)',
                    }
              }
            >
              Sign In
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className="py-2 rounded-md font-medium transition-colors"
              style={
                isRegister
                  ? {
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      boxShadow: '0 1px 2px hsla(220, 30%, 10%, 0.1)',
                      fontWeight: 600,
                    }
                  : {
                      color: 'var(--text-muted)',
                    }
              }
            >
              Register Node
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {isRegister && (
              <div>
                <label
                  className="block mb-1 uppercase tracking-wider text-[10px]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    defaultValue="Ariyan"
                    placeholder="Enter your name"
                    className="w-full pl-9 pr-3 py-2 border rounded focus:outline-hidden"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label
                className="block mb-1 uppercase tracking-wider text-[10px]"
                style={{ color: 'var(--text-muted)' }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@domain.org"
                  className="w-full pl-9 pr-3 py-2 border rounded focus:outline-hidden"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="block mb-1 uppercase tracking-wider text-[10px]"
                style={{ color: 'var(--text-muted)' }}
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passphrase"
                  className="w-full pl-9 pr-3 py-2 border rounded focus:outline-hidden"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  required
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label
                  className="block mb-1 uppercase tracking-wider text-[10px]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Hardware Pairing Token (Optional)
                </label>
                <div className="relative">
                  <HardDrive className="w-4 h-4 absolute left-3 top-2.5" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={nodeToken}
                    onChange={(e) => setNodeToken(e.target.value)}
                    placeholder="UNO-Q-XXXX-XXXX"
                    className="w-full pl-9 pr-3 py-2 border rounded focus:outline-hidden"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-2.5 rounded-md text-white text-xs font-semibold tracking-tight transition-all flex items-center justify-center gap-1.5 mono-btn-primary"
            >
              <span>{isRegister ? 'Register & Enter Dashboard' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Access */}
          <div
            className="mt-6 pt-5 border-t"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full py-2 px-3 rounded border border-dashed transition-all text-xs font-mono text-center flex items-center justify-center gap-2 hover:opacity-90"
              style={{
                borderColor: 'var(--brand)',
                color: 'var(--brand)',
                backgroundColor: 'var(--brand-subtle)',
              }}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>One-Click Demo Access as Ariyan</span>
            </button>
          </div>
        </div>

        {/* Security disclaimer */}
        <p
          className="text-center text-[11px] font-mono"
          style={{ color: 'var(--text-muted)' }}
        >
          Hardware node secrets are salted and verified via edge cryptographic chips.
        </p>

      </div>
    </div>
  );
};
