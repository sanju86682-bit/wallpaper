
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Download, Maximize, X, ImageIcon, Share2 } from 'lucide-react';
import { chatWithWally, generateImage } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIStudio: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'ai', text: 'What shall we create today? Describe any wallpaper or icon style.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'chat' | 'preview'>('chat');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsGenerating(true);

    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('generate') || lowerInput.includes('create') || lowerInput.includes('wallpaper')) {
      const loadingMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `Generating your vision...`,
        timestamp: new Date(),
        status: 'loading'
      };
      setMessages(prev => [...prev, loadingMsg]);
      const result = await generateImage(input, "9:16");
      setMessages(prev => prev.map(m => m.id === loadingMsg.id ? { ...m, status: 'complete', text: `Generation complete!`, image: result || undefined } : m));
      if (result) {
        setPreviewImage(result);
        setViewMode('preview');
      }
    } else {
      const aiResponse = await chatWithWally(input);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: aiResponse, timestamp: new Date() }]);
    }
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0b14]">
      {/* Internal View Toggle */}
      <div className="flex px-4 py-2 border-b border-white/5 bg-[#161321]">
        <button 
          onClick={() => setViewMode('chat')}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'chat' ? 'bg-purple-500 text-white' : 'text-gray-500'}`}
        >
          Chat
        </button>
        <button 
          onClick={() => setViewMode('preview')}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'preview' ? 'bg-purple-500 text-white' : 'text-gray-500'}`}
        >
          View Output {previewImage && <span className="inline-block w-1.5 h-1.5 bg-white rounded-full ml-1 animate-pulse"></span>}
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {/* Chat Interface */}
        <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ${viewMode === 'chat' ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-[#8b5cf6]' : 'bg-gray-800'}`}>
                  {msg.role === 'ai' ? <Sparkles size={14} className="text-white" /> : <div className="w-5 h-5 bg-white/20 rounded-full"></div>}
                </div>
                <div className={`max-w-[85%] space-y-2`}>
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed ${msg.role === 'ai' ? 'bg-[#1c1a26] text-gray-300 border border-white/5' : 'bg-[#8b5cf6] text-white shadow-lg shadow-purple-500/10'}`}>
                    {msg.text}
                    {msg.status === 'loading' && <div className="mt-2 h-1 w-full bg-white/10 overflow-hidden rounded"><div className="h-full bg-purple-400 w-1/2 animate-[progress_1.5s_infinite]"></div></div>}
                  </div>
                  {msg.image && (
                    <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg cursor-pointer" onClick={() => {setPreviewImage(msg.image!); setViewMode('preview');}}>
                      <img src={msg.image} alt="Generated" className="w-full aspect-[9/16] object-cover" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#110f1a] border-t border-white/5">
            <div className="relative">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask Wally to 'Create a neon cityscape'..."
                className="w-full bg-[#0d0b14] border border-white/10 rounded-2xl py-4 pl-4 pr-14 h-20 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 resize-none no-scrollbar"
              />
              <button 
                onClick={handleSend}
                disabled={isGenerating || !input.trim()}
                className="absolute right-3 bottom-3 bg-[#8b5cf6] w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-50 transition-all active:scale-90"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Preview Interface */}
        <div className={`absolute inset-0 flex flex-col bg-[#0d0b14] transition-transform duration-300 ${viewMode === 'preview' ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex-1 p-5 flex flex-col overflow-y-auto no-scrollbar">
            {previewImage ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 group">
                   <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                   <div className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-xl rounded-full text-white border border-white/10">
                     <Maximize size={18} />
                   </div>
                </div>
                <div className="flex gap-4 w-full px-4 pb-10">
                  <button className="flex-1 bg-white/5 py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-white/10">
                    <Share2 size={16} /> Share
                  </button>
                  <button className="flex-1 bg-[#8b5cf6] py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20">
                    <Download size={16} /> Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-700">
                <ImageIcon size={64} className="mb-4 opacity-5" />
                <p className="text-sm font-medium">No results to show</p>
                <button onClick={() => setViewMode('chat')} className="text-[#8b5cf6] text-xs font-black uppercase tracking-widest mt-6 border-b border-[#8b5cf6]">Back to Chat</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
      `}</style>
    </div>
  );
};

export default AIStudio;
