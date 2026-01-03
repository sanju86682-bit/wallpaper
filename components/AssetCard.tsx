
import React from 'react';
import { Asset } from '../types';
import { Heart, Star, Download, Play } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
  className?: string;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, className = '' }) => {
  const isWallpaper = asset.type === 'wallpaper';
  const isTheme = asset.type === 'theme';
  const isIcon = asset.type === 'icon';

  return (
    <div className={`group relative bg-[#1c1a26] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer ${className}`}>
      {/* Label Badges */}
      {asset.isPro && (
        <div className="absolute top-3 right-3 z-10 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider">
          PRO
        </div>
      )}
      {asset.title === 'Synthwave City' && (
        <div className="absolute top-3 left-3 z-10 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
          <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
          LIVE
        </div>
      )}
      {isWallpaper && asset.title === 'Liquid Dreams' && (
        <div className="absolute top-3 left-3 z-10 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white">
          4K
        </div>
      )}

      {/* Image Container */}
      <div className={`relative overflow-hidden ${isWallpaper ? 'aspect-[2/3]' : 'aspect-video'}`}>
        <img 
          src={asset.image} 
          alt={asset.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
           {isTheme ? (
             <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                Apply Theme
             </button>
           ) : (
             <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors">
               <Download size={20} />
             </button>
           )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-white font-medium text-sm truncate">{asset.title}</h3>
          {isTheme && (
            <div className="flex items-center gap-1 text-yellow-400">
              <Star size={12} fill="currentColor" />
              <span className="text-[10px] font-bold">{asset.rating}</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-xs">by {asset.author}</p>
          <div className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors">
            {isWallpaper ? (
              <>
                <Heart size={14} />
                <span className="text-[10px]">{asset.likes}</span>
              </>
            ) : isIcon ? (
              <span className={`text-[10px] font-bold ${asset.price === 'Free' ? 'text-green-500' : 'text-[#8b5cf6]'}`}>
                {asset.price}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
