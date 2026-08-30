import React, { useState } from 'react';
import { Appointment, StaffMember, Pet } from '../../types';
import { INITIAL_STAFF, CLINIC_IMAGES } from '../../data/initialData';

interface BookingViewProps {
  pets?: Pet[];
  initialDoctorId?: string | null;
  onBookingConfirmed: (newApt: Appointment) => void;
  onGoToAccount: () => void;
}

export const BookingView: React.FC<BookingViewProps> = ({
  pets = [],
  initialDoctorId,
  onBookingConfirmed,
  onGoToAccount,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedAnimal, setSelectedAnimal] = useState<string>('Perro');
  const [showOtherAnimal, setShowOtherAnimal] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string>('Consulta General');
  
  // Find initial doctor if passed
  const defaultDoc = INITIAL_STAFF.find((s) => s.id === initialDoctorId) || INITIAL_STAFF[3]; // Dra Ana Silva
  const [selectedDoctor, setSelectedDoctor] = useState<StaffMember>(defaultDoc);
  
  const [selectedDay, setSelectedDay] = useState<number>(3);
  const [selectedTime, setSelectedTime] = useState<string>('10:30');
  const [fullName, setFullName] = useState<string>('Maria González');
  const [phone, setPhone] = useState<string>('+54 9 11 1234-5678');
  const [reason, setReason] = useState<string>('Chequeo anual y control de vacunas.');
  const [confirmedTicket, setConfirmedTicket] = useState<string | null>(null);

  const animalOptions = [
    { label: 'Perro', icon: 'pets', color: 'text-[#436900]' },
    { label: 'Gato', icon: 'cruelty_free', color: 'text-[#436900]' },
    { label: 'Caballo', icon: 'agriculture', color: 'text-[#7a5739]' },
    { label: 'Vaca/Oveja', icon: 'grass', color: 'text-[#7a5739]' },
  ];

  const serviceOptions = [
    {
      title: 'Consulta General',
      desc: 'Revisión de rutina y vacunas.',
      icon: 'vaccines',
    },
    {
      title: 'Urgencia',
      desc: 'Atención médica inmediata.',
      icon: 'emergency',
    },
    {
      title: 'Cirugía / Especialidad',
      desc: 'Evaluación quirúrgica y estudios.',
      icon: 'content_cut',
    },
    {
      title: 'Visita a Campo / Rural',
      desc: 'Atención domiciliaria en establecimiento.',
      icon: 'agriculture',
    },
  ];

  const timeSlots = ['09:00', '10:30', '11:00', '14:00', '15:30', '17:00'];

  const handleConfirm = () => {
    const randomTicket = `#PT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      ticketNumber: randomTicket,
      patientName: `${selectedAnimal} de ${fullName.split(' ')[0]}`,
      species: selectedAnimal,
      serviceType: selectedService,
      doctorName: selectedDoctor.name,
      date: `${selectedDay} Octubre 2024`,
      time: selectedTime,
      status: 'confirmado',
      ownerName: fullName,
      ownerPhone: phone,
      notes: reason,
    };

    setConfirmedTicket(randomTicket);
    onBookingConfirmed(newAppointment);
  };

  const handleDownloadCalendar = () => {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//PETS Veterinaria//Turnos//ES
BEGIN:VEVENT
SUMMARY:Turno Veterinario PETS - ${selectedAnimal} (${selectedService})
DESCRIPTION:Cita con ${selectedDoctor.name}. Paciente: ${selectedAnimal}. Motivo: ${reason}
LOCATION:Av. San Martín 1234, Ciudad Veterinaria
DTSTART:20241003T103000Z
DTEND:20241003T111500Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Turno-PETS-${confirmedTicket || '8472'}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const progressPercent = confirmedTicket
    ? 100
    : currentStep === 1
    ? 25
    : currentStep === 2
    ? 50
    : currentStep === 3
    ? 75
    : 100;

  return (
    <div className="py-8 px-4 md:px-10 max-w-[1280px] mx-auto animate-in fade-in duration-300">
      <div className="max-w-2xl mx-auto bg-[#ffffff] rounded-2xl shadow-ambient border border-[#7a5739]/20 p-6 md:p-10">
        
        {/* Header & Steps Bar */}
        {!confirmedTicket && (
          <div className="mb-8">
            <h1 className="font-headline text-2xl md:text-3xl font-bold text-[#436900] mb-1">
              Reservar Turno
            </h1>
            <p className="text-sm text-[#434938]">
              Completa los pasos para agendar tu cita veterinaria.
            </p>

            {/* Progress Stepper */}
            <div className="relative flex justify-between items-center mt-6">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#eae8e7] -z-0 rounded" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#8fc63d] -z-0 rounded transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />

              {[1, 2, 3, 4].map((step) => {
                const isPassedOrCurrent = currentStep >= step;
                return (
                  <div key={step} className="flex flex-col items-center z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white transition-colors ${
                        isPassedOrCurrent
                          ? 'bg-[#8fc63d] text-[#111f00]'
                          : 'bg-[#eae8e7] text-[#434938]'
                      }`}
                    >
                      {step}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1: Animal & Service */}
        {!confirmedTicket && currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className="font-headline text-lg font-bold text-[#1b1c1c] mb-3">
                ¿Para quién es la cita?
              </h2>
              
              {pets.length > 0 && !showOtherAnimal ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {pets.map((pet) => (
                    <button
                      key={pet.id}
                      type="button"
                      onClick={() => {
                        setSelectedAnimal(pet.name);
                      }}
                      className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#c3c9b3]/40 bg-[#f6f3f2] hover:border-[#436900] transition-all group"
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden mb-2 border-2 border-transparent group-hover:border-[#8fc63d]">
                        <img 
                          src={pet.photo || CLINIC_IMAGES.petMaxPark} 
                          alt={pet.name} 
                          className="w-full h-full object-cover bg-gray-100" 
                          onError={(e) => { e.currentTarget.src = CLINIC_IMAGES.petMaxPark; }}
                        />
                      </div>
                      <span className="font-bold text-sm text-[#1b1c1c] group-hover:text-[#436900] truncate w-full px-1">{pet.name}</span>
                    </button>
                  ))}
                  
                  {/* Otra mascota button */}
                  <button
                    type="button"
                    onClick={() => setShowOtherAnimal(true)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-[#737a66] bg-[#f6f3f2] hover:bg-[#eae8e7] hover:border-[#436900] transition-all group"
                  >
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-[#737a66] group-hover:text-[#436900]">add</span>
                    </div>
                    <span className="font-bold text-sm text-[#737a66] group-hover:text-[#436900]">Otra mascota</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {animalOptions.map((item) => {
                    const isSelected = selectedAnimal === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setSelectedAnimal(item.label)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center group ${
                          isSelected
                            ? 'border-[#436900] bg-[#c7f173]/25 ring-2 ring-[#8fc63d]/30 font-bold shadow-xs'
                            : 'border-[#c3c9b3]/40 bg-[#f6f3f2] hover:border-[#436900] text-[#1b1c1c]'
                        }`}
                      >
                        <span
                        className={`material-symbols-outlined text-4xl mb-1.5 transition-transform group-hover:scale-110 ${
                          item.color
                        } ${isSelected ? 'filled' : ''}`}
                      >
                        {item.icon}
                      </span>
                      <span className="text-sm font-semibold text-[#1b1c1c]">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              )}
            </div>

            <div>
              <h2 className="font-headline text-lg font-bold text-[#1b1c1c] mb-3">
                ¿Qué servicio necesitas?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceOptions.map((srv) => {
                  const isSelected = selectedService === srv.title;
                  return (
                    <button
                      key={srv.title}
                      type="button"
                      onClick={() => setSelectedService(srv.title)}
                      className={`text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'border-[#436900] bg-[#c7f173]/25 ring-2 ring-[#8fc63d]/30 font-bold shadow-xs'
                          : 'border-[#c3c9b3]/40 bg-[#ffffff] hover:border-[#436900]'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-2xl mt-0.5 ${
                          srv.title === 'Urgencia' ? 'text-[#ba1a1a]' : 'text-[#436900]'
                        }`}
                      >
                        {srv.icon}
                      </span>
                      <div>
                        <span className="font-headline font-bold text-sm text-[#1b1c1c] block">
                          {srv.title}
                        </span>
                        <span className="text-xs text-[#434938] leading-tight block mt-0.5">
                          {srv.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#c3c9b3]/20">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="bg-[#8fc63d] hover:bg-[#9fd74d] text-[#111f00] font-bold text-sm px-7 py-3 rounded-lg shadow-sm active:scale-95 transition-all"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Doctor */}
        {!confirmedTicket && currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-headline text-lg font-bold text-[#1b1c1c] mb-1">
                Selecciona un Profesional
              </h2>
              <p className="text-xs text-[#434938] mb-4">
                Elige el veterinario especialista según tu preferencia.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INITIAL_STAFF.map((doc) => {
                  const isSelected = selectedDoctor.id === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => {
                        setSelectedDoctor(doc);
                        setCurrentStep(3);
                      }}
                      className={`border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3.5 ${
                        isSelected
                          ? 'border-[#436900] bg-[#c7f173]/20 ring-2 ring-[#8fc63d]/30 shadow-xs'
                          : 'border-[#7a5739]/20 bg-[#ffffff] hover:border-[#436900]'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#c3c9b3]">
                        <img
                          src={doc.photo}
                          alt={doc.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-headline font-bold text-sm text-[#1b1c1c] truncate">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-[#434938] truncate mb-1">
                          {doc.specialty}
                        </p>
                        <div className="flex items-center gap-1 text-[#436900]">
                          <span className="material-symbols-outlined text-sm filled">
                            star
                          </span>
                          <span className="text-xs font-bold">{doc.rating}</span>
                          <span className="text-[10px] text-[#737a66]">
                            ({doc.reviewsCount})
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#c3c9b3]/20">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="border-2 border-[#7a5739] text-[#7a5739] font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-[#7a5739]/10 transition-colors"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="bg-[#8fc63d] hover:bg-[#9fd74d] text-[#111f00] font-bold text-sm px-7 py-3 rounded-lg shadow-sm active:scale-95 transition-all"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Date & Time */}
        {!confirmedTicket && currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-headline text-lg font-bold text-[#1b1c1c] mb-1">
                Fecha y Hora
              </h2>
              <p className="text-xs text-[#434938] mb-4">
                Selecciona el día y horario disponible para tu atención.
              </p>

              {/* Interactive Calendar Widget */}
              <div className="p-4 bg-[#f6f3f2] rounded-xl border border-[#c3c9b3]/30 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <button className="p-1 rounded-full hover:bg-white text-[#434938]">
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                  </button>
                  <span className="font-headline font-bold text-sm text-[#1b1c1c]">
                    Octubre 2024
                  </span>
                  <button className="p-1 rounded-full hover:bg-white text-[#434938]">
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
                    <span key={day} className="text-[11px] font-bold text-[#737a66]">
                      {day}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-center">
                  <div className="p-2 text-xs text-transparent">.</div>
                  <div className="p-2 text-xs text-transparent">.</div>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((d) => {
                    const isSelected = selectedDay === d;
                    const isWeekend = d % 7 === 5 || d % 7 === 6;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => !isWeekend && setSelectedDay(d)}
                        disabled={isWeekend}
                        className={`h-9 w-9 mx-auto rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#8fc63d] text-[#111f00] font-bold shadow-xs scale-105'
                            : isWeekend
                            ? 'text-[#737a66]/40 cursor-not-allowed'
                            : 'text-[#1b1c1c] hover:bg-white'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <h3 className="font-headline font-bold text-xs text-[#1b1c1c] uppercase tracking-wider mb-2.5">
                Horarios Disponibles ({selectedDay} de Octubre)
              </h3>
              <div className="grid grid-cols-3 gap-2.5">
                {timeSlots.map((slot) => {
                  const isSelected = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setSelectedTime(slot);
                        setCurrentStep(4);
                      }}
                      className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-all ${
                        isSelected
                          ? 'border-[#436900] bg-[#8fc63d] text-[#111f00] shadow-xs'
                          : 'border-[#c3c9b3]/40 bg-white text-[#1b1c1c] hover:border-[#436900]'
                      }`}
                    >
                      {slot} hs
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#c3c9b3]/20">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="border-2 border-[#7a5739] text-[#7a5739] font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-[#7a5739]/10 transition-colors"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="bg-[#8fc63d] hover:bg-[#9fd74d] text-[#111f00] font-bold text-sm px-7 py-3 rounded-lg shadow-sm active:scale-95 transition-all"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Details & Confirm */}
        {!confirmedTicket && currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-headline text-lg font-bold text-[#1b1c1c] mb-1">
                Tus Datos
              </h2>
              <p className="text-xs text-[#434938] mb-4">
                Verifica tus datos de contacto antes de confirmar la cita.
              </p>

              <div className="space-y-3.5 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-[#434938] mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-[#ffffff] border border-[#c3c9b3] rounded-lg p-3 text-sm text-[#1b1c1c] focus:border-[#436900] focus:ring-1 focus:ring-[#436900] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#434938] mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+54 9 11 1234-5678"
                    className="w-full bg-[#ffffff] border border-[#c3c9b3] rounded-lg p-3 text-sm text-[#1b1c1c] focus:border-[#436900] focus:ring-1 focus:ring-[#436900] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#434938] mb-1">
                    Motivo de la consulta (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Breve descripción..."
                    className="w-full bg-[#ffffff] border border-[#c3c9b3] rounded-lg p-3 text-sm text-[#1b1c1c] focus:border-[#436900] focus:ring-1 focus:ring-[#436900] outline-none resize-none"
                  />
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-[#f6f3f2] p-4 rounded-xl border border-[#c3c9b3]/40 space-y-2">
                <h3 className="font-headline font-bold text-xs uppercase text-[#1b1c1c] tracking-wider mb-2">
                  Resumen de la Cita
                </h3>
                <div className="text-xs text-[#434938] flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#436900]">pets</span>
                  <span><strong>{selectedAnimal}</strong> — {selectedService}</span>
                </div>
                <div className="text-xs text-[#434938] flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#436900]">person</span>
                  <span>{selectedDoctor.name} ({selectedDoctor.specialty})</span>
                </div>
                <div className="text-xs text-[#434938] flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#436900]">event</span>
                  <span>Jueves {selectedDay} Octubre 2024, {selectedTime} hrs</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#c3c9b3]/20">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="text-xs font-bold text-[#7a5739] hover:underline"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="bg-[#8fc63d] hover:bg-[#9fd74d] text-[#111f00] font-bold text-sm px-8 py-3 rounded-lg shadow-sm active:scale-95 transition-all"
              >
                Confirmar Reserva
              </button>
            </div>
          </div>
        )}

        {/* CONFIRMATION SCREEN */}
        {confirmedTicket && (
          <div className="text-center py-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-[#c7f173]/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#8fc63d]">
              <span className="material-symbols-outlined text-5xl text-[#436900] filled">
                check_circle
              </span>
            </div>

            <h2 className="font-headline text-2xl font-bold text-[#1b1c1c] mb-1">
              ¡Reserva Confirmada!
            </h2>
            <p className="text-sm text-[#434938] mb-6">
              Tu número de reserva es:{' '}
              <span className="font-bold text-[#436900] text-base">{confirmedTicket}</span>
            </p>

            <div className="bg-[#f6f3f2] p-4 rounded-xl max-w-sm mx-auto mb-6 text-left text-xs space-y-1.5 border border-[#c3c9b3]/30">
              <div><strong>Paciente:</strong> {selectedAnimal} ({fullName})</div>
              <div><strong>Profesional:</strong> {selectedDoctor.name}</div>
              <div><strong>Fecha & Hora:</strong> {selectedDay} Oct, {selectedTime} hs</div>
              <div><strong>Sede:</strong> Av. San Martín 1234, Ciudad Veterinaria</div>
            </div>

            <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
              <button
                type="button"
                onClick={handleDownloadCalendar}
                className="bg-[#8fc63d] hover:bg-[#9fd74d] text-[#111f00] font-bold text-xs py-3 px-5 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 uppercase"
              >
                <span className="material-symbols-outlined text-lg">calendar_add_on</span>
                Agregar al Calendario (.ics)
              </button>

              <button
                type="button"
                onClick={onGoToAccount}
                className="border-2 border-[#7a5739] text-[#7a5739] font-bold text-xs py-2.5 px-5 rounded-lg hover:bg-[#7a5739]/10 transition-colors"
              >
                Ver en Mi Cuenta
              </button>

              <button
                type="button"
                onClick={() => {
                  setConfirmedTicket(null);
                  setCurrentStep(1);
                }}
                className="text-xs text-[#737a66] hover:text-[#1b1c1c] underline mt-1"
              >
                Hacer otra reserva
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
