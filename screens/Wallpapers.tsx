
import React, { useState } from 'react';
import { Sparkles, X, Smartphone, Monitor, Square, Check, Download } from 'lucide-react';
import { MOCK_WALLPAPERS } from '../constants';
import AssetCard from '../components/AssetCard';
import { generateImage } from '../services/geminiService';

interface WallpapersProps {
  searchQuery?: string;
}

const Wallpapers: React.FC<WallpapersProps> = ({ searchQuery = "" }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("9:16");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [showApplyToast, setShowApplyToast] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const categories = ["All", "Abstract", "Nature", "Minimal", "Cyberpunk", "AMOLED"];

  const filteredWallpapers = MOCK_WALLPAPERS.filter(w => {
    const matchesCategory = selectedCategory === "All" || w.tags?.includes(selectedCategory);
    const matchesSearch = searchQuery === "" || 
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      w.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedResult(null);
    setIsSaved(false);
    const result = await generateImage(`wallpaper: ${prompt}`, aspectRatio);
    setGeneratedResult(result);
    setIsGenerating(false);
  };

  const handleApply = () => {
    if (!generatedResult) return;
    const link = document.createElement('a');
    link.href = generatedResult;
    link.download = `wally-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowApplyToast(true);
    setTimeout(() => setShowApplyToast(false), 3000);
  };

  return (
    <div className="h-full overflow-y-auto pb-24 bg-[#0d0b14]">
      <div className="px-5 pt-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">Wallpapers</h1>
            <p className="text-gray-400 text-xs">High-res for all devices.</p>
          </div>
          <button 
            onClick={() => setIsAiPanelOpen(true)}
            className="w-10 h-10 bg-[#8b5cf6] text-white rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20"
          >
            <Sparkles size={20} />
          </button>
        </div>

        {/* Categories Scroll */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat 
                  ? 'bg-[#8b5cf6] text-white shadow-lg shadow-purple-500/20' 
                  : 'bg-[#161321] text-gray-400 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid - 2 Columns for Mobile */}
        <div className="grid grid-cols-2 gap-4">
          {!searchQuery && (
            <div 
              onClick={() => setIsAiPanelOpen(true)}
              className="aspect-[2/3] rounded-2xl border-2 border-dashed border-purple-500/30 bg-purple-500/5 flex flex-col items-center justify-center p-4 text-center cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#8b5cf6] flex items-center justify-center mb-3">
                <Sparkles className="text-white" size={20} />
              </div>
              <h3 className="text-white font-bold text-xs mb-1">Custom</h3>
              <span className="text-[#8b5cf6] text-[10px] font-bold uppercase">Generate</span>
            </div>
          )}

          {filteredWallpapers.length > 0 ? (
            filteredWallpapers.map(w => (
              <AssetCard key={w.id} asset={w} />
            ))
          ) : (
            <div className="col-span-2 py-20 text-center text-gray-600">No wallpapers match your search.</div>
          )}
        </div>
      </div>

      {/* Full-width Slide-over AI Panel for Mobile */}
      {isAiPanelOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAiPanelOpen(false)}></div>
          <div className="relative w-full h-full bg-[#110f1a] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#161321] shrink-0">
              <div className="flex items-center gap-3">
                <Sparkles className="text-[#8b5cf6]" size={20} />
                <h2 className="text-lg font-bold">Wally Assistant</h2>
              </div>
              <button onClick={() => setIsAiPanelOpen(false)} className="p-2 text-gray-500">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-8 no-scrollbar">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dimension</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "9:16", icon: <Smartphone size={16} />, label: "Mobile" },
                    { id: "16:9", icon: <Monitor size={16} />, label: "Desktop" },
                    { id: "1:1", icon: <Square size={16} />, label: "Square" }
                  ].map(dim => (
                    <button 
                      key={dim.id}
                      onClick={() => setAspectRatio(dim.id as any)}
                      className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${
                        aspectRatio === dim.id 
                          ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-white' 
                          : 'bg-[#1c1a26] border-white/5 text-gray-500'
                      }`}
                    >
                      {dim.icon}
                      <span className="text-[9px] font-bold mt-1">{dim.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Vision</label>
                <div className="relative">
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A neon galaxy or a minimalist mountain..."
                    className="w-full bg-[#161321] border border-white/5 rounded-2xl p-4 text-sm h-32 focus:outline-none"
                  />
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="absolute right-2 bottom-2 bg-[#8b5cf6] disabled:bg-gray-700 text-white px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    {isGenerating ? "Wait..." : "Create"}
                  </button>
                </div>
              </div>

              {generatedResult && (
                <div className="space-y-4 animate-in fade-in zoom-in">
                   <img src={generatedResult} alt="Generated" className="w-full rounded-2xl shadow-xl" />
                   <div className="grid grid-cols-1 gap-3">
                      <button 
                        onClick={handleApply}
                        className="w-full py-4 rounded-xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-purple-500/20"
                      >
                        Apply & Save
                      </button>
                      <button 
                        onClick={() => setIsSaved(true)}
                        className={`w-full py-4 rounded-xl border transition-all font-bold text-sm ${
                          isSaved ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-white'
                        }`}
                      >
                        {isSaved ? "Saved to Profile" : "Save to Profile"}
                      </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showApplyToast && (
        <div className="fixed top-10 left-5 right-5 z-[300] bg-[#161321] border border-green-500/30 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top">
           <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
             <Check size={16} />
           </div>
           <span className="font-bold text-white text-xs">Saved to your device!</span>
        </div>
      )}
    </div>
  );
};

export default Wallpapers;
