import React, { useState } from 'react';
import { Appointment, CatalogItem, Invoice } from '../../types';
import { BillingModal } from './BillingModal';

interface FichaModalProps {
  appointment: Appointment;
  catalog: CatalogItem[];
  onSaveRecord: (notes: string) => void;
  onSaveInvoice: (invoice: Invoice) => void;
  onClose: () => void;
}

export const FichaModal: React.FC<FichaModalProps> = ({
  appointment,
  catalog,
  onSaveRecord,
  onSaveInvoice,
  onClose,
}) => {
  const [notes, setNotes] = useState(appointment.notes || '');
  const [isBillingOpen, setIsBillingOpen] = useState(false);

  const handleSendWhatsAppAlta = () => {
    // Generate dummy password
    const dummyPassword = Math.random().toString(36).slice(-8);
    const dummyEmail = `${appointment.ownerName.split(' ')[0].toLowerCase()}@pets.com`;
    
    // We send it to the client's own phone number
    const cleanPhone = appointment.ownerPhone.replace(/^\+?54\s?9?\s?/, '').replace(/\D/g, '');
    const clientPhone = `549${cleanPhone}`; 
    
    const message = `Hola ${appointment.ownerName}! Bienvenid@ a PETS Clínica Veterinaria. Te hemos creado una cuenta para que puedas acceder a la historia clínica de ${appointment.patientName} y reservar turnos.\n\nAcceso: https://pets-app.com\nUsuario: ${dummyEmail}\nContraseña temporal: ${dummyPassword}\n\nTe sugerimos cambiarla al ingresar.`;
    window.open(`https://wa.me/${clientPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-[80] flex justify-center items-center p-4 md:p-10">
        <div 
          className="absolute inset-0 bg-[#1b1c1c]/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-4xl bg-[#fbf9f8] rounded-3xl shadow-2xl flex flex-col h-full max-h-screen animate-in zoom-in-95 duration-200 overflow-hidden border border-[#e5e1db]">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-[#e5e1db] flex justify-between items-center shrink-0">
            <div>
              <h2 className="text-xl font-display font-medium text-[#1b1c1c] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#436900] filled">description</span>
                Ficha Clínica: {appointment.patientName}
              </h2>
              <p className="text-sm text-[#434938] mt-0.5">
                Tutor: {appointment.ownerName} ({appointment.ownerPhone})
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSendWhatsAppAlta}
                className="bg-[#25D366] hover:bg-[#1ebe5b] text-white text-xs font-bold py-2 px-3 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <img src="https://cdn-icons-png.flaticon.com/512/124/124034.png" alt="WhatsApp" className="w-4 h-4 invert" />
                <span className="hidden sm:inline">Enviar Alta a Cliente</span>
              </button>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-[#f0eded] rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-[#1b1c1c]">close</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Context Info */}
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-[#c3c9b3]/40 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#737a66] mb-3">Detalle del Turno</h3>
                <div className="space-y-2 text-sm">
                  <p><strong className="text-[#1b1c1c]">Ticket:</strong> {appointment.ticketNumber}</p>
                  <p><strong className="text-[#1b1c1c]">Motivo:</strong> {appointment.serviceType}</p>
                  <p><strong className="text-[#1b1c1c]">Fecha/Hora:</strong> {appointment.date} - {appointment.time}</p>
                  <p><strong className="text-[#1b1c1c]">Profesional:</strong> {appointment.doctorName}</p>
                  <p><strong className="text-[#1b1c1c]">Especie:</strong> {appointment.species}</p>
                </div>
              </div>

              <div className="bg-[#ffdad6]/20 p-4 rounded-2xl border border-[#ba1a1a]/20 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#93000a] mb-2">Alertas / Preexistencias</h3>
                <p className="text-sm text-[#434938] italic">No hay alertas registradas para este paciente.</p>
              </div>
            </div>

            {/* Right Column: Editor */}
            <div className="md:col-span-2 flex flex-col h-full">
              <label className="font-headline font-bold text-[#1b1c1c] text-lg mb-2">Evolución de Consulta</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Escribe aquí los detalles de la consulta, diagnóstico, y observaciones..."
                className="flex-1 w-full p-4 border border-[#c3c9b3] rounded-xl outline-none focus:border-[#436900] focus:ring-1 focus:ring-[#436900] resize-none text-[#1b1c1c] min-h-[250px]"
              />
              
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setIsBillingOpen(true)}
                  className="bg-[#1b1c1c] hover:bg-[#434938] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined">receipt_long</span>
                  Recibo de Servicios
                </button>

                <button
                  onClick={() => {
                    onSaveRecord(notes);
                    onClose();
                  }}
                  className="bg-[#8fc63d] hover:bg-[#9fd74d] text-[#111f00] font-bold text-sm px-8 py-3 rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined">save</span>
                  Grabar Ficha
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isBillingOpen && (
        <BillingModal
          appointment={appointment}
          catalog={catalog}
          onSaveInvoice={(inv) => {
            onSaveInvoice(inv);
            setIsBillingOpen(false);
            // Optionally close the entire Ficha, or just let them stay.
          }}
          onClose={() => setIsBillingOpen(false)}
        />
      )}
    </>
  );
};
