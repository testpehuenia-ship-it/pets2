import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FIRST_AID_GUIDES } from '../../data/initialData';

interface FirstAidViewProps {
  onOpenEmergency: () => void;
  onGoToBooking?: () => void;
}

type ExtendedSpecies = 'todos' | 'perro' | 'gato' | 'caballo' | 'ovino_bovino' | 'aves' | 'otros';

export const FirstAidView: React.FC<FirstAidViewProps> = ({ onOpenEmergency, onGoToBooking }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<ExtendedSpecies>('todos');
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const SPECIES_OPTIONS = [
    { id: 'todos', label: 'Todas', icon: '🐾' },
    { id: 'perro', label: 'Perro', icon: '🐶' },
    { id: 'gato', label: 'Gato', icon: '🐱' },
    { id: 'caballo', label: 'Caballo', icon: '🐴' },
    { id: 'ovino_bovino', label: 'Ovino/Bovino', icon: '🐮' },
    { id: 'aves', label: 'Aves', icon: '🐔' },
    { id: 'otros', label: 'Otros', icon: '🐢' }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    setAiReport(null);

    const speciesLabel = SPECIES_OPTIONS.find(s => s.id === selectedSpecies)?.label || 'Desconocida';

    try {
      const res = await fetch('/api/first-aid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, species: speciesLabel })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Error de conexión con la IA');
      
      setAiReport(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filteredGuides = FIRST_AID_GUIDES.filter((guide) => {
    const matchesSpecies = selectedSpecies === 'todos' || guide.species.includes(selectedSpecies as any);
    return matchesSpecies;
  });

  return (
    <div className="py-8 px-4 md:px-10 max-w-[1280px] mx-auto animate-in fade-in duration-300">
      {/* Header Section */}
      <section className="mb-8 text-center md:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad6] text-[#93000a] text-xs font-bold uppercase tracking-wider mb-3">
          <span className="material-symbols-outlined text-sm">emergency</span>
          Guía de Asistencia Inmediata
        </div>
        <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-[#1b1c1c] mb-2 uppercase tracking-tight">
          PRIMEROS AUXILIOS PARA TU ANIMAL
        </h1>
        <p className="text-sm md:text-base text-[#434938] max-w-2xl">
          Encuentra información rápida y clara para actuar en caso de emergencia antes de llegar a la clínica.
        </p>
      </section>

      {/* 1. Species Categories (MOVED ABOVE SEARCH) */}
      <section className="mb-6">
        <h2 className="font-headline text-base md:text-lg font-bold mb-4 text-[#1b1c1c]">
          1. Selecciona la especie
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {SPECIES_OPTIONS.map(species => (
            <button
              key={species.id}
              onClick={() => setSelectedSpecies(species.id as ExtendedSpecies)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all min-w-[105px] ${
                selectedSpecies === species.id
                  ? 'bg-[#c7f173] border-[#8fc63d] text-[#141f00] font-bold shadow-xs'
                  : 'bg-[#f6f3f2] border-transparent text-[#434938] hover:border-[#c3c9b3]'
              }`}
            >
              <span className={`text-3xl mb-1 ${selectedSpecies === species.id ? 'opacity-100' : 'opacity-60 grayscale'}`}>
                {species.icon}
              </span>
              <span className="text-xs font-semibold">{species.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 2. Search Bar with AI Trigger */}
      <section className="mb-10 max-w-2xl">
        <h2 className="font-headline text-base md:text-lg font-bold mb-4 text-[#1b1c1c]">
          2. Describe la situación (IA)
        </h2>
        <div className="relative flex gap-2">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737a66] text-2xl pointer-events-none">
              smart_toy
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ej: Mi perro se cortó la pata y sangra mucho"
              className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-[#c3c9b3] bg-white focus:border-[#436900] focus:ring-2 focus:ring-[#8fc63d]/20 transition-all outline-none text-sm text-[#1b1c1c] placeholder:text-[#737a66] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setAiReport(null); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737a66] hover:text-[#1b1c1c] p-1"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            className="bg-[#436900] hover:bg-[#324f00] text-white px-6 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              <>
                Buscar
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>
        )}
      </section>

      {/* AI Report Result */}
      {aiReport && !loading && (
        <section className="mb-12 max-w-3xl animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white border-2 border-[#8fc63d]/30 rounded-2xl p-6 md:p-8 shadow-ambient-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c7f173] to-[#8fc63d]" />
            <div className="flex items-center gap-2 mb-6 text-[#436900]">
              <span className="material-symbols-outlined text-3xl filled">health_and_safety</span>
              <h3 className="font-headline font-bold text-xl">Reporte de Asistencia Rápida</h3>
            </div>
            
            <div className="prose prose-sm md:prose-base prose-green max-w-none text-[#1b1c1c] prose-headings:font-headline prose-headings:text-[#436900] prose-a:text-[#8fc63d] mb-8">
              <ReactMarkdown>{aiReport}</ReactMarkdown>
            </div>

            {/* Action Buttons inside AI Report */}
            <div className="mt-8 pt-6 border-t border-[#c3c9b3]/30 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={onGoToBooking}
                className="w-full sm:w-auto bg-[#c7f173] hover:bg-[#8fc63d] text-[#141f00] font-bold text-sm px-6 py-3.5 rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 uppercase"
              >
                <span className="material-symbols-outlined text-xl">calendar_month</span>
                Reservar Turno
              </button>
              
              <button
                onClick={onOpenEmergency}
                className="w-full sm:w-auto bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 uppercase"
              >
                <span className="material-symbols-outlined text-xl">emergency</span>
                Urgencia 24hs
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Static Guides Fallback (if no AI search) */}
      {!aiReport && !loading && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredGuides.map((guide) => {
            const isUrgente = guide.severity === 'Urgente';
            return (
              <article
                key={guide.id}
                className="bg-white border border-[#c3c9b3]/35 rounded-2xl overflow-hidden flex flex-col h-full shadow-ambient hover:shadow-ambient-lg transition-all duration-300"
              >
                <div className="p-5 border-b border-[#c3c9b3]/20 bg-[#ffffff] flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-headline text-lg font-bold text-[#1b1c1c]">{guide.title}</h3>
                    <p className="text-xs text-[#737a66] mt-0.5">{guide.summary}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${isUrgente ? 'bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/20' : 'bg-[#ffdcc1] text-[#604024] border border-[#7a5739]/20'}`}>
                    {guide.severity}
                  </span>
                </div>
                <div className="p-5 flex-grow flex flex-col gap-4 bg-[#fbf9f8]">
                  <div>
                    <h4 className="font-headline font-bold text-xs text-[#436900] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base filled">check_circle</span> Qué hacer
                    </h4>
                    <ul className="space-y-1.5">
                      {guide.whatToDo.map((item, idx) => (
                        <li key={idx} className="text-xs text-[#1b1c1c] flex items-start gap-1.5">
                          <span className="text-[#436900] font-bold">•</span> <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};
