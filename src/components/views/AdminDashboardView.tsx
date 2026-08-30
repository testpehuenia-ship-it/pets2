import React, { useState } from 'react';
import { Appointment, FieldAlert } from '../../types';

interface AdminDashboardViewProps {
  appointments: Appointment[];
  fieldAlerts: FieldAlert[];
  onOpenBooking: () => void;
  onOpenEmergency: () => void;
  onUpdateAppointmentStatus: (id: string, status: Appointment['status']) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  appointments,
  fieldAlerts,
  onOpenBooking,
  onOpenEmergency,
  onUpdateAppointmentStatus,
}) => {
  const [activeModal, setActiveModal] = useState<'none' | 'fichas' | 'servicios' | 'agenda'>('none');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'todos' | 'hoy' | 'emergencia'>('todos');

  const emergenciesCount = appointments.filter((a) => a.emergency || a.status === 'emergencia').length;
  const todayCount = appointments.length;

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedStatusFilter === 'emergencia') return apt.emergency || apt.status === 'emergencia';
    return true;
  });

  return (
    <div className="py-6 md:py-10 px-4 md:px-10 max-w-[1280px] mx-auto animate-in fade-in duration-300">
      {/* Dashboard Header */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-[#436900] mb-1">
              Panel Administrativo
            </h1>
            <p className="text-sm md:text-base text-[#434938]">
              Resumen de operaciones del día y flujo clínico en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="bg-[#8fc63d] hover:bg-[#9fd74d] text-[#111f00] font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 uppercase transition-all"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              Nuevo Turno
            </button>
            <button
              onClick={onOpenEmergency}
              className="bg-[#ffdad6] hover:bg-[#ffdad6]/80 text-[#93000a] font-bold text-xs px-4 py-2.5 rounded-lg border border-[#ba1a1a]/30 flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-base text-[#ba1a1a]">emergency</span>
              Ingreso Urgencia
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        {/* Metric 1: Pacientes Hoy */}
        <div className="bg-[#f0eded] p-5 rounded-2xl flex flex-col justify-center items-center border border-[#c3c9b3]/40 shadow-xs">
          <span className="font-headline text-3xl md:text-4xl font-bold text-[#436900]">
            {40 + todayCount}
          </span>
          <span className="text-xs md:text-sm font-semibold text-[#434938] text-center mt-1">
            Pacientes Hoy
          </span>
        </div>

        {/* Metric 2: Emergencias */}
        <div className="bg-[#ffdad6] p-5 rounded-2xl flex flex-col justify-center items-center border border-[#ba1a1a]/25 shadow-xs">
          <span className="font-headline text-3xl md:text-4xl font-bold text-[#ba1a1a]">
            {emergenciesCount > 0 ? emergenciesCount : 3}
          </span>
          <span className="text-xs md:text-sm font-semibold text-[#93000a] text-center mt-1">
            Emergencias
          </span>
        </div>

        {/* Metric 3: Nuevos Clientes */}
        <div className="bg-[#c7f173] p-5 rounded-2xl flex flex-col justify-center items-center border border-[#8fc63d]/40 shadow-xs">
          <span className="font-headline text-3xl md:text-4xl font-bold text-[#4f6e00]">
            8
          </span>
          <span className="text-xs md:text-sm font-semibold text-[#4f6e00] text-center mt-1">
            Nuevos Clientes
          </span>
        </div>

        {/* Metric 4: Alertas Campo */}
        <div className="bg-[#d9ad89]/50 p-5 rounded-2xl flex flex-col justify-center items-center border border-[#7a5739]/30 shadow-xs">
          <span className="font-headline text-3xl md:text-4xl font-bold text-[#604024]">
            {fieldAlerts.length}
          </span>
          <span className="text-xs md:text-sm font-semibold text-[#604024] text-center mt-1">
            Alertas Campo
          </span>
        </div>
      </section>

      {/* Main Grid: Turnos + Alertas & Gestión */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Turnos del Día */}
        <section className="lg:col-span-8 bg-[#f6f3f2] rounded-2xl p-5 md:p-7 border border-[#c3c9b3]/40 shadow-ambient flex flex-col">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#c3c9b3]/30">
            <div>
              <h2 className="font-headline text-xl font-bold text-[#1b1c1c]">
                Turnos del Día
              </h2>
              <span className="text-xs text-[#737a66]">
                {filteredAppointments.length} turnos registrados para hoy
              </span>
            </div>

            <button
              onClick={() => setActiveModal('agenda')}
              className="text-[#436900] font-bold text-xs underline hover:text-[#324f00] flex items-center gap-1"
            >
              <span>Ver Agenda Completa</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </button>
          </div>

          {/* Turnos List */}
          <div className="space-y-3 flex-1">
            {filteredAppointments.map((apt) => {
              const isEmergency = apt.emergency || apt.status === 'emergencia';
              const isEnAtencion = apt.status === 'en_atencion';

              return (
                <div
                  key={apt.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all gap-3 ${
                    isEmergency
                      ? 'bg-[#ffdad6] border-[#ba1a1a]/35'
                      : 'bg-white border-[#c3c9b3]/30 hover:border-[#8fc63d]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Time Badge */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                        isEmergency
                          ? 'bg-[#ba1a1a] text-white'
                          : isEnAtencion
                          ? 'bg-[#c7f173] text-[#4f6e00]'
                          : 'bg-[#8fc63d] text-[#111f00]'
                      }`}
                    >
                      {apt.timeBadge || apt.time}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3
                        className={`font-headline font-bold text-sm truncate ${
                          isEmergency ? 'text-[#93000a]' : 'text-[#1b1c1c]'
                        }`}
                      >
                        {apt.patientName}
                      </h3>
                      <p
                        className={`text-xs truncate ${
                          isEmergency ? 'text-[#93000a]/80' : 'text-[#434938]'
                        }`}
                      >
                        {apt.serviceType} - {apt.doctorName}
                      </p>
                      <span className="text-[11px] text-[#737a66] block">
                        Tutor: {apt.ownerName} ({apt.ownerPhone})
                      </span>
                    </div>
                  </div>

                  {/* Actions & Status Selector */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#c3c9b3]/20">
                    <select
                      value={apt.status}
                      onChange={(e) =>
                        onUpdateAppointmentStatus(apt.id, e.target.value as any)
                      }
                      className={`text-xs font-bold py-1 px-2.5 rounded-lg border outline-none cursor-pointer ${
                        isEmergency
                          ? 'bg-white text-[#ba1a1a] border-[#ba1a1a]'
                          : apt.status === 'completado'
                          ? 'bg-[#eae8e7] text-[#737a66] border-[#c3c9b3]'
                          : apt.status === 'en_atencion'
                          ? 'bg-[#c7f173] text-[#324f00] border-[#8fc63d]'
                          : 'bg-white text-[#436900] border-[#8fc63d]'
                      }`}
                    >
                      <option value="en_espera">En Espera</option>
                      <option value="en_atencion">En Atención</option>
                      <option value="emergencia">Emergencia</option>
                      <option value="completado">Completado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>

                    <span
                      className={`material-symbols-outlined text-xl ${
                        isEmergency
                          ? 'text-[#ba1a1a]'
                          : apt.serviceType.toLowerCase().includes('vacuna')
                          ? 'text-[#737a66]'
                          : 'text-[#737a66]'
                      }`}
                    >
                      {isEmergency
                        ? 'warning'
                        : apt.serviceType.toLowerCase().includes('vacuna')
                        ? 'vaccines'
                        : 'pets'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Column: Alertas Campo & Gestión Rápida */}
        <div className="lg:col-span-4 space-y-6">
          {/* Alertas Campo */}
          <section className="bg-[#ffdcc1]/30 rounded-2xl p-5 md:p-6 border border-[#7a5739]/25 shadow-xs">
            <h2 className="font-headline text-lg font-bold text-[#1b1c1c] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7a5739] filled">
                agriculture
              </span>
              Alertas Campo
            </h2>

            <ul className="space-y-3">
              {fieldAlerts.map((alert) => (
                <li
                  key={alert.id}
                  className="bg-white p-3.5 rounded-xl border border-[#c3c9b3]/30 flex gap-3 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[#7a5739] text-xl mt-0.5 filled">
                    notifications_active
                  </span>
                  <div>
                    <p className="font-headline font-bold text-xs text-[#1b1c1c]">
                      {alert.title}
                    </p>
                    <p className="text-xs text-[#434938] mt-0.5 leading-relaxed">
                      {alert.description}
                    </p>
                    <span className="text-[10px] text-[#737a66] font-medium block mt-1">
                      {alert.location} • {alert.time}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Gestión Rápida */}
          <section className="bg-[#eae8e7] rounded-2xl p-5 md:p-6 border border-[#c3c9b3]/40">
            <h2 className="font-headline text-lg font-bold text-[#1b1c1c] mb-4">
              Gestión Rápida
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveModal('fichas')}
                className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-[#c3c9b3]/30 hover:border-[#436900] hover:bg-[#c7f173]/15 transition-all shadow-2xs group"
              >
                <span className="material-symbols-outlined text-[#436900] text-3xl mb-2 group-hover:scale-110 transition-transform">
                  folder_shared
                </span>
                <span className="font-headline font-bold text-xs text-[#1b1c1c] text-center">
                  Fichas Clínicas
                </span>
              </button>

              <button
                onClick={() => setActiveModal('servicios')}
                className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-[#c3c9b3]/30 hover:border-[#436900] hover:bg-[#c7f173]/15 transition-all shadow-2xs group"
              >
                <span className="material-symbols-outlined text-[#436900] text-3xl mb-2 group-hover:scale-110 transition-transform">
                  settings
                </span>
                <span className="font-headline font-bold text-xs text-[#1b1c1c] text-center">
                  Servicios
                </span>
              </button>
            </div>
          </section>

          {/* Notificaciones Masivas */}
          <section className="bg-white rounded-2xl p-5 md:p-6 border border-[#c3c9b3]/40 shadow-xs">
            <h2 className="font-headline text-lg font-bold text-[#1b1c1c] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#436900] filled">
                campaign
              </span>
              Aviso General (Push)
            </h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const title = (form.elements.namedItem('title') as HTMLInputElement).value;
              const body = (form.elements.namedItem('body') as HTMLTextAreaElement).value;
              
              const token = localStorage.getItem('pets_token');
              if (token) {
                try {
                  const res = await fetch('/api/push/admin-broadcast', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ title, body })
                  });
                  if (res.ok) {
                    alert('Notificación enviada a todos los usuarios registrados.');
                    form.reset();
                  }
                } catch(e) {
                  alert('Error al enviar notificación.');
                }
              }
            }} className="space-y-3">
              <input type="text" name="title" required placeholder="Ej: Clínica cerrada el 20/05" className="w-full text-xs p-3 rounded-xl border border-[#c3c9b3]/50 focus:border-[#436900] focus:ring-1 focus:ring-[#436900] outline-none" />
              <textarea name="body" required rows={2} placeholder="Mensaje para todos los clientes..." className="w-full text-xs p-3 rounded-xl border border-[#c3c9b3]/50 focus:border-[#436900] focus:ring-1 focus:ring-[#436900] outline-none"></textarea>
              <button type="submit" className="w-full bg-[#1b1c1c] hover:bg-[#343534] text-white font-bold text-xs px-4 py-3 rounded-xl transition-all">
                Enviar Notificación Push
              </button>
            </form>
          </section>
        </div>
      </div>

      {/* Modal: Fichas Clínicas */}
      {activeModal === 'fichas' && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setActiveModal('none')}
          />
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-lg w-full z-10 border border-[#c3c9b3]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline font-bold text-lg text-[#436900] flex items-center gap-2">
                <span className="material-symbols-outlined">folder_shared</span>
                Fichas Clínicas e Historias
              </h3>
              <button
                onClick={() => setActiveModal('none')}
                className="p-1 rounded-full text-[#737a66] hover:bg-[#eae8e7]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3.5 bg-[#f6f3f2] rounded-xl border border-[#c3c9b3]/30">
                <div className="flex justify-between font-bold text-xs text-[#1b1c1c]">
                  <span>#FC-0091 • Max (Golden Retriever)</span>
                  <span className="text-[#436900]">Activa</span>
                </div>
                <p className="text-xs text-[#434938] mt-1">
                  Tutor: Maria González • Vacunación séxtuple al día. Próximo refuerzo antirrábica.
                </p>
              </div>

              <div className="p-3.5 bg-[#f6f3f2] rounded-xl border border-[#c3c9b3]/30">
                <div className="flex justify-between font-bold text-xs text-[#1b1c1c]">
                  <span>#FC-0092 • Luna (Gato Común)</span>
                  <span className="text-[#436900]">Activa</span>
                </div>
                <p className="text-xs text-[#434938] mt-1">
                  Tutor: Maria González • Triple felina completa. Control renal anual en noviembre.
                </p>
              </div>

              <div className="p-3.5 bg-[#f6f3f2] rounded-xl border border-[#c3c9b3]/30">
                <div className="flex justify-between font-bold text-xs text-[#1b1c1c]">
                  <span>#FC-0093 • Rocky (Bulldog Francés)</span>
                  <span className="text-[#ba1a1a]">Urgencia</span>
                </div>
                <p className="text-xs text-[#434938] mt-1">
                  Tutor: Esteban Morales • Reacción alérgica aguda en curso. Tratamiento con antihistamínicos.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#c3c9b3]/30 flex justify-end">
              <button
                onClick={() => setActiveModal('none')}
                className="bg-[#436900] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-[#324f00]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Servicios */}
      {activeModal === 'servicios' && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setActiveModal('none')}
          />
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full z-10 border border-[#c3c9b3]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline font-bold text-lg text-[#436900] flex items-center gap-2">
                <span className="material-symbols-outlined">settings</span>
                Catálogo de Servicios Clínicos
              </h3>
              <button
                onClick={() => setActiveModal('none')}
                className="p-1 rounded-full text-[#737a66] hover:bg-[#eae8e7]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#1b1c1c]">
              <div className="p-3 bg-[#f6f3f2] rounded-lg flex justify-between items-center">
                <span>Consulta Clínica General</span>
                <span className="font-bold text-[#436900]">$ 18.000</span>
              </div>
              <div className="p-3 bg-[#f6f3f2] rounded-lg flex justify-between items-center">
                <span>Vacunación Séxtuple / Antirrábica</span>
                <span className="font-bold text-[#436900]">$ 22.000</span>
              </div>
              <div className="p-3 bg-[#f6f3f2] rounded-lg flex justify-between items-center">
                <span>Visita Veterinaria a Campo (Equinos/Bovinos)</span>
                <span className="font-bold text-[#436900]">$ 45.000 + km</span>
              </div>
              <div className="p-3 bg-[#f6f3f2] rounded-lg flex justify-between items-center">
                <span>Guardia de Urgencia 24hs</span>
                <span className="font-bold text-[#ba1a1a]">$ 32.000</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#c3c9b3]/30 flex justify-end">
              <button
                onClick={() => setActiveModal('none')}
                className="bg-[#436900] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-[#324f00]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Agenda Completa */}
      {activeModal === 'agenda' && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setActiveModal('none')}
          />
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-2xl w-full z-10 border border-[#c3c9b3]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline font-bold text-lg text-[#436900] flex items-center gap-2">
                <span className="material-symbols-outlined">calendar_month</span>
                Agenda Completa de Consultorios
              </h3>
              <button
                onClick={() => setActiveModal('none')}
                className="p-1 rounded-full text-[#737a66] hover:bg-[#eae8e7]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 bg-[#f6f3f2] rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="text-[#1b1c1c]">{apt.time} - {apt.patientName}</strong>
                    <div className="text-[#434938]">{apt.serviceType} • {apt.doctorName}</div>
                    <div className="text-[10px] text-[#737a66]">{apt.ownerName} ({apt.ownerPhone})</div>
                  </div>
                  <span className="font-bold uppercase px-2 py-0.5 rounded text-[10px] bg-white border">
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#c3c9b3]/30 flex justify-end">
              <button
                onClick={() => setActiveModal('none')}
                className="bg-[#436900] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-[#324f00]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
