import React from 'react';
import { INITIAL_STAFF, CLINIC_IMAGES } from '../../data/initialData';
import { TabType } from '../../types';

interface TeamViewProps {
  onSelectDoctorForBooking: (doctorId: string) => void;
  onSelectTab: (tab: TabType) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  onSelectDoctorForBooking,
  onSelectTab,
}) => {
  return (
    <div className="py-8 px-4 md:px-10 max-w-[1280px] mx-auto animate-in fade-in duration-300 space-y-16 md:space-y-24">
      {/* Header Section */}
      <section className="text-center pt-2 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c7f173]/50 text-[#324f00] text-xs font-bold uppercase tracking-wider mb-3">
          <span className="material-symbols-outlined text-sm">stethoscope</span>
          Cuerpo Médico & Especialistas
        </div>
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-[#436900] mb-3">
          Equipo PETS
        </h1>
        <p className="text-sm md:text-base text-[#434938] leading-relaxed">
          Conoce a los profesionales dedicados a la salud y bienestar de tus animales, tanto en la clínica como en el campo.
        </p>
      </section>

      {/* Staff Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {INITIAL_STAFF.slice(0, 3).map((doctor) => {
            return (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#7a5739]/20 flex flex-col h-full shadow-ambient hover:shadow-ambient-lg transition-all duration-300 group"
              >
                {/* Photo & Badge */}
                <div className="h-56 w-full bg-[#f6f3f2] relative overflow-hidden">
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-xs ${
                      doctor.badgeType === 'primary'
                        ? 'bg-[#436900] text-white'
                        : doctor.badgeType === 'tertiary'
                        ? 'bg-[#7a5739] text-white'
                        : 'bg-[#c7f173] text-[#141f00]'
                    }`}
                  >
                    {doctor.badge}
                  </div>
                </div>

                {/* Info & Booking Action */}
                <div className="p-6 flex flex-col flex-grow bg-white">
                  <h3 className="font-headline text-xl font-bold text-[#1b1c1c] mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#436900] mb-2">
                    {doctor.role} • {doctor.experienceYears} años de experiencia
                  </p>
                  <p className="text-xs text-[#434938] leading-relaxed mb-6 flex-1">
                    {doctor.description}
                  </p>

                  <div className="mt-auto pt-3 border-t border-[#c3c9b3]/20">
                    <button
                      onClick={() => onSelectDoctorForBooking(doctor.id)}
                      className="w-full bg-[#8fc63d] hover:bg-[#9fd74d] text-[#111f00] font-bold text-xs py-3 px-4 rounded-xl shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 uppercase"
                    >
                      <span className="material-symbols-outlined text-base">calendar_month</span>
                      Reservar con este profesional
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Nosotros (About Us) */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#f6f3f2] rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#7a5739]/15 shadow-ambient">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8fc63d]/20 text-[#324f00] text-xs font-bold uppercase tracking-wider">
              Nuestra Filosofía
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-[#436900]">
              Nosotros
            </h2>
            <p className="text-base md:text-lg text-[#1b1c1c] font-medium leading-relaxed">
              En PETS, nuestra misión es brindar atención médica veterinaria de excelencia, integrando la calidez humana con la más alta tecnología clínica.
            </p>
            <p className="text-xs md:text-sm text-[#434938] leading-relaxed">
              Entendemos el vínculo único entre las familias y sus mascotas, así como la importancia vital de la salud en la producción rural. Nuestro compromiso es velar por el bienestar animal en todos sus entornos, promoviendo una práctica ética, transparente y cercana.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-[#436900]">
              <span className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-lg border border-[#c3c9b3]/30">
                <span className="material-symbols-outlined text-sm filled">favorite</span> Vocación y Empatía
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-lg border border-[#c3c9b3]/30">
                <span className="material-symbols-outlined text-sm filled">biotech</span> Diagnóstico Preciso
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-lg border border-[#c3c9b3]/30">
                <span className="material-symbols-outlined text-sm filled">local_shipping</span> Cobertura de Campo
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 h-72 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-ambient border border-[#c3c9b3]/40">
            <img
              src={CLINIC_IMAGES.nosotrosDogClinic}
              alt="Veterinaria examinando afectuosamente a perro en PETS"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Ubicación y Contacto */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#e4e2e1] rounded-3xl p-6 sm:p-10 border border-[#7a5739]/15 shadow-ambient">
          {/* Contact Details */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#436900] text-white text-xs font-bold uppercase tracking-wider mb-2">
                Atención Continua
              </div>
              <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#436900] mb-2">
                Contacto
              </h2>
              <p className="text-xs sm:text-sm text-[#434938]">
                Estamos aquí para ayudarte. Visítanos en nuestra clínica central o comunícate con nosotros.
              </p>
            </div>

            <div className="space-y-4">
              {/* Dirección */}
              <div className="flex items-start gap-3.5 bg-white/70 p-3.5 rounded-xl border border-[#c3c9b3]/30">
                <div className="w-10 h-10 rounded-full bg-[#8fc63d]/20 text-[#436900] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl filled">location_on</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1b1c1c]">Dirección</p>
                  <p className="text-xs text-[#434938]">Av. San Martín 1234, Ciudad Veterinaria</p>
                </div>
              </div>

              {/* Teléfono */}
              <div className="flex items-start gap-3.5 bg-white/70 p-3.5 rounded-xl border border-[#c3c9b3]/30">
                <div className="w-10 h-10 rounded-full bg-[#8fc63d]/20 text-[#436900] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl filled">phone</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1b1c1c]">Teléfono / Urgencias 24hs</p>
                  <p className="text-xs text-[#434938] font-semibold">+54 11 1234-5678</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 bg-white/70 p-3.5 rounded-xl border border-[#c3c9b3]/30">
                <div className="w-10 h-10 rounded-full bg-[#8fc63d]/20 text-[#436900] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl filled">mail</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1b1c1c]">Email</p>
                  <p className="text-xs text-[#434938]">contacto@petsclinic.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Map Graphic */}
          <div className="h-72 sm:h-96 rounded-2xl overflow-hidden shadow-ambient border border-[#c3c9b3]/40 relative bg-white">
            <img
              src={CLINIC_IMAGES.mapIsometric}
              alt="Plano 3D interactivo de ubicación de clínica PETS"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#c3c9b3]/30 flex justify-between items-center text-xs">
              <span className="font-bold text-[#1b1c1c] flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-[#436900] filled">pin_drop</span>
                Sede Central PETS
              </span>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#436900] font-bold underline hover:text-[#324f00]"
              >
                Abrir en Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
