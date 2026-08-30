import React from 'react';
import { TabType } from '../types';
import { CLINIC_IMAGES } from '../data/initialData';

interface TopAppBarProps {
  user?: any;
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenDrawer: () => void;
  onOpenEmergency: () => void;
  onLogout?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  user,
  currentTab,
  onSelectTab,
  onOpenDrawer,
  onLogout,
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
        <nav className="hidden lg:flex items-center gap-3 xl:gap-7">
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
        </nav>

        {/* Right Side: Admin Link, Action Button & User Profile */}
        <div className="flex items-center gap-4">
          {user?.email === 'admin@pets.com' && (
            <button
              onClick={() => onSelectTab('admin')}
              className={`hidden lg:flex items-center gap-1.5 font-bold text-xs transition-colors ${
                currentTab === 'admin'
                  ? 'text-[#436900]'
                  : 'text-[#737a66] hover:text-[#436900]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">grid_view</span>
              Panel Admin
            </button>
          )}

          {user && (
            <div className="hidden lg:flex items-center gap-3 border-l border-[#c3c9b3]/30 pl-4 ml-2">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-[#1b1c1c]">{user.name}</span>
                <button
                  onClick={onLogout}
                  className="text-[10px] text-[#ba1a1a] font-medium hover:underline flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[12px]">logout</span>
                  Cerrar sesión
                </button>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#c7f173] text-[#324f00] flex items-center justify-center font-headline font-bold border border-[#8fc63d]">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          )}

          <button
            onClick={() => onSelectTab('reservas')}
            className="hidden lg:flex bg-[#8fc63d] hover:bg-[#9fd74d] text-[#111f00] px-5 py-2.5 rounded-xl font-bold text-xs items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-base">calendar_month</span>
            RESERVAR TURNO
          </button>
          
          {/* Mobile Only Action */}
          <button
            onClick={() => onSelectTab('reservas')}
            className="lg:hidden bg-[#8fc63d] text-[#111f00] p-2 rounded-lg shadow-sm"
          >
             <span className="material-symbols-outlined text-lg">calendar_month</span>
          </button>
        </div>
      </div>
    </header>
  );
};
