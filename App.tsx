
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Search, Bell, X, Home as HomeIcon, Image as ImageIcon, Layout as LayoutIcon, 
  Folder, MessageSquare, Trash2, CheckCircle2, Zap, Clock, Grid, ShieldCheck, Lock,
  AlertCircle
} from 'lucide-react';
import { AppTab } from './types';
import Home from './screens/Home';
import AIStudio from './screens/AIStudio';
import Wallpapers from './screens/Wallpapers';
import Themes from './screens/Themes';
import CreativeAssets from './screens/CreativeAssets';
import Profile from './screens/Profile';
import OwnerDashboard from './screens/OwnerDashboard';
import Login from './screens/Login';

const Logo: React.FC<{ color?: string }> = ({ color = "white" }) => (
  <svg viewBox="0 0 100 100" className="h-10 w-10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M20 30L35 75L50 45L65 75L80 30" 
      stroke={color} 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M75 15C75 15 76 22 82 23C76 24 75 31 75 31C75 31 74 24 68 23C74 22 75 15 75 15Z" 
      fill="#8b5cf6" 
    />
    <path 
      d="M75 15C75 15 76 22 82 23C76 24 75 31 75 31C75 31 74 24 68 23C74 22 75 15 75 15Z" 
      stroke={color} 
      strokeWidth="1.5"
    />
  </svg>
);

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'ai' | 'system' | 'update';
  unread: boolean;
}

export interface UserProfile {
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  isPro: boolean;
  isAdmin?: boolean;
  identity?: string; // Email or Phone used to login
}

const OWNER_IDENTITY_EMAIL = "sanju86682@gmail.com";
const OWNER_IDENTITY_PHONE = "9501941286";
const OWNER_PORTAL_PASSWORD = "Sanju900";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  
  const [appliedThemeColor, setAppliedThemeColor] = useState("#8b5cf6");
  const [appliedThemeBg, setAppliedThemeBg] = useState("#0d0b14");

  // Global Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "New Creator",
    handle: "creator",
    bio: "Digital Artist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    isPro: false,
    isAdmin: false,
    identity: ""
  });

  const handleLogin = (identity: string) => {
    const isAdmin = identity === OWNER_IDENTITY_EMAIL || identity === OWNER_IDENTITY_PHONE;
    setUserProfile(prev => ({
      ...prev,
      identity: identity,
      isAdmin: isAdmin,
      name: isAdmin ? "Sanju Owner" : "New Creator",
      handle: isAdmin ? "admin_sanju" : `user_${Date.now().toString().slice(-4)}`
    }));
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab(AppTab.HOME);
  };

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Welcome to Wally', description: 'Explore our AI-driven creative library.', time: 'Just now', type: 'system', unread: true },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleApplyTheme = (palette: string[], bgImage?: string) => {
    if (palette && palette.length > 0) {
      setAppliedThemeColor(palette[0]);
    }
  };

  const handleAdminRequest = () => {
    // Verification of identity happens first
    const isOwner = userProfile.identity === OWNER_IDENTITY_EMAIL || userProfile.identity === OWNER_IDENTITY_PHONE;
    
    if (!isOwner) {
      setShowAccessDenied(true);
      return;
    }

    setIsAuthModalOpen(true);
    setAuthError("");
    setPasswordInput("");
  };

  const handleAdminAuth = () => {
    if (passwordInput === OWNER_PORTAL_PASSWORD) {
      setIsAuthModalOpen(false);
      setActiveTab(AppTab.OWNER_DASHBOARD);
    } else {
      setAuthError("Incorrect key. Access denied.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.HOME:
        return <Home onNavigate={setActiveTab} searchQuery={searchQuery} />;
      case AppTab.WALLPAPERS:
        return <Wallpapers searchQuery={searchQuery} />;
      case AppTab.THEMES:
        return <Themes searchQuery={searchQuery} onApplyTheme={handleApplyTheme} />;
      case AppTab.AI_STUDIO:
        return <CreativeAssets />;
      case AppTab.PROFILE:
        return <Profile onNavigate={(tab) => tab === AppTab.OWNER_DASHBOARD ? handleAdminRequest() : setActiveTab(tab)} userProfile={userProfile} onUpdateProfile={setUserProfile} onLogout={handleLogout} />;
      case AppTab.OWNER_DASHBOARD:
        return <OwnerDashboard onNavigate={setActiveTab} />;
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen w-full text-white overflow-hidden transition-colors duration-700" style={{ backgroundColor: appliedThemeBg }}>
      {/* Mobile Top Header */}
      <header className="h-16 shrink-0 px-5 flex items-center justify-between border-b border-white/5 z-40 backdrop-blur-xl bg-black/20">
        {!isSearchActive ? (
          <>
            <div className="flex items-center gap-2">
              <Logo color="white" />
              <h1 className="text-xl font-black tracking-tighter text-white">Wally</h1>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleAdminRequest}
                className={`p-2 transition-colors ${activeTab === AppTab.OWNER_DASHBOARD ? 'text-purple-400' : 'text-gray-500 hover:text-white'}`}
              >
                <ShieldCheck size={22} />
              </button>
              <button onClick={() => setIsSearchActive(true)} className="text-gray-400 hover:text-white p-2">
                <Search size={22} />
              </button>
              <button onClick={() => setIsNotificationsOpen(true)} className="text-gray-400 hover:text-white p-2 relative">
                <Bell size={22} />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0d0b14]"></span>}
              </button>
              <button onClick={() => setActiveTab(AppTab.PROFILE)} className={`w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border overflow-hidden ml-1 transition-all ${activeTab === AppTab.PROFILE ? 'ring-2 ring-purple-500' : 'border-white/10'}`}>
                 <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover opacity-80" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center gap-3 animate-in fade-in slide-in-from-right duration-200">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input autoFocus type="text" placeholder="Search styles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none" style={{ borderColor: `${appliedThemeColor}33` }} />
            </div>
            <button onClick={() => { setIsSearchActive(false); setSearchQuery(""); }} className="text-gray-400 p-2"><X size={24} /></button>
          </div>
        )}
      </header>
      
      {/* Admin Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsAuthModalOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-[#1c1a26] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
             <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-4">
                   <Lock size={32} />
                </div>
                <h2 className="text-xl font-black mb-2 uppercase tracking-tighter">Owner Portal</h2>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">Please enter the master access key to continue.</p>
             </div>
             
             <div className="space-y-4">
                <div className="relative">
                   <input 
                     type="password"
                     value={passwordInput}
                     autoFocus
                     onChange={(e) => { setPasswordInput(e.target.value); setAuthError(""); }}
                     onKeyDown={(e) => e.key === 'Enter' && handleAdminAuth()}
                     placeholder="Access Key"
                     className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-center text-lg font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                   />
                </div>
                {authError && <p className="text-red-400 text-[10px] font-bold text-center uppercase tracking-widest animate-pulse">{authError}</p>}
                
                <div className="flex gap-3">
                  <button onClick={() => setIsAuthModalOpen(false)} className="flex-1 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 border border-white/5">Cancel</button>
                  <button onClick={handleAdminAuth} className="flex-1 py-4 bg-purple-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-purple-500/20">Verify</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Access Denied Error Message */}
      {showAccessDenied && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowAccessDenied(false)}></div>
          <div className="relative w-full max-w-sm bg-[#1c1a26] border border-red-500/20 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
             <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-4">
                   <AlertCircle size={32} />
                </div>
                <h2 className="text-xl font-black mb-2 uppercase tracking-tighter text-red-500">Access Denied</h2>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">Error: This is only for owner. Your account does not have administrative privileges.</p>
             </div>
             <button onClick={() => setShowAccessDenied(false)} className="w-full py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 border border-white/5">Close</button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>

      {/* Floating AI Chat Bot Button */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(139,92,246,0.5)] z-[60] active:scale-90 transition-transform border border-white/20"
      >
        <MessageSquare size={24} className="text-white" />
      </button>

      {/* AI Chatbot Overlay */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsChatOpen(false)}></div>
          <div className="relative mt-20 flex-1 bg-[#0d0b14] rounded-t-[3rem] border-t border-white/10 overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-500">
             <div className="p-6 flex justify-between items-center border-b border-white/5 bg-[#161321]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Sparkles size={20} className="text-purple-400" />
                  </div>
                  <h3 className="font-bold">Wally AI</h3>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-2 bg-white/5 rounded-full"><X size={24} /></button>
             </div>
             <div className="flex-1 overflow-hidden">
                <AIStudio />
             </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/40 backdrop-blur-2xl border-t border-white/5 px-6 flex items-center justify-between z-50">
        <button onClick={() => setActiveTab(AppTab.HOME)} className="flex flex-col items-center gap-1" style={{ color: activeTab === AppTab.HOME ? appliedThemeColor : '#6b7280' }}>
          <HomeIcon size={24} /><span className="text-[10px] font-bold uppercase">Home</span>
        </button>
        <button onClick={() => setActiveTab(AppTab.WALLPAPERS)} className="flex flex-col items-center gap-1" style={{ color: activeTab === AppTab.WALLPAPERS ? appliedThemeColor : '#6b7280' }}>
          <ImageIcon size={24} /><span className="text-[10px] font-bold uppercase">Walls</span>
        </button>
        <button onClick={() => setActiveTab(AppTab.AI_STUDIO)} className={`flex flex-col items-center justify-center -translate-y-5 w-16 h-16 rounded-full shadow-2xl transition-all ring-4 ring-[#0d0b14]`} style={{ backgroundColor: activeTab === AppTab.AI_STUDIO ? appliedThemeColor : '#1c1a26', color: activeTab === AppTab.AI_STUDIO ? 'white' : appliedThemeColor }}>
          <Grid size={28} />
        </button>
        <button onClick={() => setActiveTab(AppTab.THEMES)} className="flex flex-col items-center gap-1" style={{ color: activeTab === AppTab.THEMES ? appliedThemeColor : '#6b7280' }}>
          <LayoutIcon size={24} /><span className="text-[10px] font-bold uppercase">Themes</span>
        </button>
        <button onClick={() => setActiveTab(AppTab.PROFILE)} className="flex flex-col items-center gap-1" style={{ color: activeTab === AppTab.PROFILE ? appliedThemeColor : '#6b7280' }}>
          <Folder size={24} /><span className="text-[10px] font-bold uppercase">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
