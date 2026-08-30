import React, { useState } from 'react';
import { Appointment } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickBookEmergency: (appointment: Partial<Appointment>) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onQuickBookEmergency,
}) => {
  const [animalType, setAnimalType] = useState('Perro');
  const [patientName, setPatientName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [symptom, setSymptom] = useState('Traumatismo / Sangrado');
  const [dispatched, setDispatched] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickBookEmergency({
      patientName: patientName || `Paciente Urgente (${animalType})`,
      species: animalType,
      serviceType: `Urgencia: ${symptom}`,
      doctorName: 'Guardia Médica 24hs (Dr. de Turno)',
      date: 'Inmediata',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'emergencia',
      emergency: true,
      ownerName: 'Ingreso Urgente',
      ownerPhone: ownerPhone || '+54 11 1234-5678',
      notes: `Alerta generada desde botón de emergencia: ${symptom}`,
    });
    setDispatched(true);
    setTimeout(() => {
      setDispatched(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-[#fbf9f8] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border-2 border-[#ba1a1a] z-10 animate-in zoom-in-95 duration-200">
        {/* Urgent Header */}
        <div className="bg-[#ffdad6] p-5 border-b border-[#ba1a1a]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-2xl">emergency</span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-lg text-[#93000a] leading-tight">
                Atención Veterinaria de Emergencia
              </h2>
              <p className="text-xs text-[#93000a]/90 font-medium">
                Guardia activa 24 Horas los 365 días del año
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#93000a] hover:bg-[#ffdad6] rounded-full"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick Call Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="tel:+541112345678"
              className="flex items-center justify-center gap-2.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition-all active:scale-95 text-center"
            >
              <span className="material-symbols-outlined text-xl">call</span>
              <div>
                <div className="text-xs uppercase opacity-80">Llamar a Urgencias</div>
                <div className="text-sm">+54 11 1234-5678</div>
              </div>
            </a>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-[#f0eded] hover:bg-[#eae8e7] text-[#1b1c1c] font-bold py-3 px-4 rounded-xl text-sm border border-[#c3c9b3]/40 transition-all text-center"
            >
              <span className="material-symbols-outlined text-xl text-[#436900]">directions</span>
              <div>
                <div className="text-xs text-[#434938] uppercase">Cómo Llegar</div>
                <div className="text-sm">Av. San Martín 1234</div>
              </div>
            </a>
          </div>

          {dispatched ? (
            <div className="p-5 bg-[#c7f173] text-[#141f00] rounded-xl text-center space-y-2 border border-[#8fc63d]">
              <span className="material-symbols-outlined text-4xl text-[#436900] filled">
                check_circle
              </span>
              <h3 className="font-headline font-bold text-base">
                ¡Alerta de Urgencia Notificada al Equipo!
              </h3>
              <p className="text-xs text-[#374e00]">
                El equipo de guardia ha sido alertado. Te estamos esperando en la clínica.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-[#c3c9b3]/30">
              <h3 className="font-headline font-bold text-sm text-[#1b1c1c] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg text-[#ba1a1a]">notification_important</span>
                Avisar a la Guardia en Camino (Check-in Urgente)
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#434938] mb-1">
                    Especie del animal
                  </label>
                  <select
                    value={animalType}
                    onChange={(e) => setAnimalType(e.target.value)}
                    className="w-full bg-[#ffffff] border border-[#c3c9b3] rounded-lg p-2.5 text-xs text-[#1b1c1c] focus:border-[#436900] focus:ring-1 focus:ring-[#436900] outline-none"
                  >
                    <option value="Perro">Perro (Canino)</option>
                    <option value="Gato">Gato (Felino)</option>
                    <option value="Caballo">Caballo (Equino)</option>
                    <option value="Vaca/Oveja">Vaca / Ganado</option>
                    <option value="Otro">Otro animal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#434938] mb-1">
                    Nombre del animal (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Rocky"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-[#ffffff] border border-[#c3c9b3] rounded-lg p-2.5 text-xs text-[#1b1c1c] focus:border-[#436900] focus:ring-1 focus:ring-[#436900] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434938] mb-1">
                  Motivo principal de urgencia
                </label>
                <select
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  className="w-full bg-[#ffffff] border border-[#c3c9b3] rounded-lg p-2.5 text-xs text-[#1b1c1c] focus:border-[#436900] focus:ring-1 focus:ring-[#436900] outline-none"
                >
                  <option value="Traumatismo / Accidente / Herida con sangrado">
                    Traumatismo / Accidente / Herida con sangrado
                  </option>
                  <option value="Convulsión o pérdida de conocimiento">
                    Convulsión o pérdida de conocimiento
                  </option>
                  <option value="Intoxicación / Ingesta de veneno">
                    Intoxicación / Ingesta de veneno
                  </option>
                  <option value="Dificultad respiratoria severa / Asfixia">
                    Dificultad respiratoria severa / Asfixia
                  </option>
                  <option value="Golpe de calor / Colapso">Golpe de calor / Colapso</option>
                  <option value="Cólico o dolor abdominal agudo">Cólico o dolor abdominal agudo</option>
                  <option value="Parto con complicaciones (Distocia)">
                    Parto con complicaciones (Distocia)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434938] mb-1">
                  Tu teléfono de contacto
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+54 9 11 1234-5678"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  className="w-full bg-[#ffffff] border border-[#c3c9b3] rounded-lg p-2.5 text-xs text-[#1b1c1c] focus:border-[#436900] focus:ring-1 focus:ring-[#436900] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-semibold text-[#737a66] hover:text-[#1b1c1c] px-3 py-2"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  NOTIFICAR INGRESO URGENTE
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
