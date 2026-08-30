import React from 'react';
import { TabType } from '../types';
import { CLINIC_IMAGES } from '../data/initialData';

interface TopAppBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenDrawer: () => void;
  onOpenEmergency: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenDrawer,
}) => {
  return (
    <header className="bg-[#fbf9f8]/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-[#c3c9b3]/20">
      <div className="flex justify-between items-center px-4 md:px-10 py-3.5 w-full max-w-[1280px] mx-auto">
        {/* Left Side: Mobile Hamburger & Logo */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={onOpenDrawer}
            className="p-1.5 rounded-lg text-[#434938] hover:text-[#436900] hover:bg-[#eae8e7] transition-colors focus:outline-none"
            aria-label="Abrir menú de navegación"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <button
            onClick={() => onSelectTab('inicio')}
            className="flex items-center gap-2 text-left focus:outline-none group"
          >
            <img
              src={CLINIC_IMAGES.logo}
              alt="PETS Logo"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-[#436900]">
              PETS
            </span>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          <button
            onClick={() => onSelectTab('inicio')}
            className={`font-semibold text-sm transition-all pb-1 ${
              currentTab === 'inicio'
                ? 'text-[#436900] border-b-2 border-[#436900]'
                : 'text-[#434938] hover:text-[#436900]'
            }`}
          >
            Inicio
          </button>

          <button
            onClick={() => onSelectTab('reservas')}
            className={`font-semibold text-sm transition-all pb-1 ${
              currentTab === 'reservas'
                ? 'text-[#436900] border-b-2 border-[#436900]'
                : 'text-[#434938] hover:text-[#436900]'
            }`}
          >
            Reservar Turno
          </button>

          <button
            onClick={() => onSelectTab('auxilios')}
            className={`font-semibold text-sm transition-all pb-1 ${
              currentTab === 'auxilios'
                ? 'text-[#436900] border-b-2 border-[#436900]'
                : 'text-[#434938] hover:text-[#436900]'
            }`}
          >
            Primeros Auxilios
          </button>

          <button
            onClick={() => onSelectTab('cuenta')}
            className={`font-semibold text-sm transition-all pb-1 ${
              currentTab === 'cuenta'
                ? 'text-[#436900] border-b-2 border-[#436900]'
                : 'text-[#434938] hover:text-[#436900]'
            }`}
          >
            Mi Cuenta
          </button>

          <button
            onClick={() => onSelectTab('equipo')}
            className={`font-semibold text-sm transition-all pb-1 ${
              currentTab === 'equipo'
                ? 'text-[#436900] border-b-2 border-[#436900]'
                : 'text-[#434938] hover:text-[#436900]'
            }`}
          >
            Equipo y Contacto
          </button>

          <button
            onClick={() => onSelectTab('admin')}
            className={`font-semibold text-sm transition-all pb-1 flex items-center gap-1.5 ${
              currentTab === 'admin'
                ? 'text-[#436900] border-b-2 border-[#436900]'
                : 'text-[#434938] hover:text-[#436900]'
            }`}
          >
            <span className="material-symbols-outlined text-base">dashboard</span>
            Panel Admin
          </button>
        </nav>

        {/* Right CTA Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('reservas')}
            className="bg-[#8fc63d] text-[#111f00] font-bold text-xs md:text-sm tracking-wide px-4 py-2.5 rounded-lg shadow-sm hover:bg-[#9fd74d] active:scale-95 transition-all flex items-center gap-1.5 uppercase"
          >
            <span className="material-symbols-outlined text-lg">calendar_month</span>
            <span className="hidden sm:inline">RESERVAR TURNO</span>
            <span className="sm:hidden">TURNO</span>
          </button>
        </div>
      </div>
    </header>
  );
};
