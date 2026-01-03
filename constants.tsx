
import React from 'react';
import { 
  Home, Image, Layout, Type, Grid, History, Heart, Folder, Settings, Search, Sparkles, Filter, 
  ArrowRight, Download, Share2, Maximize, Mic, Plus
} from 'lucide-react';
import { Asset } from './types';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: <Home size={20} /> },
  { id: 'wallpapers', label: 'Wallpapers', icon: <Image size={20} /> },
  { id: 'themes', label: 'Themes', icon: <Layout size={20} /> },
  { id: 'fonts', label: 'Fonts', icon: <Type size={20} /> },
  { id: 'icons', label: 'Icons', icon: <Grid size={20} /> },
];

export const LIBRARY_ITEMS = [
  { id: 'collections', label: 'My Collections', icon: <Folder size={20} /> },
  { id: 'favorites', label: 'Favorites', icon: <Heart size={20} /> },
  { id: 'history', label: 'History', icon: <History size={20} /> },
];

export const MOCK_WALLPAPERS: Asset[] = [
  { id: '1', title: 'Liquid Dreams', author: 'Alex Chen', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', likes: '1.2k', type: 'wallpaper', tags: ['Abstract'] },
  { id: '2', title: 'Neon Gradient', author: 'DesignLab', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800', likes: '843', type: 'wallpaper', tags: ['Abstract', 'AMOLED'] },
  { id: '4', title: 'Yosemite Gold', author: 'NatureLover', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800', likes: '921', type: 'wallpaper', tags: ['Nature'] },
  { id: 'w5', title: 'Icelandic Peak', author: 'ArcticShot', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800', likes: '3.1k', type: 'wallpaper', tags: ['Nature'] },
  { id: 'w6', title: 'Zen Void', author: 'Minimalist', image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800', likes: '2.2k', type: 'wallpaper', tags: ['Minimal'] },
  { id: 'w7', title: 'Soft Shadows', author: 'Studio_S', image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=800', likes: '1.5k', type: 'wallpaper', tags: ['Minimal'] },
  { id: '3', title: 'Synthwave City', author: 'NeonDreams', image: 'https://images.unsplash.com/photo-1605142859862-978be7eba909?auto=format&fit=crop&q=80&w=800', likes: '2.5k', type: 'wallpaper', tags: ['Cyberpunk'] },
  { id: 'w8', title: 'Tokyo Nights', author: 'Future_Viz', image: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=800', likes: '4.8k', type: 'wallpaper', tags: ['Cyberpunk', 'AMOLED'] },
];

export const MOCK_THEMES: Asset[] = [
  { id: 't1', title: 'Cyber Seoul', author: 'NeonDreams', image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800', rating: 4.9, isPro: true, type: 'theme', tags: ['Futuristic'] },
  { id: 't2', title: 'Zen Geometric', author: 'ArtStation', image: 'https://images.unsplash.com/photo-1550684847-75bdda21cc95?auto=format&fit=crop&q=80&w=800', rating: 4.7, type: 'theme', tags: ['Minimalist'] },
  { id: 't3', title: 'Misty Peaks', author: 'NatureLover', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800', rating: 4.5, type: 'theme', tags: ['Nature'] },
  { id: 't4', title: 'Pastel Material', author: 'GoogleDesign', image: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=800', rating: 4.8, type: 'theme', tags: ['Material'] },
  { id: 't5', title: 'Inferno Gaming', author: 'RazerStudio', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', rating: 4.6, isPro: true, type: 'theme', tags: ['Gaming'] },
  { id: 't6', title: 'Glass Morphism', author: 'AppleDesign', image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=800', rating: 4.9, type: 'theme', tags: ['Minimalist'] },
];

export const MOCK_ICONS: Asset[] = [
  { id: 'i1', title: 'Glassmorphism', author: 'UI_Master', image: 'https://images.unsplash.com/photo-1614027126733-75768163dd34?auto=format&fit=crop&q=80&w=400', price: 'Free', type: 'icon' },
  { id: 'i2', title: 'Mono Line Dark', author: 'Minimalist', image: 'https://images.unsplash.com/photo-1614027126733-75768163dd34?auto=format&fit=crop&q=80&w=400', price: '$2.99', type: 'icon' },
  { id: 'i3', title: 'Clay 3D Pastel', author: 'RenderLab', image: 'https://images.unsplash.com/photo-1614027126733-75768163dd34?auto=format&fit=crop&q=80&w=400', price: '$5.00', type: 'icon' },
  { id: 'i4', title: 'Neumorphic Soft', author: 'SoftUI', image: 'https://images.unsplash.com/photo-1614027126733-75768163dd34?auto=format&fit=crop&q=80&w=400', price: 'Free', type: 'icon' },
];

export const MOCK_FONTS = [
  { id: 'f1', name: 'Inter Tight', family: "'Inter', sans-serif", author: 'Google Fonts' },
  { id: 'f2', name: 'Roboto Mono', family: "'Roboto Mono', monospace", author: 'Google Fonts' },
  { id: 'f3', name: 'Playfair Display', family: "'Playfair Display', serif", author: 'Claus Eggers' },
  { id: 'f4', name: 'Montserrat Bold', family: "'Montserrat', sans-serif", author: 'Julieta Ulanovsky' },
  { id: 'f5', name: 'JetBrains Mono', family: "'JetBrains Mono', monospace", author: 'JetBrains' },
];
