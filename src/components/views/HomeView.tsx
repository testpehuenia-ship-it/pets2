import React from 'react';
import { TabType } from '../../types';
import { CLINIC_IMAGES } from '../../data/initialData';
import { HeroSlider } from '../HeroSlider';
import { CLINIC_IMAGES } from '../../data/initialData';

interface HomeViewProps {
  onSelectTab: (tab: TabType) => void;
  onOpenEmergency: () => void;
  onSelectCategory?: (category: 'mascotas' | 'campo') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTab,
  onOpenEmergency,
}) => {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#fbf9f8] pt-6 pb-12 md:py-16 px-4 md:px-10">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left Column: Headline & Bio */}
          <div className="md:col-span-5 space-y-4 md:space-y-6 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c7f173]/40 border border-[#8fc63d]/40 text-[#324f00] text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#436900] animate-ping" />
              Atención Clínica y Rural
            </div>

            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#436900] leading-tight tracking-tight">
              PETS <br />
              <span className="text-[#324f00]">Veterinaria Integral</span>
            </h1>

            <p className="text-base md:text-lg text-[#434938] max-w-md mx-auto md:mx-0 leading-relaxed">
              Más cuidado, más vida. Dedicados a la salud y bienestar de tus animales, brindando atención cálida, humana y profesional.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => onSelectTab('reservas')}
                className="w-full sm:w-auto bg-[#8fc63d] hover:bg-[#9fd74d] text-[#111f00] font-bold text-sm px-6 py-3.5 rounded-lg shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                <span className="material-symbols-outlined text-xl">calendar_month</span>
                RESERVAR TURNO
              </button>

              <button
                onClick={onOpenEmergency}
                className="w-full sm:w-auto bg-[#ffdad6] hover:bg-[#ffdad6]/80 text-[#93000a] border border-[#ba1a1a]/30 font-bold text-sm px-5 py-3.5 rounded-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl text-[#ba1a1a]">emergency</span>
                URGENCIA 24HS
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Blend */}
          <div className="md:col-span-7 relative h-[320px] sm:h-[420px] md:h-[520px] rounded-2xl overflow-hidden shadow-ambient border border-[#c3c9b3]/30">
            <HeroSlider />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#fbf9f8]/60 via-transparent to-transparent pointer-events-none" />
            
            {/* Quick floating pill */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-[#c3c9b3]/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#c7f173] flex items-center justify-center text-[#324f00]">
                <span className="material-symbols-outlined text-lg filled">verified</span>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#1b1c1c]">Staff Certificado</div>
                <div className="text-[10px] text-[#737a66]">Pequeños y Grandes Animales</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Actions (Bento Grid) */}
      <section className="py-10 md:py-14 px-4 md:px-10 bg-[#f6f3f2] border-y border-[#c3c9b3]/30">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Action 1: Reservar Turno */}
          <div
            onClick={() => onSelectTab('reservas')}
            className="group relative bg-[#ffffff] p-7 rounded-xl border border-[#7a5739]/20 overflow-hidden hover:-translate-y-1 hover:shadow-ambient transition-all duration-300 cursor-pointer shadow-xs"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[72px] text-[#436900]">calendar_month</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#c7f173]/50 flex items-center justify-center mb-4 text-[#436900]">
              <span className="material-symbols-outlined text-3xl">calendar_month</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-[#1b1c1c] mb-1.5">
              Reservar Turno
            </h3>
            <p className="text-sm text-[#434938] leading-relaxed">
              Agenda una consulta médica presencial o visita a campo para tu animal en simples pasos.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#436900] group-hover:underline">
              <span>Comenzar reserva</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </div>
          </div>

          {/* Action 2: Primeros Auxilios */}
          <div
            onClick={() => onSelectTab('auxilios')}
            className="group relative bg-[#ffdad6]/40 p-7 rounded-xl border border-[#ba1a1a]/30 overflow-hidden hover:-translate-y-1 hover:shadow-ambient transition-all duration-300 cursor-pointer shadow-xs"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[72px] text-[#ba1a1a]">medical_services</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#ffdad6] flex items-center justify-center mb-4 text-[#ba1a1a]">
              <span className="material-symbols-outlined text-3xl">medical_services</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-[#93000a] mb-1.5">
              Primeros Auxilios
            </h3>
            <p className="text-sm text-[#434938] leading-relaxed">
              Guía médica paso a paso para actuar con seguridad en caso de emergencia antes de llegar.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#ba1a1a] group-hover:underline">
              <span>Ver guía de urgencias</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </div>
          </div>

          {/* Action 3: Contacto */}
          <div
            onClick={() => onSelectTab('equipo')}
            className="group relative bg-[#ffffff] p-7 rounded-xl border border-[#7a5739]/20 overflow-hidden hover:-translate-y-1 hover:shadow-ambient transition-all duration-300 cursor-pointer shadow-xs"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[72px] text-[#7a5739]">support_agent</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#ffdcc1]/50 flex items-center justify-center mb-4 text-[#7a5739]">
              <span className="material-symbols-outlined text-3xl">support_agent</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-[#1b1c1c] mb-1.5">
              Contacto y Sedes
            </h3>
            <p className="text-sm text-[#434938] leading-relaxed">
              Comunícate con nosotros, conoce al staff veterinario y consulta la ubicación de nuestra clínica.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#7a5739] group-hover:underline">
              <span>Conoce al equipo</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestros Pacientes / Especialidades */}
      <section className="py-14 md:py-20 px-4 md:px-10 bg-[#fbf9f8]">
        <div className="max-w-[1280px] mx-auto text-center mb-10 md:mb-14">
          <h2 className="font-headline font-bold text-4xl sm:text-5xl md:text-6xl text-[#436900] opacity-15 uppercase tracking-widest select-none">
            PACIENTES
          </h2>
          <h3 className="font-headline text-2xl md:text-3xl font-bold text-[#1b1c1c] -mt-6 sm:-mt-8">
            Especialidades
          </h3>
          <p className="text-sm md:text-base text-[#434938] max-w-lg mx-auto mt-2">
            Atención clínica adaptada tanto a los integrantes del hogar como a la producción rural.
          </p>
        </div>

        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Mascotas */}
          <div
            onClick={() => onSelectTab('reservas')}
            className="relative h-[280px] sm:h-[360px] md:h-[400px] rounded-2xl overflow-hidden group cursor-pointer border border-[#7a5739]/20 shadow-ambient"
          >
            <img
              src={CLINIC_IMAGES.mascotasCatDog}
              alt="Perro y gato descansando juntos"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors duration-300" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <button className="bg-[#fbf9f8]/95 backdrop-blur-md text-[#436900] font-bold text-sm tracking-wider px-8 py-3.5 rounded-full shadow-lg group-hover:bg-white transition-all flex items-center gap-2 uppercase">
                <span className="material-symbols-outlined text-xl">pets</span>
                MASCOTAS
              </button>
              <span className="text-white/90 text-xs mt-2.5 font-medium drop-shadow-sm">
                Perros, Gatos y Pequeñas Especies
              </span>
            </div>
          </div>

          {/* Animales de Campo */}
          <div
            onClick={() => onSelectTab('reservas')}
            className="relative h-[280px] sm:h-[360px] md:h-[400px] rounded-2xl overflow-hidden group cursor-pointer border border-[#7a5739]/20 shadow-ambient"
          >
            <img
              src={CLINIC_IMAGES.campoHorse}
              alt="Caballo pastando en campo abierto al atardecer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors duration-300" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <button className="bg-[#fbf9f8]/95 backdrop-blur-md text-[#7a5739] font-bold text-sm tracking-wider px-8 py-3.5 rounded-full shadow-lg group-hover:bg-white transition-all flex items-center gap-2 uppercase">
                <span className="material-symbols-outlined text-xl">agriculture</span>
                ANIMALES DE CAMPO
              </button>
              <span className="text-white/90 text-xs mt-2.5 font-medium drop-shadow-sm">
                Equinos, Bovinos, Ovinos y Asistencia en Establecimiento
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Destacados */}
      <section className="py-14 md:py-20 px-4 md:px-10 bg-[#f0eded] bg-pattern border-t border-[#c3c9b3]/30">
        <div className="max-w-[1280px] mx-auto text-center mb-10 md:mb-14">
          <h2 className="font-headline font-bold text-4xl sm:text-5xl md:text-6xl text-[#436900] opacity-15 uppercase tracking-widest select-none">
            SERVICIOS
          </h2>
          <h3 className="font-headline text-2xl md:text-3xl font-bold text-[#1b1c1c] -mt-6 sm:-mt-8">
            Atención Integral
          </h3>
          <p className="text-sm md:text-base text-[#434938] max-w-lg mx-auto mt-2">
            Instalaciones clínicas de vanguardia y unidades móviles preparadas.
          </p>
        </div>

        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Servicio 1: Consulta */}
          <div
            onClick={() => onSelectTab('reservas')}
            className="flex flex-col items-center text-center p-6 bg-[#ffffff] rounded-2xl border border-[#7a5739]/15 hover:border-[#436900] hover:shadow-ambient transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full bg-[#f6f3f2] group-hover:bg-[#c7f173]/40 flex items-center justify-center text-[#436900] mb-4 transition-colors">
              <span className="material-symbols-outlined text-3xl">stethoscope</span>
            </div>
            <h4 className="font-headline font-bold text-base text-[#1b1c1c] mb-1.5">
              Consulta
            </h4>
            <p className="text-xs text-[#434938] leading-relaxed">
              Chequeos generales, diagnóstico clínico y seguimiento continuo.
            </p>
          </div>

          {/* Servicio 2: Vacunas */}
          <div
            onClick={() => onSelectTab('reservas')}
            className="flex flex-col items-center text-center p-6 bg-[#ffffff] rounded-2xl border border-[#7a5739]/15 hover:border-[#436900] hover:shadow-ambient transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full bg-[#f6f3f2] group-hover:bg-[#c7f173]/40 flex items-center justify-center text-[#436900] mb-4 transition-colors">
              <span className="material-symbols-outlined text-3xl">vaccines</span>
            </div>
            <h4 className="font-headline font-bold text-base text-[#1b1c1c] mb-1.5">
              Vacunas
            </h4>
            <p className="text-xs text-[#434938] leading-relaxed">
              Planes de inmunización, rabia, séxtuple y antiparasitarios.
            </p>
          </div>

          {/* Servicio 3: Cirugía */}
          <div
            onClick={() => onSelectTab('reservas')}
            className="flex flex-col items-center text-center p-6 bg-[#ffffff] rounded-2xl border border-[#7a5739]/15 hover:border-[#436900] hover:shadow-ambient transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full bg-[#f6f3f2] group-hover:bg-[#c7f173]/40 flex items-center justify-center text-[#436900] mb-4 transition-colors">
              <span className="material-symbols-outlined text-3xl">content_cut</span>
            </div>
            <h4 className="font-headline font-bold text-base text-[#1b1c1c] mb-1.5">
              Cirugía
            </h4>
            <p className="text-xs text-[#434938] leading-relaxed">
              Quirófano equipado con anestesia inhalatoria y monitoreo.
            </p>
          </div>

          {/* Servicio 4: Atención Rural */}
          <div
            onClick={() => onSelectTab('reservas')}
            className="flex flex-col items-center text-center p-6 bg-[#ffffff] rounded-2xl border border-[#7a5739]/15 hover:border-[#7a5739] hover:shadow-ambient transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full bg-[#f6f3f2] group-hover:bg-[#ffdcc1]/40 flex items-center justify-center text-[#7a5739] mb-4 transition-colors">
              <span className="material-symbols-outlined text-3xl">local_hospital</span>
            </div>
            <h4 className="font-headline font-bold text-base text-[#1b1c1c] mb-1.5">
              Atención Rural
            </h4>
            <p className="text-xs text-[#434938] leading-relaxed">
              Visitas programadas a campo, sanidad y urgencias equinas.
            </p>
          </div>
        </div>
      </section>

      {/* Floating Action Button (Emergency 24hs) */}
      <button
        onClick={onOpenEmergency}
        aria-label="Emergencia Veterinaria 24hs"
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 w-14 h-14 bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <span className="material-symbols-outlined text-3xl animate-pulse">emergency</span>
        <span className="absolute right-16 bg-[#ba1a1a] text-white text-xs font-bold py-1 px-2.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
          Urgencias 24hs
        </span>
      </button>

      {/* Footer */}
      <footer className="bg-[#f0eded] border-t border-[#c3c9b3]/40 py-10 px-4 md:px-10">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img
              src={CLINIC_IMAGES.logo}
              alt="PETS Logo"
              className="h-8 w-auto grayscale opacity-70"
            />
            <span className="font-headline font-bold text-lg text-[#436900]">
              PETS Veterinaria Integral
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-[#434938] font-medium">
            <button onClick={onOpenEmergency} className="hover:text-[#ba1a1a] underline">
              Urgencias
            </button>
            <button onClick={() => onSelectTab('equipo')} className="hover:text-[#436900] underline">
              Staff Médico
            </button>
            <button onClick={() => onSelectTab('equipo')} className="hover:text-[#436900] underline">
              Sedes y Contacto
            </button>
            <button onClick={() => onSelectTab('admin')} className="hover:text-[#436900] underline">
              Acceso Administrativo
            </button>
          </div>

          <p className="text-xs text-[#737a66] text-center md:text-right">
            © 2024 PETS Veterinaria Integral. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
