import React from 'react';
import { Memory } from '../types';
import { ArrowLeft, Cloud, MapPin, Music, Tag, Clock } from 'lucide-react';

interface MemoryViewProps {
  memory: Memory;
  onBack: () => void;
}

const MemoryView: React.FC<MemoryViewProps> = ({ memory, onBack }) => {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 min-h-full pb-20">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors group"
      >
        <div className="p-2 rounded-full bg-slate-800/50 group-hover:bg-indigo-600/20 mr-3 transition-colors">
          <ArrowLeft size={20} />
        </div>
        <span className="text-sm font-medium tracking-wide">Voltar ao Diário</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Visual Side */}
        <div className="relative">
          <div className="aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-2xl shadow-black/50 relative group">
            <img 
              src={memory.generatedImageUrl} 
              alt="Memória gerada" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
            
            <div className="absolute bottom-8 left-8 right-8">
               <p className="text-white/90 font-serif italic text-2xl leading-tight drop-shadow-lg">
                 "{memory.enrichment.poeticSummary}"
               </p>
            </div>
          </div>
          
          {/* Ambient Decor */}
          <div 
            className="absolute -top-10 -right-10 w-64 h-64 rounded-full blur-[100px] -z-10 opacity-30"
            style={{ backgroundColor: memory.enrichment.colorHex }}
          ></div>
        </div>

        {/* Content Side */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {memory.enrichment.mood}
              </span>
              <span className="text-slate-500 text-sm font-medium">
                 {memory.dayOfWeek}, {memory.dateFormatted}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight mb-8">
              {memory.content}
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center text-slate-400 mb-2">
                <Cloud size={16} className="mr-2" />
                <span className="text-xs uppercase tracking-wider font-semibold">Atmosfera</span>
              </div>
              <p className="text-slate-200 font-medium">
                {memory.weather.temp}
              </p>
              <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                {memory.weather.description}
              </p>
            </div>

             <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center text-slate-400 mb-2">
                <Music size={16} className="mr-2" />
                <span className="text-xs uppercase tracking-wider font-semibold">Trilha Sonora</span>
              </div>
              <p className="text-slate-200 font-medium">
                {memory.enrichment.musicVibe}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
             <div className="flex items-center text-slate-400 text-sm">
               <MapPin size={16} className="mr-3 text-slate-500" />
               {memory.location?.text || 'Localização Desconhecida'}
             </div>
             <div className="flex items-center text-slate-400 text-sm">
               <Clock size={16} className="mr-3 text-slate-500" />
               {memory.time}
             </div>
             
             <div className="flex flex-wrap gap-2 mt-4">
               {memory.enrichment.tags.map(tag => (
                 <span key={tag} className="flex items-center text-xs text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                   <Tag size={10} className="mr-1.5 opacity-50" />
                   #{tag}
                 </span>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryView;