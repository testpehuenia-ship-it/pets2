import React from 'react';
import { TabType } from '../types';
import { CLINIC_IMAGES } from '../data/initialData';

interface NavigationDrawerProps {
  user?: any;
  pets?: Pet[];
  isOpen: boolean;
  onClose: () => void;
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenEmergency: () => void;
  onLogout: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  user,
  pets = [],
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  onOpenEmergency,
  onLogout,
}) => {
  if (!isOpen) return null;

  const baseNavItems = [
    { id: 'inicio', label: 'Inicio', icon: 'home', desc: 'Página principal y bienvenida' },
    { id: 'reservas', label: 'Reservar Turno', icon: 'calendar_month', desc: 'Agenda tu cita en 4 pasos' },
    { id: 'auxilios', label: 'Primeros Auxilios', icon: 'medical_services', desc: 'Guía rápida de emergencias' },
    { id: 'cuenta', label: 'Mi Cuenta / Mascotas', icon: 'account_circle', desc: 'Perfil de Max, Luna y vacunas' },
    { id: 'equipo', label: 'Equipo PETS & Contacto', icon: 'stethoscope', desc: 'Veterinarios, clínica y sedes' },
  ];

  const navItems = user?.email === 'admin@pets.com' 
    ? [
        { id: 'reservas', label: 'Reservar Turno', icon: 'calendar_month', desc: 'Agenda tu cita en 4 pasos' },
        { id: 'cuenta', label: 'Mi Cuenta / Mascotas', icon: 'account_circle', desc: 'Perfil de Max, Luna y vacunas' },
        { id: 'admin' as TabType, label: 'Panel Administrativo', icon: 'dashboard_customize', desc: 'Métricas, turnos del día y campo' }
      ]
    : baseNavItems;

  return (
    <div className="fixed inset-0 z-[100] flex animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative w-80 max-w-[85vw] bg-[#fbf9f8] h-full shadow-2xl flex flex-col z-10 border-r border-[#c3c9b3]/30 overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-6 bg-[#f0eded] border-b border-[#c3c9b3]/30 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#8fc63d] bg-[#c7f173] text-[#324f00] flex items-center justify-center font-headline font-bold text-xl">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-headline font-bold text-base text-[#1b1c1c]">{user?.name || 'Invitado'}</h3>
                <span className="text-xs text-[#434938] font-medium">{user ? 'Cliente PETS' : 'Bienvenido'}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#737a66] hover:bg-[#e4e2e1]"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          {user && (
            <p className="text-xs text-[#434938] bg-white/70 px-2.5 py-1.5 rounded-md border border-[#c3c9b3]/20">
              🐾 {pets.length} Mascotas registradas{pets.length > 0 ? `: ${pets.map(p => p.name).join(', ')}` : ''}
            </p>
          )}
        </div>

        {/* Navigation list */}
        <div className="p-4 flex-1 space-y-1.5">
          <p className="text-[11px] font-bold text-[#737a66] uppercase tracking-wider px-3 mb-2">
            Navegación
          </p>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full text-left px-3.5 py-3 rounded-xl flex items-center gap-3.5 transition-all ${
                  isActive
                    ? 'bg-[#c7f173] text-[#141f00] font-bold shadow-xs'
                    : 'text-[#434938] hover:bg-[#eae8e7] hover:text-[#1b1c1c]'
                }`}
              >
                <span className={`material-symbols-outlined text-2xl ${isActive ? 'filled text-[#436900]' : 'text-[#737a66]'}`}>
                  {item.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm leading-tight">{item.label}</div>
                  <div className="text-[11px] text-[#737a66] font-normal truncate">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* User Actions */}
        {user && (
          <div className="px-4 pb-2">
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full text-left px-3.5 py-3 rounded-xl flex items-center gap-3.5 transition-all text-[#ba1a1a] hover:bg-[#ffdad6]/40"
            >
              <span className="material-symbols-outlined text-2xl">logout</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold leading-tight">Cerrar Sesión</div>
                <div className="text-[11px] font-normal truncate">Salir de tu cuenta</div>
              </div>
            </button>
          </div>
        )}

        {/* Urgent Emergency Call Button */}
        <div className="p-4 bg-[#ffdad6]/40 border-t border-[#ffdad6] m-4 rounded-xl">
          <div className="flex items-center gap-2 text-[#93000a] font-bold text-xs uppercase mb-1">
            <span className="material-symbols-outlined text-base">emergency</span>
            Guardia 24 Horas
          </div>
          <p className="text-xs text-[#1b1c1c] mb-3">
            ¿Tu mascota o animal de campo necesita atención urgente inmediata?
          </p>
          <button
            onClick={() => {
              onClose();
              onOpenEmergency();
            }}
            className="w-full bg-[#ba1a1a] text-white py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#93000a] shadow-xs active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-sm">phone_in_talk</span>
            LLAMAR A URGENCIAS (+54 11 1234-5678)
          </button>
        </div>

        {/* Drawer footer info */}
        <div className="p-4 text-center border-t border-[#c3c9b3]/20 text-[11px] text-[#737a66]">
          PETS Veterinaria Integral © 2024
        </div>
      </div>
    </div>
  );
};
