
import React, { useState } from 'react';
import { 
  Download, Heart, Sparkles, Edit3, ChevronRight, Plus, Grid, Layout, 
  Image as ImageIcon, X, Camera, AtSign, User, FileText, Settings, 
  Shield, Globe, Github, Twitter, Check, ShieldCheck, LogOut
} from 'lucide-react';
import { MOCK_WALLPAPERS } from '../constants';
import AssetCard from '../components/AssetCard';
import { AppTab } from '../types';
import { UserProfile } from '../App';

interface ProfileProps {
  onNavigate: (tab: AppTab) => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate, userProfile, onUpdateProfile, onLogout }) => {
  const [activeSubTab, setActiveSubTab] = useState('Recent');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>({ ...userProfile });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const stats = [
    { label: 'DOWNLOADS', value: '142', icon: <Download size={16} /> },
    { label: 'LIKES', value: '89', icon: <Heart size={16} /> },
    { label: 'AI CREATIONS', value: '56', icon: <Sparkles size={16} /> },
  ];

  const subTabs = ['Recent', 'Wallpapers', 'Themes', 'Icons'];

  const handleSave = () => {
    onUpdateProfile(editForm);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 1500);
  };

  const avatarStyles = [
    { seed: 'Alex', label: 'Classic' },
    { seed: 'Design', label: 'Creative' },
    { seed: 'Wally', label: 'Abstract' },
    { seed: 'Future', label: 'Tech' },
    { seed: 'Art', label: 'Painterly' },
    { seed: 'Zoe', label: 'Chic' },
  ];

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-32 bg-[#0d0b14]">
      {/* Profile Header */}
      <div className="px-5 pt-6">
        <div className="relative bg-[#1c1a26] rounded-[2.5rem] p-8 border border-white/5 overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-[#f3d1b3] border-4 border-[#2d2a3d] shadow-2xl shrink-0 overflow-hidden">
               <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white">{userProfile.name}</h1>
                {userProfile.isPro && (
                  <span className="bg-[#8b5cf6] text-white text-[9px] font-black px-2 py-0.5 rounded tracking-widest">PRO PLAN</span>
                )}
                {userProfile.isAdmin && (
                  <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded tracking-widest">OWNER</span>
                )}
              </div>
              <p className="text-gray-400 text-xs font-medium">@{userProfile.handle} • {userProfile.bio}</p>
              <p className="text-gray-600 text-[10px] mt-1 font-mono">{userProfile.identity}</p>
            </div>

            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                <Edit3 size={14} /> Edit Profile
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#1c1a26] p-5 rounded-3xl border border-white/5">
              <div className="text-2xl font-black text-white mb-2">{stat.value}</div>
              <div className="flex items-center gap-2 text-gray-500">
                <span className="text-purple-400">{stat.icon}</span>
                <span className="text-[9px] font-black tracking-widest uppercase">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sub-Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex bg-[#161321] p-1 rounded-xl border border-white/5">
            {subTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeSubTab === tab ? 'bg-[#8b5cf6] text-white shadow-lg shadow-purple-500/20' : 'text-gray-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="text-purple-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
            View All <ChevronRight size={14} />
          </button>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => onNavigate(AppTab.AI_STUDIO)}
            className="aspect-[2/3] rounded-[2rem] border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center p-6 text-center cursor-pointer group hover:border-purple-500/50 hover:bg-purple-500/5 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-[#8b5cf6] flex items-center justify-center text-purple-400 group-hover:text-white transition-all mb-4 shadow-xl">
              <Sparkles size={24} />
            </div>
            <h3 className="text-white font-bold text-sm mb-2">Create New</h3>
            <p className="text-gray-500 text-[10px] leading-relaxed">Use AI to generate a unique design</p>
          </div>
          {MOCK_WALLPAPERS.slice(0, 3).map(asset => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </div>

      {/* Edit Profile Overlay */}
      {isEditing && (
        <div className="fixed inset-0 z-[200] flex flex-col animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsEditing(false)}></div>
           
           <div className="relative mt-12 flex-1 bg-[#0d0b14] rounded-t-[3rem] border-t border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-[#161321]">
                <h2 className="text-lg font-black tracking-tighter text-white">STUDIO IDENTITY</h2>
                <button onClick={() => setIsEditing(false)} className="p-2 bg-white/5 rounded-full text-gray-500 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32">
                
                {/* Avatar Selection */}
                <div className="flex flex-col items-center gap-6">
                   <div className="relative group">
                     <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-tr from-[#8b5cf6] to-[#3b82f6] p-1 shadow-2xl overflow-hidden transition-transform group-hover:scale-105">
                        <img 
                          src={editForm.avatar} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-[1.8rem] bg-[#1c1a26]" 
                        />
                     </div>
                     <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center shadow-xl">
                       <Camera size={16} />
                     </div>
                   </div>

                   <div className="w-full">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block text-center">AI AVATAR GENES</label>
                     <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-2">
                        {avatarStyles.map((style) => (
                          <button 
                            key={style.seed}
                            onClick={() => setEditForm({...editForm, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${style.seed}`})}
                            className={`shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                              editForm.avatar.includes(style.seed) ? 'bg-purple-500/20 border-purple-500/50' : 'bg-[#161321] border-white/5'
                            }`}
                          >
                            <img 
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${style.seed}`} 
                              className="w-10 h-10 rounded-full bg-white/5" 
                              alt={style.label} 
                            />
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{style.label}</span>
                          </button>
                        ))}
                     </div>
                   </div>
                </div>

                {/* Primary Fields */}
                <div className="space-y-5">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <User size={12} className="text-purple-400" /> Full Name
                      </label>
                      <input 
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full bg-[#161321] border border-white/5 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-white font-medium"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <AtSign size={12} className="text-purple-400" /> Studio Handle
                      </label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 text-sm font-bold">@</span>
                        <input 
                          type="text"
                          value={editForm.handle}
                          onChange={(e) => setEditForm({...editForm, handle: e.target.value.replace(/\s+/g, '').toLowerCase()})}
                          className="w-full bg-[#161321] border border-white/5 rounded-2xl py-4 pl-9 pr-5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-white font-medium"
                        />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <FileText size={12} className="text-purple-400" /> Designer Bio
                      </label>
                      <textarea 
                        value={editForm.bio}
                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                        className="w-full bg-[#161321] border border-white/5 rounded-2xl p-5 text-sm h-28 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-white resize-none"
                      />
                   </div>
                </div>

                {/* Advanced Options Accordion */}
                <div className="border-t border-white/5 pt-6">
                   <button 
                     onClick={() => setShowAdvanced(!showAdvanced)}
                     className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10"
                   >
                     <div className="flex items-center gap-3">
                       <Settings size={18} className="text-gray-400" />
                       <span className="text-xs font-bold text-gray-300">Advanced App Settings</span>
                     </div>
                     <ChevronRight size={18} className={`text-gray-500 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
                   </button>

                   {showAdvanced && (
                     <div className="mt-4 p-4 space-y-6 bg-white/[0.02] rounded-2xl border border-white/5 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Shield size={16} className="text-purple-400" />
                            <div>
                              <p className="text-xs font-bold">Pro Status</p>
                              <p className="text-[9px] text-gray-500">Unlock premium studio assets</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setEditForm({...editForm, isPro: !editForm.isPro})}
                            className={`w-12 h-6 rounded-full transition-colors relative ${editForm.isPro ? 'bg-[#8b5cf6]' : 'bg-gray-700'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editForm.isPro ? 'right-1' : 'left-1'}`}></div>
                          </button>
                        </div>

                        {/* Direct Portal Link */}
                        <button 
                          onClick={() => {
                             setIsEditing(false);
                             onNavigate(AppTab.OWNER_DASHBOARD);
                          }}
                          className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-lg transition-all ${userProfile.isAdmin ? 'bg-purple-600 shadow-purple-500/20' : 'bg-gray-800 opacity-50'}`}
                        >
                          <ShieldCheck size={16} /> Enter Owner Portal
                        </button>

                        <div className="space-y-4">
                           <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Connect Portfolio</p>
                           <div className="grid grid-cols-2 gap-3">
                              <div className="relative">
                                <Twitter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input placeholder="X.com" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 text-[10px] focus:outline-none" />
                              </div>
                              <div className="relative">
                                <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input placeholder="Portfolio" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 text-[10px] focus:outline-none" />
                              </div>
                           </div>
                        </div>
                     </div>
                   )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#0d0b14] via-[#0d0b14] to-transparent">
                 <div className="flex gap-4">
                   <button 
                     onClick={() => setIsEditing(false)}
                     className="flex-1 py-4 bg-white/5 rounded-2xl text-xs font-bold text-gray-400 border border-white/5"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={handleSave}
                     className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 ${
                       saveSuccess ? 'bg-green-500 text-white' : 'bg-[#8b5cf6] text-white shadow-purple-500/20'
                     }`}
                   >
                     {saveSuccess ? <Check size={18} /> : 'Save Profile'}
                   </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
