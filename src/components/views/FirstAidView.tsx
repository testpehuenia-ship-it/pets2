import React, { useState } from 'react';
import { FIRST_AID_GUIDES } from '../../data/initialData';
import { SpeciesType } from '../../types';

interface FirstAidViewProps {
  onOpenEmergency: () => void;
}

export const FirstAidView: React.FC<FirstAidViewProps> = ({ onOpenEmergency }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesType>('todos');

  const filteredGuides = FIRST_AID_GUIDES.filter((guide) => {
    const matchesQuery =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.whatToDo.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase())) ||
      guide.whatNotToDo.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSpecies =
      selectedSpecies === 'todos' ||
      guide.species.includes(selectedSpecies as 'perro' | 'gato' | 'caballo');

    return matchesQuery && matchesSpecies;
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

      {/* Search Bar */}
      <section className="mb-8 max-w-2xl">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737a66] text-2xl pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="¿Qué le pasó a tu animal? (Ej: Heridas, Convulsiones, Vómito, Calor)"
            className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-[#c3c9b3] bg-white focus:border-[#436900] focus:ring-2 focus:ring-[#8fc63d]/20 transition-all outline-none text-sm text-[#1b1c1c] placeholder:text-[#737a66] shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737a66] hover:text-[#1b1c1c] p-1"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>
      </section>

      {/* Species Categories */}
      <section className="mb-10">
        <h2 className="font-headline text-base md:text-lg font-bold mb-4 text-[#1b1c1c]">
          Selecciona la especie
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          <button
            onClick={() => setSelectedSpecies('todos')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all min-w-[105px] ${
              selectedSpecies === 'todos'
                ? 'bg-[#c7f173] border-[#8fc63d] text-[#141f00] font-bold shadow-xs'
                : 'bg-[#f6f3f2] border-transparent text-[#434938] hover:border-[#c3c9b3]'
            }`}
          >
            <span className="material-symbols-outlined text-3xl mb-1 text-[#436900]">
              apps
            </span>
            <span className="text-xs font-semibold">Todas</span>
          </button>

          <button
            onClick={() => setSelectedSpecies('perro')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all min-w-[105px] ${
              selectedSpecies === 'perro'
                ? 'bg-[#c7f173] border-[#8fc63d] text-[#141f00] font-bold shadow-xs'
                : 'bg-[#f6f3f2] border-transparent text-[#434938] hover:border-[#c3c9b3]'
            }`}
          >
            <span className={`material-symbols-outlined text-3xl mb-1 text-[#436900] ${selectedSpecies === 'perro' ? 'filled' : ''}`}>
              pets
            </span>
            <span className="text-xs font-semibold">Perro</span>
          </button>

          <button
            onClick={() => setSelectedSpecies('gato')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all min-w-[105px] ${
              selectedSpecies === 'gato'
                ? 'bg-[#c7f173] border-[#8fc63d] text-[#141f00] font-bold shadow-xs'
                : 'bg-[#f6f3f2] border-transparent text-[#434938] hover:border-[#c3c9b3]'
            }`}
          >
            <span className={`material-symbols-outlined text-3xl mb-1 text-[#436900] ${selectedSpecies === 'gato' ? 'filled' : ''}`}>
              cruelty_free
            </span>
            <span className="text-xs font-semibold">Gato</span>
          </button>

          <button
            onClick={() => setSelectedSpecies('caballo')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all min-w-[105px] ${
              selectedSpecies === 'caballo'
                ? 'bg-[#ffdcc1] border-[#7a5739] text-[#2d1601] font-bold shadow-xs'
                : 'bg-[#f6f3f2] border-transparent text-[#434938] hover:border-[#c3c9b3]'
            }`}
          >
            <span className={`material-symbols-outlined text-3xl mb-1 text-[#7a5739] ${selectedSpecies === 'caballo' ? 'filled' : ''}`}>
              agriculture
            </span>
            <span className="text-xs font-semibold">Caballo</span>
          </button>
        </div>
      </section>

      {/* Emergency Cards (Bento Grid) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredGuides.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-[#c3c9b3]/30">
            <span className="material-symbols-outlined text-5xl text-[#737a66] mb-2">search_off</span>
            <h3 className="font-headline font-bold text-lg text-[#1b1c1c]">
              No se encontraron guías para "{searchQuery}"
            </h3>
            <p className="text-xs text-[#434938] mt-1">
              Prueba con términos como: heridas, convulsiones, vómitos, calor o intoxicación.
            </p>
          </div>
        ) : (
          filteredGuides.map((guide) => {
            const isUrgente = guide.severity === 'Urgente';
            return (
              <article
                key={guide.id}
                className="bg-white border border-[#c3c9b3]/35 rounded-2xl overflow-hidden flex flex-col h-full shadow-ambient hover:shadow-ambient-lg transition-all duration-300"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-[#c3c9b3]/20 bg-[#ffffff] flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-headline text-lg font-bold text-[#1b1c1c]">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-[#737a66] mt-0.5">{guide.summary}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${
                      isUrgente
                        ? 'bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/20'
                        : 'bg-[#ffdcc1] text-[#604024] border border-[#7a5739]/20'
                    }`}
                  >
                    {guide.severity}
                  </span>
                </div>

                {/* Card Body: What to Do & What NOT to Do */}
                <div className="p-5 flex-grow flex flex-col gap-4 bg-[#fbf9f8]">
                  {/* Qué hacer */}
                  <div>
                    <h4 className="font-headline font-bold text-xs text-[#436900] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base filled">check_circle</span>
                      Qué hacer
                    </h4>
                    <ul className="space-y-1.5">
                      {guide.whatToDo.map((item, idx) => (
                        <li key={idx} className="text-xs text-[#1b1c1c] leading-relaxed flex items-start gap-1.5">
                          <span className="text-[#436900] font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Qué NO hacer */}
                  <div className="pt-2 border-t border-[#c3c9b3]/20">
                    <h4 className="font-headline font-bold text-xs text-[#ba1a1a] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base filled">cancel</span>
                      Qué NO hacer
                    </h4>
                    <ul className="space-y-1.5">
                      {guide.whatNotToDo.map((item, idx) => (
                        <li key={idx} className="text-xs text-[#434938] leading-relaxed flex items-start gap-1.5">
                          <span className="text-[#ba1a1a] font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* CTA & Disclaimer */}
      <section className="max-w-2xl mx-auto text-center flex flex-col items-center gap-4">
        <button
          onClick={onOpenEmergency}
          className="bg-[#436900] hover:bg-[#324f00] text-white font-bold text-sm py-4 px-8 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all w-full sm:w-auto flex items-center justify-center gap-2 uppercase tracking-wide"
        >
          <span className="material-symbols-outlined text-2xl">local_hospital</span>
          NECESITO ATENCIÓN VETERINARIA
        </button>

        <p className="text-xs text-[#737a66] italic leading-relaxed max-w-xl">
          * Esta información es orientativa y de primeros auxilios. No reemplaza en ningún caso el diagnóstico ni la atención médica veterinaria profesional inmediata.
        </p>
      </section>
    </div>
  );
};
