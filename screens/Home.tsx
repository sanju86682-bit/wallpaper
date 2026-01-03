
import React, { useMemo } from 'react';
import { Sparkles, ChevronRight, Search as SearchIcon } from 'lucide-react';
import { MOCK_WALLPAPERS, MOCK_ICONS } from '../constants';
import AssetCard from '../components/AssetCard';
import { AppTab } from '../types';

interface HomeProps {
  onNavigate: (tab: AppTab) => void;
  searchQuery?: string;
}

const Home: React.FC<HomeProps> = ({ onNavigate, searchQuery = "" }) => {
  const categories = ["Trending", "Abstract", "AMOLED", "Nature", "Geometric", "Minimal"];

  const filteredWallpapers = MOCK_WALLPAPERS.filter(w => 
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredIcons = MOCK_ICONS.filter(i => 
    i.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSearching = searchQuery.length > 0;

  // Generate random particles for the live animation
  const particles = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 40 + 20}px`,
      duration: `${Math.random() * 5 + 3}s`,
      delay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.4 + 0.1
    }));
  }, []);

  return (
    <div className="h-full overflow-y-auto pb-24 no-scrollbar">
      <div className="px-5 pt-6">
        {!isSearching ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-1">Hey, Creator</h1>
              <p className="text-gray-400 text-xs font-medium">Pick your style for today.</p>
            </div>

            {/* Hero Banner with Live Animation */}
            <div className="relative h-60 rounded-[2.5rem] overflow-hidden mb-8 group">
              {/* Base Image */}
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800" 
                alt="Hero" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0d0b14] via-[#0d0b14]/40 to-transparent"></div>

              {/* Live Particles Animation Layer */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {particles.map(p => (
                  <div 
                    key={p.id}
                    className="absolute rounded-full bg-purple-500 blur-2xl animate-pulse"
                    style={{
                      left: p.left,
                      top: p.top,
                      width: p.size,
                      height: p.size,
                      opacity: p.opacity,
                      animationDuration: p.duration,
                      animationDelay: p.delay,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                ))}
              </div>

              {/* Animated Floating Glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/30 blur-[60px] animate-pulse rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/20 blur-[60px] animate-pulse rounded-full" style={{ animationDelay: '1s' }}></div>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
                  <span className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-white/10 text-white">
                    Live AI Engine
                  </span>
                </div>
                <h2 className="text-3xl font-black mb-4 max-w-[90%] leading-[1.1] tracking-tight">
                  Design your <span className="text-purple-400">digital reality</span>
                </h2>
                <button 
                  onClick={() => onNavigate(AppTab.AI_STUDIO)}
                  className="w-fit bg-white text-black px-6 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-2xl hover:bg-purple-50 transition-colors active:scale-95"
                >
                  <Sparkles size={14} className="text-purple-600" /> Start Creating
                </button>
              </div>
            </div>

            {/* Categories - Horizontal Scroll */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((cat, i) => (
                <button 
                  key={cat} 
                  className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-[11px] font-bold transition-all ${
                    i === 0 ? 'bg-[#8b5cf6] text-white shadow-lg shadow-purple-500/20' : 'bg-[#161321] text-gray-400 border border-white/5 hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-1">Search Results</h2>
            <p className="text-gray-400 text-xs font-medium">Found in our infinite library for "{searchQuery}"</p>
          </div>
        )}

        {/* Trending Wallpapers / Search Results */}
        <div className="mb-10">
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-lg font-bold">{isSearching ? 'Wallpapers' : 'Trending Now'}</h3>
            {!isSearching && (
              <button 
                onClick={() => onNavigate(AppTab.WALLPAPERS)}
                className="text-purple-400 text-[10px] font-black flex items-center gap-1 uppercase tracking-widest hover:translate-x-1 transition-transform"
              >
                Explore All <ChevronRight size={12} />
              </button>
            )}
          </div>
          {filteredWallpapers.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredWallpapers.slice(0, isSearching ? undefined : 4).map(w => (
                <AssetCard key={w.id} asset={w} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-[#161321] rounded-3xl border border-dashed border-white/5">
              <p className="text-gray-600 text-sm font-medium">Nothing found. Try "Ocean" or "Neon".</p>
            </div>
          )}
        </div>

        {/* Fresh Icons / Search Results */}
        <div className="pb-8">
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-lg font-bold">{isSearching ? 'Icons' : 'Latest Icon Packs'}</h3>
            {!isSearching && (
              <button className="text-purple-400 text-[10px] font-black flex items-center gap-1 uppercase tracking-widest hover:translate-x-1 transition-transform">
                View All <ChevronRight size={12} />
              </button>
            )}
          </div>
          {filteredIcons.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredIcons.map(i => (
                <AssetCard key={i.id} asset={i} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-[#161321] rounded-3xl border border-dashed border-white/5">
              <p className="text-gray-600 text-sm font-medium">No icons match this search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
