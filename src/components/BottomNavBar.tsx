import React from 'react';
import { TabType } from '../types';

interface BottomNavBarProps {
  user?: any;
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  user,
  currentTab,
  onSelectTab,
}) => {
  const baseTabs = [
    { id: 'inicio', label: 'Inicio', icon: 'home' },
    { id: 'reservas', label: 'Reservas', icon: 'calendar_month' },
    { id: 'auxilios', label: 'Auxilios', icon: 'medical_services' },
    { id: 'cuenta', label: 'Mi Cuenta', icon: 'account_circle' },
  ] as const;

  const tabs = user?.email === 'admin@pets.com'
    ? [
        { id: 'reservas', label: 'Reservas', icon: 'calendar_month' },
        { id: 'admin', label: 'Admin', icon: 'dashboard_customize' },
      ]
    : baseTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#fbf9f8]/95 backdrop-blur-md shadow-[0px_-2px_12px_rgba(0,0,0,0.06)] border-t border-[#c3c9b3]/30 px-3 py-2 flex justify-around items-center">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center transition-all ${
              isActive
                ? 'bg-[#c7f173] text-[#374e00] rounded-full px-4 py-1 scale-100 font-bold shadow-xs'
                : 'text-[#434938] hover:text-[#436900] px-2 py-1'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] leading-none ${
                isActive ? 'filled' : ''
              }`}
            >
              {tab.icon}
            </span>
            <span className="font-semibold text-[11px] mt-0.5 tracking-tight">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
