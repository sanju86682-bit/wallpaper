
import React, { useState, useEffect } from 'react';
import { Sparkles, X, Smartphone, Tablet, Layout, Zap, Check, Search, Info, Clock, Grid as GridIcon, Palette, Smartphone as PhoneIcon, Monitor, Download, Bookmark, Layers } from 'lucide-react';
import { MOCK_THEMES } from '../constants';
import AssetCard from '../components/AssetCard';
import { generateImage, chatWithWally } from '../services/geminiService';

interface ThemesProps {
  searchQuery?: string;
  onApplyTheme?: (palette: string[], bgImage?: string) => void;
}

const Themes: React.FC<ThemesProps> = ({ searchQuery = "", onApplyTheme }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  
  // Architect State
  const [modelSearch, setModelSearch] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [savedThemes, setSavedThemes] = useState<any[]>([]);
  
  const [themeResult, setThemeResult] = useState<{
    lockScreen: string;
    homeScreen: string;
    iconPack: string;
    palette: string[];
    description: string;
    style: string;
    targetModel: string;
    aspectRatio: string;
  } | null>(null);

  // Load saved themes from storage for offline capability
  useEffect(() => {
    const stored = localStorage.getItem('wally_saved_themes');
    if (stored) {
      try {
        setSavedThemes(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved themes");
      }
    }
  }, []);

  const categories = ["All", "Futuristic", "Minimal", "Nature", "Material", "Saved"];

  const filteredThemes = selectedCategory === "Saved" 
    ? savedThemes 
    : MOCK_THEMES.filter(t => {
        const matchesCategory = selectedCategory === "All" || t.tags?.includes(selectedCategory);
        const matchesSearch = searchQuery === "" || 
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          t.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      });

  const handleGenerateTheme = async () => {
    if (!prompt.trim() || !modelSearch.trim()) return;
    setIsGenerating(true);
    setThemeResult(null);

    try {
      // 1. Ask AI to identify device specs
      const specPrompt = `Identify device: "${modelSearch}". Return aspect ratio (9:16 or 4:3) and a 4-color hex palette that matches a "${prompt}" aesthetic. Format: RATIO|COLOR1,COLOR2,COLOR3,COLOR4`;
      const specData = await chatWithWally(specPrompt);
      const [ratioPart, palettePart] = specData.split('|');
      const ratio: any = ratioPart?.includes('4:3') ? '4:3' : '9:16';
      const palette = palettePart?.split(',') || ["#8b5cf6", "#3b82f6", "#ec4899", "#10b981"];

      // 2. Generate Assets
      const lockImg = await generateImage(
        `Lock Screen wallpaper for ${modelSearch}, ${prompt} style, focus on upper composition`, 
        ratio
      );

      const homeImg = await generateImage(
        `Home Screen wallpaper for ${modelSearch}, matching ${prompt} theme, minimalist for icons`, 
        ratio
      );

      const iconsImg = await generateImage(
        `A pack of 4 minimalist mobile app icons for Phone, Mail, Camera, Browser, matching ${prompt} theme, on a grid`, 
        "1:1"
      );

      if (lockImg && homeImg && iconsImg) {
        setThemeResult({
          lockScreen: lockImg,
          homeScreen: homeImg,
          iconPack: iconsImg,
          palette: palette.map(p => p.trim()),
          description: `Personalized ${prompt} theme for ${modelSearch}.`,
          style: prompt.split(' ').slice(0, 2).join(' ') + " Luxe",
          targetModel: modelSearch,
          aspectRatio: ratio
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (themeResult && onApplyTheme) {
      onApplyTheme(themeResult.palette, themeResult.homeScreen);
      // Visual feedback
      alert(`Applied ${themeResult.style} theme to your device!`);
      setIsAiPanelOpen(false);
    }
  };

  const handleSaveToProfile = () => {
    if (!themeResult) return;
    
    const newTheme = {
      id: `saved-${Date.now()}`,
      title: themeResult.style,
      author: 'You',
      image: themeResult.homeScreen, // Using home screen as preview
      lockScreen: themeResult.lockScreen,
      iconPack: themeResult.iconPack,
      palette: themeResult.palette,
      tags: ['Saved', 'Custom'],
      type: 'theme',
      isPro: false,
      targetModel: themeResult.targetModel,
      timestamp: new Date().toISOString()
    };

    const updated = [newTheme, ...savedThemes];
    setSavedThemes(updated);
    localStorage.setItem('wally_saved_themes', JSON.stringify(updated));
    
    // Trigger download of the main wallpaper for real 'save' feeling
    const link = document.createElement('a');
    link.href = themeResult.homeScreen;
    link.download = `${themeResult.style}-Wally.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="h-full overflow-y-auto pb-24 bg-[#0d0b14]">
      <div className="px-5 pt-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1 text-white">Themes</h1>
            <p className="text-gray-400 text-xs font-medium">Custom looks for your device.</p>
          </div>
          <button 
            onClick={() => setIsAiPanelOpen(true)}
            className="w-12 h-12 bg-gradient-to-tr from-[#8b5cf6] to-[#7c3aed] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 active:scale-95 transition-transform"
          >
            <Zap size={24} fill="white" />
          </button>
        </div>

        {/* Categories Scroll */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat ? 'bg-[#8b5cf6] text-white shadow-md' : 'bg-[#161321] text-gray-500 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredThemes.length > 0 ? (
            filteredThemes.map(theme => (
              <AssetCard key={theme.id} asset={theme} />
            ))
          ) : (
            <div className="py-20 text-center">
              <Layers size={48} className="mx-auto text-gray-700 mb-4 opacity-20" />
              <p className="text-gray-600">No themes found in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Theme Architect Panel */}
      {isAiPanelOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsAiPanelOpen(false)}></div>
          <div className="relative w-full h-full bg-[#0d0b14] flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="p-5 flex justify-between items-center border-b border-white/5 bg-[#110f1a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                  <Layout className="text-purple-400" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Theme Architect</h2>
                  <p className="text-[9px] text-purple-400 font-bold uppercase tracking-widest">Model & Icon Precision</p>
                </div>
              </div>
              <button onClick={() => setIsAiPanelOpen(false)} className="p-2 text-gray-500 active:bg-white/5 rounded-full">
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-8 no-scrollbar pb-32">
              {/* Step 1: Model Detection */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <PhoneIcon size={12} /> Search Your Device
                </label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text"
                    value={modelSearch}
                    onChange={(e) => setModelSearch(e.target.value)}
                    placeholder="e.g. iPhone 15, OnePlus 12, Pixel..."
                    className="w-full bg-[#161321] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>
              </div>

              {/* Step 2: Vibe Definition */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={12} /> Design Vision
                </label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your aesthetic... (e.g. Dreamy pastel clouds with neon outlines)"
                  className="w-full bg-[#161321] border border-white/10 rounded-2xl p-5 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none"
                />
              </div>

              {/* Action Button */}
              <button 
                onClick={handleGenerateTheme}
                disabled={isGenerating || !prompt.trim() || !modelSearch.trim()}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm shadow-xl shadow-purple-500/20 disabled:from-gray-800 disabled:to-gray-900 disabled:text-gray-500 flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Crafting Theme...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Architect My Theme
                  </>
                )}
              </button>

              {/* Result Preview Gallery */}
              {themeResult && (
                <div className="space-y-6 animate-in fade-in zoom-in duration-700">
                   <div className="flex justify-between items-end">
                      <h3 className="text-lg font-bold">{themeResult.style}</h3>
                      <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2">
                        <span className="text-[10px] text-purple-400 font-bold uppercase">{themeResult.targetModel}</span>
                      </div>
                   </div>

                   {/* Horizontal Gallery */}
                   <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x pb-4">
                      {/* Lock Screen */}
                      <div className="min-w-[75%] snap-center relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                         <img src={themeResult.lockScreen} alt="Lock Screen" className="w-full h-auto" />
                         <div className="absolute inset-0 bg-black/20"></div>
                         <div className="absolute top-[12%] inset-x-0 flex flex-col items-center">
                            <h4 className="text-5xl font-extralight text-white/90">09:41</h4>
                            <p className="text-sm font-medium text-white/70">Thursday, Oct 12</p>
                         </div>
                         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-xl px-4 py-1.5 rounded-full text-[9px] font-bold text-white uppercase tracking-widest border border-white/10">
                           Lock Screen
                         </div>
                      </div>

                      {/* Home Screen */}
                      <div className="min-w-[75%] snap-center relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                         <img src={themeResult.homeScreen} alt="Home Screen" className="w-full h-auto" />
                         <div className="absolute inset-0 bg-black/10"></div>
                         {/* Dock */}
                         <div className="absolute bottom-6 inset-x-4 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] p-3 border border-white/20 flex justify-between px-6">
                             {[1,2,3,4].map(i => (
                               <div key={i} className="w-10 h-10 rounded-2xl bg-white/20 shadow-lg border border-white/10 overflow-hidden">
                                 <img src={themeResult.iconPack} className="w-full h-full object-cover scale-150 grayscale-[0.2]" alt="icon" />
                               </div>
                             ))}
                         </div>
                         <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-xl px-4 py-1.5 rounded-full text-[9px] font-bold text-white uppercase tracking-widest border border-white/10">
                           Home Screen
                         </div>
                      </div>

                      {/* Icon Pack Preview */}
                      <div className="min-w-[75%] snap-center relative rounded-3xl bg-[#1c1a26] border border-white/10 flex flex-col items-center justify-center p-8 space-y-6">
                         <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Custom Icon Pack</h4>
                         <div className="grid grid-cols-2 gap-6 w-full max-w-[200px]">
                           {[1,2,3,4].map(i => (
                              <div key={i} className="aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                                 <img src={themeResult.iconPack} className="w-full h-full object-cover" alt="Pack" />
                              </div>
                           ))}
                         </div>
                         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-xl px-4 py-1.5 rounded-full text-[9px] font-bold text-white uppercase tracking-widest border border-white/10">
                           Icon Elements
                         </div>
                      </div>
                   </div>

                   {/* Controls */}
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={handleApply}
                        className="py-4 bg-[#8b5cf6] text-white rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2"
                      >
                        <Layout size={18} /> Apply Theme
                      </button>
                      <button 
                        onClick={handleSaveToProfile}
                        className="py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                      >
                        <Bookmark size={18} /> Save to Profile
                      </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showSavedToast && (
        <div className="fixed top-20 inset-x-5 z-[300] bg-[#161321] border border-green-500/30 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
           <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
             <Check size={16} />
           </div>
           <span className="font-bold text-white text-xs">Saved & Pack Downloaded!</span>
        </div>
      )}
    </div>
  );
};

export default Themes;
