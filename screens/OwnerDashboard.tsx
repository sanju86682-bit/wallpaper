
import React, { useState, useRef } from 'react';
import { 
  ImageIcon, Layout as LayoutIcon, Type, Grid, 
  Trash2, Plus, Edit3, X, ShieldCheck, Search,
  PlusCircle, FolderPlus, Save, AlertCircle,
  Upload, Link as LinkIcon, FileImage, Check, ArrowRight
} from 'lucide-react';
import { AppTab, Asset } from '../types';
import { MOCK_WALLPAPERS, MOCK_THEMES, MOCK_FONTS, MOCK_ICONS } from '../constants';

interface OwnerDashboardProps {
  onNavigate: (tab: AppTab) => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onNavigate }) => {
  const [contentCategory, setContentCategory] = useState<'wallpapers' | 'themes' | 'fonts' | 'icons'>('wallpapers');
  
  // Internal CMS State - Initialized from Mocks
  const [wallpapers, setWallpapers] = useState(MOCK_WALLPAPERS);
  const [themes, setThemes] = useState(MOCK_THEMES);
  const [fonts, setFonts] = useState(MOCK_FONTS);
  const [icons, setIcons] = useState(MOCK_ICONS);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [newItem, setNewItem] = useState({ title: '', author: '', image: '', tags: '' });
  const [uploadType, setUploadType] = useState<'url' | 'file'>('url');
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemove = (id: string) => {
    if (!window.confirm("Permanent Delete? This action cannot be reversed.")) return;
    
    if (contentCategory === 'wallpapers') setWallpapers(prev => prev.filter(w => w.id !== id));
    else if (contentCategory === 'themes') setThemes(prev => prev.filter(t => t.id !== id));
    else if (contentCategory === 'fonts') setFonts(prev => prev.filter(f => f.id !== id));
    else setIcons(prev => prev.filter(i => i.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (editingItem) {
          setEditingItem({ ...editingItem, image: base64String });
        } else {
          setNewItem({ ...newItem, image: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = () => {
    if (!newItem.title.trim()) {
      alert("Please provide a title.");
      return;
    }
    
    const baseItem = { 
      id: `owner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
      ...newItem, 
      tags: newItem.tags ? newItem.tags.split(',').map(t => t.trim()).filter(t => t !== "") : [],
      image: newItem.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200' 
    };
    
    if (contentCategory === 'wallpapers') setWallpapers(prev => [baseItem as Asset, ...prev]);
    else if (contentCategory === 'themes') setThemes(prev => [baseItem as Asset, ...prev]);
    else if (contentCategory === 'fonts') setFonts(prev => [baseItem as any, ...prev]);
    else setIcons(prev => [baseItem as Asset, ...prev]);
    
    setShowAddModal(false);
    setNewItem({ title: '', author: '', image: '', tags: '' });
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    
    if (contentCategory === 'wallpapers') setWallpapers(prev => prev.map(w => w.id === editingItem.id ? editingItem : w));
    else if (contentCategory === 'themes') setThemes(prev => prev.map(t => t.id === editingItem.id ? editingItem : t));
    else if (contentCategory === 'fonts') setFonts(prev => prev.map(f => f.id === editingItem.id ? editingItem : f));
    else setIcons(prev => prev.map(i => i.id === editingItem.id ? editingItem : i));
    
    setEditingItem(null);
  };

  const getActiveList = () => {
    let list: any[] = [];
    if (contentCategory === 'wallpapers') list = wallpapers;
    else if (contentCategory === 'themes') list = themes;
    else if (contentCategory === 'fonts') list = fonts;
    else list = icons;

    return list.filter(item => 
      (item.title || item.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#0d0b14] overflow-hidden">
      {/* CMS Header - Mobile Optimized */}
      <div className="px-5 pt-8 pb-4 shrink-0 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white">STUDIO CMS</h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={14} className="text-purple-400" /> Administrative Console
            </p>
          </div>
          <button 
            onClick={() => onNavigate(AppTab.HOME)} 
            className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white border border-white/5 active:scale-90 transition-transform"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-5 mb-4 shrink-0 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 p-1.5 bg-[#161321] rounded-2xl border border-white/5 min-w-max">
          {[
            { id: 'wallpapers', icon: <ImageIcon size={14} />, label: 'Walls' },
            { id: 'themes', icon: <LayoutIcon size={14} />, label: 'Themes' },
            { id: 'fonts', icon: <Type size={14} />, label: 'Fonts' },
            { id: 'icons', icon: <Grid size={14} />, label: 'Icons' }
          ].map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setContentCategory(cat.id as any)} 
              className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${contentCategory === cat.id ? 'bg-[#8b5cf6] text-white shadow-lg' : 'text-gray-500'}`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Global Actions */}
      <div className="px-5 mb-6 flex gap-3 shrink-0">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            placeholder={`Filter ${contentCategory}...`} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161321] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500/30 text-white" 
          />
        </div>
        <button 
          onClick={() => {
            setEditingItem(null);
            setUploadType('url');
            setNewItem({ title: '', author: '', image: '', tags: '' });
            setShowAddModal(true);
          }}
          className="aspect-square w-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Asset List Scroll Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-40">
        <div className="grid grid-cols-1 gap-3">
          {getActiveList().map((item) => (
            <div key={item.id} className="bg-[#1c1a26] p-3 rounded-[2rem] border border-white/5 flex items-center gap-4 group hover:bg-[#221f2e] transition-colors">
               <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-black/40">
                  <img 
                    src={item.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200'} 
                    className="w-full h-full object-cover" 
                    alt={item.title || item.name} 
                    onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1614027126733-75768163dd34?auto=format&fit=crop&q=80&w=200'; }}
                  />
               </div>
               <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{item.title || item.name}</h4>
                  <p className="text-[9px] text-gray-500 font-mono tracking-tighter truncate opacity-60">ID: {item.id}</p>
               </div>
               <div className="flex gap-1 pr-1">
                  <button 
                    onClick={() => {
                      setEditingItem(item);
                      setUploadType(item.image?.startsWith('data:') ? 'file' : 'url');
                    }}
                    className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white active:scale-90 transition-all"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => handleRemove(item.id)} 
                    className="p-3 bg-red-500/10 rounded-xl text-red-400 hover:bg-red-500/20 active:scale-90 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
               </div>
            </div>
          ))}

          {getActiveList().length === 0 && (
            <div className="py-24 text-center flex flex-col items-center gap-5">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-gray-700">
                 <AlertCircle size={40} />
              </div>
              <div>
                 <p className="text-white text-sm font-bold">No assets found</p>
                 <p className="text-gray-500 text-[10px] mt-1 font-medium uppercase tracking-widest">Adjust filters or add new content</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Unified Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => { setShowAddModal(false); setEditingItem(null); }}></div>
          <div className="relative w-full max-w-sm bg-[#1c1a26] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-200 overflow-y-auto max-h-[85vh] no-scrollbar">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                   {editingItem ? <Edit3 size={24} /> : <PlusCircle size={24} />}
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                    {editingItem ? 'Edit Asset' : `Upload ${contentCategory.slice(0, -1)}`}
                  </h2>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Live Content Sync</p>
                </div>
             </div>

             <div className="space-y-6">
                {/* Text Fields */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Display Title</label>
                     <input 
                       placeholder="Enter Name" 
                       value={editingItem ? (editingItem.title || editingItem.name) : newItem.title} 
                       onChange={e => editingItem ? setEditingItem({...editingItem, title: e.target.value, name: e.target.value}) : setNewItem({...newItem, title: e.target.value})} 
                       className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-white" 
                     />
                  </div>
                  
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Creator / Author</label>
                     <input 
                       placeholder="Wally Studio" 
                       value={editingItem ? editingItem.author : newItem.author} 
                       onChange={e => editingItem ? setEditingItem({...editingItem, author: e.target.value}) : setNewItem({...newItem, author: e.target.value})} 
                       className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-white" 
                     />
                  </div>
                </div>

                {/* Source Selection Toggle */}
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Source Selection</label>
                   <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                      <button 
                        onClick={() => setUploadType('url')}
                        className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${uploadType === 'url' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                         <LinkIcon size={14} /> URL
                      </button>
                      <button 
                        onClick={() => setUploadType('file')}
                        className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${uploadType === 'file' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                         <Upload size={14} /> Local
                      </button>
                   </div>
                </div>

                {/* Media Input Area */}
                <div className="space-y-2">
                   {uploadType === 'url' ? (
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Remote Link</label>
                        <input 
                          placeholder="https://images.unsplash.com/..." 
                          value={editingItem ? editingItem.image : newItem.image} 
                          onChange={e => editingItem ? setEditingItem({...editingItem, image: e.target.value}) : setNewItem({...newItem, image: e.target.value})} 
                          className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500/50 font-mono text-purple-400" 
                        />
                     </div>
                   ) : (
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">File Upload</label>
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full aspect-video rounded-3xl border-2 border-dashed border-white/10 bg-black/30 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 transition-all overflow-hidden group"
                        >
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          {(editingItem?.image || newItem.image) ? (
                            <img 
                              src={editingItem ? editingItem.image : newItem.image} 
                              className="w-full h-full object-cover opacity-80" 
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-3 text-gray-600 group-hover:text-purple-400 transition-colors">
                               <div className="p-4 bg-white/5 rounded-2xl">
                                  <FileImage size={28} />
                               </div>
                               <span className="text-[10px] font-black uppercase tracking-widest">Select From Device</span>
                            </div>
                          )}
                          {(editingItem?.image || newItem.image) && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <span className="bg-black/70 backdrop-blur-md px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white border border-white/10 flex items-center gap-2">
                                 <Upload size={14} /> Replace File
                               </span>
                            </div>
                          )}
                        </div>
                     </div>
                   )}
                </div>

                {/* Secondary Meta */}
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Global Tags</label>
                   <input 
                     placeholder="Neon, Dark, AMOLED..." 
                     value={editingItem ? (editingItem.tags?.join(', ') || '') : newItem.tags} 
                     onChange={e => editingItem ? setEditingItem({...editingItem, tags: e.target.value.split(',').map(t => t.trim())}) : setNewItem({...newItem, tags: e.target.value})} 
                     className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-white" 
                   />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6">
                  <button 
                    onClick={() => { setShowAddModal(false); setEditingItem(null); }} 
                    className="flex-1 py-4.5 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 border border-white/5 active:scale-95 transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={editingItem ? handleUpdateItem : handleAddItem} 
                    className="flex-1 py-4.5 bg-purple-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Check size={16} /> {editingItem ? 'Save Edit' : 'Add Item'}
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Safety Alert Box */}
      <div className="fixed bottom-24 inset-x-5 py-5 px-6 bg-red-500/10 border border-red-500/20 rounded-3xl backdrop-blur-xl flex items-center gap-4">
         <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center text-red-400 shrink-0">
            <AlertCircle size={22} />
         </div>
         <p className="text-[10px] font-bold text-red-300 leading-tight">
           <span className="block text-xs uppercase font-black text-red-500 mb-0.5">Owner Notice</span>
           CMS mode is live. Any file added or deleted will reflect immediately in the storefront. User data access has been locked for security.
         </p>
      </div>
    </div>
  );
};

export default OwnerDashboard;
