
export enum AppTab {
  HOME = 'home',
  WALLPAPERS = 'wallpapers',
  THEMES = 'themes',
  FONTS = 'fonts',
  ICONS = 'icons',
  AI_STUDIO = 'ai_studio',
  PROFILE = 'profile',
  OWNER_DASHBOARD = 'owner_dashboard'
}

export interface Asset {
  id: string;
  title: string;
  author?: string;
  image: string;
  likes?: string;
  rating?: number;
  tags?: string[];
  isPro?: boolean;
  price?: string;
  type?: 'wallpaper' | 'theme' | 'font' | 'icon';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  images?: string[]; // Support multiple variations
  timestamp: Date;
  status?: 'loading' | 'complete';
  isMockup?: boolean; // Flag for mockup preview messages
}
