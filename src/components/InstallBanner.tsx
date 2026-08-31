import React, { useEffect, useState } from 'react';
import { subscribeToPushNotifications } from '../utils/push';

export const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (!isStandalone) {
      const timer = setTimeout(() => {
        // Show banner after 30 seconds if prompt is available or it's iOS
        setShowBanner(true);
      }, 30000); // 30 seconds

      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
    // Also ask for notifications
    subscribeToPushNotifications();
  };

  const handleCloseClick = () => {
    setShowBanner(false);
    subscribeToPushNotifications();
  };

  if (!showBanner || (!deferredPrompt && !isIOS)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-[9999] animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#1b1c1c] text-white p-4 rounded-xl shadow-2xl flex flex-col md:flex-row items-center gap-4 max-w-3xl mx-auto border border-[#434938]">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 p-1">
          <img src="/vite.svg" alt="PETS App" className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="font-bold text-[#c7f173] text-sm md:text-base">¡Instala la App PETS y Activa Notificaciones!</h4>
          <p className="text-xs md:text-sm text-gray-300 mt-0.5">
            {isIOS 
              ? 'Toca el ícono Compartir en Safari y selecciona "Añadir a inicio" para instalar. Luego, permite las notificaciones.' 
              : 'Instala nuestra aplicación (Android/iOS) en tu pantalla de inicio para acceder más rápido y luego permite las notificaciones.'}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
          <button 
            onClick={handleCloseClick}
            className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-gray-300 hover:text-white transition-colors"
          >
            CERRAR
          </button>
          {!isIOS && (
            <button 
              onClick={handleInstallClick}
              className="flex-1 md:flex-none px-4 py-2 bg-[#8fc63d] text-[#111f00] rounded-lg text-xs font-bold hover:bg-[#9fd74d] transition-colors"
            >
              INSTALAR APP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
