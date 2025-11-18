import React from 'react';
import { Memory } from '../types';
import { Calendar, MapPin, Cloud, Music } from 'lucide-react';

interface MemoryCardProps {
  memory: Memory;
  onClick: (memory: Memory) => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onClick }) => {
  return (
    <div 
      onClick={() => onClick(memory)}
      className="group relative bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="h-48 overflow-hidden relative">
        <img 
          src={memory.generatedImageUrl || `https://picsum.photos/seed/${memory.id}/400/300`} 
          alt="Visualização da memória" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
        
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
           <span 
            className="text-xs font-bold px-2 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white uppercase tracking-wider"
            style={{ borderColor: memory.enrichment.colorHex }}
           >
             {memory.enrichment.mood}
           </span>
           <div className="flex items-center text-slate-200 text-xs space-x-1 bg-black/40 px-2 py-1 rounded-full backdrop-blur-md">
              <Cloud size={12} />
              <span>{memory.weather.temp || 'N/A'}</span>
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center text-indigo-300 text-xs font-medium mb-2 space-x-2">
          <Calendar size={12} />
          <span>{memory.dayOfWeek}, {memory.dateFormatted}</span>
          <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
          <span>{memory.time}</span>
        </div>

        <p className="text-slate-300 text-sm line-clamp-3 mb-4 font-light leading-relaxed">
          {memory.content}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1">
             <MapPin size={12} />
             <span className="max-w-[100px] truncate">{memory.location?.text || 'Loc. Desconhecida'}</span>
          </div>
           <div className="flex items-center space-x-1 text-indigo-400/80">
             <Music size={12} />
             <span className="max-w-[120px] truncate">{memory.enrichment.musicVibe}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;