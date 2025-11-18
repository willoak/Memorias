import React, { useState } from 'react';
import { MapPin, Loader2, Save } from 'lucide-react';
import { fetchWeatherContext, enrichMemory, generateMemoryImage } from '../services/geminiService';
import { Memory, GeoPosition } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface CreateMemoryProps {
  onSave: (memory: Memory) => void;
  onCancel: () => void;
  location: GeoPosition | null;
  locationName: string;
}

const CreateMemory: React.FC<CreateMemoryProps> = ({ onSave, onCancel, location, locationName }) => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsAnalyzing(true);
    
    try {
      const now = new Date();
      const dayOfWeek = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(now);
      const dateFormatted = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(now);
      const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(now);

      // 1. Get Weather Context (if loc available)
      setStatusMessage('Sentindo a atmosfera...');
      let weatherContext = "Clima desconhecido";
      if (location) {
        weatherContext = await fetchWeatherContext(location.lat, location.lng);
      } else {
        console.warn("Location missing at submit time");
      }

      // 2. Enrich Data (Analysis)
      setStatusMessage('Analisando seu momento...');
      const enrichment = await enrichMemory(content, weatherContext, now.toISOString());

      // 3. Generate Image
      setStatusMessage('Pintando sua memória...');
      const generatedImage = await generateMemoryImage(content, enrichment.mood, enrichment.weatherParsed);

      const newMemory: Memory = {
        id: uuidv4(),
        content,
        timestamp: now.getTime(),
        dateFormatted,
        dayOfWeek: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1),
        time,
        location: location ? { lat: location.lat, lng: location.lng, text: locationName } : undefined,
        weather: {
          description: weatherContext,
          temp: enrichment.weatherParsed,
        },
        enrichment,
        generatedImageUrl: generatedImage
      };

      onSave(newMemory);

    } catch (error) {
      console.error(error);
      setStatusMessage('Erro ao criar memória. Tente novamente.');
      setTimeout(() => setIsAnalyzing(false), 2000);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-in fade-in duration-500">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 animate-pulse blur-xl absolute opacity-50"></div>
          <Loader2 size={64} className="text-indigo-400 animate-spin relative z-10" />
        </div>
        <h2 className="text-2xl font-serif italic text-white mb-2">{statusMessage}</h2>
        <p className="text-slate-400 text-sm">A IA está tecendo sua memória para a existência.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-slate-900/50 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-sm animate-in slide-in-from-bottom-8 duration-500">
      <div className="mb-6">
        <h2 className="text-3xl font-serif text-white mb-1">Nova Memória</h2>
        <p className="text-slate-400 text-sm">Capture a essência do agora.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-500 uppercase tracking-wider font-semibold">
            <span className="flex items-center gap-1"><MapPin size={12} /> {locationName}</span>
            <span>{new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="O que está acontecendo? Como está o ar? Que sons você ouve?"
              className="relative w-full h-48 bg-slate-950 text-slate-100 p-5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-slate-600 resize-none leading-relaxed font-light text-lg"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!content.trim()}
            className="group relative px-8 py-3 rounded-xl bg-white text-slate-900 font-semibold text-sm transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
             <span className="relative z-10 flex items-center gap-2">
               <Save size={16} /> Salvar Memória
             </span>
             <div className="absolute inset-0 h-full w-full rounded-xl bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 opacity-0 transition-opacity duration-500 group-hover:opacity-20 animate-gradient"></div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMemory;