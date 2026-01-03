
import React, { useState } from 'react';
import { 
  Grid, Type, Download, ChevronRight
} from 'lucide-react';
import { MOCK_ICONS, MOCK_FONTS } from '../constants';
import AssetCard from '../components/AssetCard';

const CreativeAssets: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'icons' | 'fonts'>('icons');
  const [fontPreviewText, setFontPreviewText] = useState("The quick brown fox jumps over the lazy dog");

  return (
    <div className="h-full flex flex-col bg-[#0d0b14] overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex p-2 bg-[#161321] border-b border-white/5 mx-5 mt-4 rounded-2xl">
        <button 
          onClick={() => setActiveTab('icons')}
          className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'icons' ? 'bg-[#8b5cf6] text-white shadow-lg shadow-purple-500/20' : 'text-gray-500 hover:text-white'}`}
        >
          <Grid size={14} /> Icons
        </button>
        <button 
          onClick={() => setActiveTab('fonts')}
          className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'fonts' ? 'bg-[#8b5cf6] text-white shadow-lg shadow-purple-500/20' : 'text-gray-500 hover:text-white'}`}
        >
          <Type size={14} /> Fonts
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {activeTab === 'icons' && (
          <div className="p-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6">
              <h2 className="text-xl font-bold">Icon Gallery</h2>
              <p className="text-gray-400 text-xs">Curated sets for every launcher.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {MOCK_ICONS.map(icon => (
                <AssetCard key={icon.id} asset={icon} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'fonts' && (
          <div className="p-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6 space-y-4">
              <div>
                <h2 className="text-xl font-bold">Typography</h2>
                <p className="text-gray-400 text-xs">Premium typefaces for your UI.</p>
              </div>
              <div className="relative">
                <input 
                  type="text"
                  value={fontPreviewText}
                  onChange={(e) => setFontPreviewText(e.target.value)}
                  placeholder="Type to preview fonts..."
                  className="w-full bg-[#161321] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>
            </div>
            <div className="space-y-4">
              {MOCK_FONTS.map(font => (
                <div key={font.id} className="p-6 bg-[#161321] rounded-2xl border border-white/5 group hover:border-purple-500/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="text-white font-bold">{font.name}</h3>
                      <p className="text-[10px] text-gray-500 font-medium">by {font.author}</p>
                    </div>
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                  <p className="text-2xl break-words" style={{ fontFamily: font.family }}>
                    {fontPreviewText}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[9px] text-gray-600">Sample preview</span>
                    <button className="text-[10px] font-black text-purple-400 uppercase tracking-tighter flex items-center gap-1">
                      Quick Install <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativeAssets;
