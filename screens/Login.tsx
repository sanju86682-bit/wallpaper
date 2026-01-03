
import React, { useState } from 'react';
import { Mail, Phone, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface LoginProps {
  onLogin: (identity: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;
    
    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      onLogin(value);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="h-screen w-full bg-[#0d0b14] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-sm relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-[2rem] flex items-center justify-center shadow-2xl mb-6 ring-4 ring-white/5">
             <Sparkles size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2">WALLY STUDIO</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Digital Reality Architect</p>
        </div>

        <div className="bg-[#1c1a26] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
          <div className="flex gap-2 p-1 bg-black/40 rounded-2xl mb-8">
            <button 
              onClick={() => { setMethod('email'); setValue(''); }}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'email' ? 'bg-[#8b5cf6] text-white' : 'text-gray-500'}`}
            >
              Email
            </button>
            <button 
              onClick={() => { setMethod('phone'); setValue(''); }}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'phone' ? 'bg-[#8b5cf6] text-white' : 'text-gray-500'}`}
            >
              Phone
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                {method === 'email' ? <Mail size={12} /> : <Phone size={12} />} 
                {method === 'email' ? 'Gmail Address' : 'Phone Number'}
              </label>
              <input 
                type={method === 'email' ? 'email' : 'tel'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={method === 'email' ? 'your@gmail.com' : '95019XXXXX'}
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading || !value}
              className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-50 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-xl shadow-purple-500/20 transition-all active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Enter Studio <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 opacity-30">
            <ShieldCheck size={14} />
            <span className="text-[8px] font-bold uppercase tracking-widest">Secure Multi-Modality Auth</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
