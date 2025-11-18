import React, { useState, useEffect } from 'react';
import { Memory, ViewState, GeoPosition } from './types';
import MemoryCard from './components/MemoryCard';
import CreateMemory from './components/CreateMemory';
import MemoryView from './components/MemoryView';
import { Plus, BrainCircuit, LayoutGrid, Info } from 'lucide-react';

// Local Storage Key
const STORAGE_KEY = 'memoria_app_data';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('LIST');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [currentLocation, setCurrentLocation] = useState<GeoPosition | null>(null);
  const [locationName, setLocationName] = useState<string>('Localizando...');

  // Load memories on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMemories(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse memories", e);
      }
    }
  }, []);

  // Load location on mount and keep it
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationName(`${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}`);
        },
        (error) => {
          console.warn("Geo error:", error);
          setLocationName("Localização indisponível");
        }
      );
    } else {
      setLocationName("Geolocalização não suportada");
    }
  }, []);

  // Save memories when changed
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  }, [memories]);

  const handleSaveMemory = (memory: Memory) => {
    setMemories([memory, ...memories]);
    setViewState('LIST');
  };

  const handleSelectMemory = (memory: Memory) => {
    setSelectedMemory(memory);
    setViewState('VIEW');
  };

  const handleBack = () => {
    setSelectedMemory(null);
    setViewState('LIST');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Navigation / Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg border-b border-slate-800/50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => setViewState('LIST')}
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center group-hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
              <BrainCircuit className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-serif font-bold text-white tracking-tight">
              Memória
            </h1>
          </div>

          {viewState === 'LIST' && (
             <button
              onClick={() => setViewState('CREATE')}
              className="flex items-center space-x-2 bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-indigo-500/20"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nova Memória</span>
              <span className="sm:hidden">Nova</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {viewState === 'CREATE' && (
          <CreateMemory 
            onSave={handleSaveMemory} 
            onCancel={() => setViewState('LIST')}
            location={currentLocation}
            locationName={locationName}
          />
        )}

        {viewState === 'VIEW' && selectedMemory && (
          <MemoryView 
            memory={selectedMemory} 
            onBack={handleBack} 
          />
        )}

        {viewState === 'LIST' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {memories.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
                    <LayoutGrid className="text-slate-600" size={32} />
                </div>
                <h2 className="text-2xl font-serif text-white mb-2">Seu diário está vazio</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                  Comece a capturar seus momentos. A IA ajudará você a lembrar do clima, do humor e da sensação do agora.
                </p>
                <button
                  onClick={() => setViewState('CREATE')}
                  className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center justify-center gap-2 mx-auto"
                >
                  Crie sua primeira memória <Plus size={16}/>
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl text-slate-400 font-light">
                    Sua Linha do Tempo <span className="text-slate-600 ml-2 text-sm">{memories.length} registros</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {memories.map((memory) => (
                    <MemoryCard 
                      key={memory.id} 
                      memory={memory} 
                      onClick={handleSelectMemory} 
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 mt-12 py-8 text-center">
         <p className="text-slate-600 text-sm flex items-center justify-center gap-2">
           <Info size={14} />
           Desenvolvido com Gemini 2.5 Flash & Imagen 3
         </p>
      </footer>
    </div>
  );
};

export default App;