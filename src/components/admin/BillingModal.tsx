import React, { useState } from 'react';
import { Appointment, CatalogItem, Invoice } from '../../types';

interface BillingModalProps {
  appointment: Appointment;
  catalog: CatalogItem[];
  onSaveInvoice: (invoice: Invoice) => void;
  onClose: () => void;
}

export const BillingModal: React.FC<BillingModalProps> = ({
  appointment,
  catalog,
  onSaveInvoice,
  onClose,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedServices, setSelectedServices] = useState<CatalogItem[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<CatalogItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'T. Débito' | 'T. Crédito' | 'Mercado Pago'>('Efectivo');

  const services = catalog.filter((c) => c.type === 'servicio');
  const medications = catalog.filter((c) => c.type === 'medicacion');

  const servicesTotal = selectedServices.reduce((sum, item) => sum + item.price, 0);
  const medicationsTotal = selectedMedications.reduce((sum, item) => sum + item.price, 0);
  const grandTotal = servicesTotal + medicationsTotal;

  const toggleItem = (item: CatalogItem, type: 'servicio' | 'medicacion') => {
    if (type === 'servicio') {
      const exists = selectedServices.find((s) => s.id === item.id);
      if (exists) {
        setSelectedServices(selectedServices.filter((s) => s.id !== item.id));
      } else {
        setSelectedServices([...selectedServices, item]);
      }
    } else {
      const exists = selectedMedications.find((m) => m.id === item.id);
      if (exists) {
        setSelectedMedications(selectedMedications.filter((m) => m.id !== item.id));
      } else {
        setSelectedMedications([...selectedMedications, item]);
      }
    }
  };

  const handleFinish = () => {
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      appointmentId: appointment.id,
      date: new Date().toLocaleDateString(),
      total: grandTotal,
      paymentMethod,
      items: [...selectedServices, ...selectedMedications]
    };
    onSaveInvoice(newInvoice);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center p-4">
      <div 
        className="absolute inset-0 bg-[#1b1c1c]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#fbf9f8] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        <div className="bg-white px-6 py-4 border-b border-[#e5e1db] flex justify-between items-center print:hidden">
          <h2 className="text-xl font-display font-medium text-[#1b1c1c]">
            {step === 1 && 'Seleccionar Servicios'}
            {step === 2 && 'Medicación y Accesorios'}
            {step === 3 && 'Recibo de Servicios'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[#f0eded] rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 printable-area">
          {/* STEP 1: Services */}
          {step === 1 && (
            <div className="space-y-3 pb-20">
              {services.map((item) => {
                const isSelected = selectedServices.some((s) => s.id === item.id);
                return (
                  <label 
                    key={item.id} 
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected ? 'border-[#436900] bg-[#c7f173]/20 shadow-sm' : 'border-[#c3c9b3] bg-white hover:border-[#436900]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleItem(item, 'servicio')}
                        className="w-5 h-5 accent-[#436900]"
                      />
                      <span className="font-bold text-sm text-[#1b1c1c]">{item.name}</span>
                    </div>
                    <span className="font-bold text-[#436900]">${item.price.toLocaleString()}</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* STEP 2: Medications */}
          {step === 2 && (
            <div className="space-y-3 pb-20">
              {medications.map((item) => {
                const isSelected = selectedMedications.some((m) => m.id === item.id);
                return (
                  <label 
                    key={item.id} 
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected ? 'border-[#436900] bg-[#c7f173]/20 shadow-sm' : 'border-[#c3c9b3] bg-white hover:border-[#436900]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleItem(item, 'medicacion')}
                        className="w-5 h-5 accent-[#436900]"
                      />
                      <span className="font-bold text-sm text-[#1b1c1c]">{item.name}</span>
                    </div>
                    <span className="font-bold text-[#436900]">${item.price.toLocaleString()}</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* STEP 3: Receipt & Payment */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-[#c3c9b3]/50 shadow-sm text-sm" id="receipt-print-area">
                <div className="text-center mb-6 border-b border-dashed border-[#c3c9b3] pb-6">
                  <h1 className="font-display text-2xl font-bold text-[#1b1c1c]">PETS Veterinaria</h1>
                  <p className="text-[#434938]">Av. San Martín 1234, Ciudad Veterinaria</p>
                  <p className="text-[#434938]">Tel: +54 9 11 1234-5678</p>
                </div>
                
                <div className="mb-6 space-y-1">
                  <p><strong>Fecha:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                  <p><strong>Recibo N°:</strong> {`0001-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`}</p>
                  <p><strong>Tutor:</strong> {appointment.ownerName}</p>
                  <p><strong>Paciente:</strong> {appointment.patientName}</p>
                  <p><strong>Médico:</strong> {appointment.doctorName}</p>
                </div>

                <div className="mb-4 font-bold border-b border-[#c3c9b3] pb-2 text-[#1b1c1c]">Detalle</div>
                <div className="space-y-2 mb-6 text-[#1b1c1c]">
                  {[...selectedServices, ...selectedMedications].map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>${item.price.toLocaleString()}</span>
                    </div>
                  ))}
                  {selectedServices.length === 0 && selectedMedications.length === 0 && (
                    <div className="text-center italic text-[#737a66]">No se seleccionaron ítems.</div>
                  )}
                </div>

                <div className="flex justify-between font-display font-bold text-xl border-t border-[#c3c9b3] pt-4 text-[#436900]">
                  <span>TOTAL</span>
                  <span>${grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#c3c9b3]/50 shadow-sm print:hidden">
                <h3 className="font-bold text-sm mb-3">Método de Pago</h3>
                <div className="grid grid-cols-2 gap-3">
                  {(['Efectivo', 'T. Débito', 'T. Crédito', 'Mercado Pago'] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-3 rounded-lg border font-bold text-sm transition-colors ${
                        paymentMethod === method 
                          ? 'bg-[#1b1c1c] text-white border-[#1b1c1c] shadow-sm' 
                          : 'bg-[#f6f3f2] text-[#434938] hover:border-[#1b1c1c] border-transparent'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-[#e5e1db] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] print:hidden">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            <div className="font-display font-bold text-lg text-[#1b1c1c]">
              Total: <span className="text-[#436900]">${grandTotal.toLocaleString()}</span>
            </div>
            
            <div className="flex gap-2">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1 as any)}
                  className="px-4 py-3 rounded-xl border border-[#c3c9b3] font-bold text-sm text-[#434938] hover:bg-[#f0eded]"
                >
                  Atrás
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1 as any)}
                  className="px-6 py-3 rounded-xl bg-[#8fc63d] hover:bg-[#9fd74d] text-[#111f00] font-bold text-sm shadow-sm flex items-center gap-1"
                >
                  {step === 1 ? 'Finalizar Servicios' : 'Ir a Cobro'}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-3 rounded-xl border-2 border-[#1b1c1c] hover:bg-[#f0eded] text-[#1b1c1c] font-bold text-sm shadow-sm flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">print</span>
                    Imprimir
                  </button>
                  <button
                    onClick={handleFinish}
                    className="px-6 py-3 rounded-xl bg-[#1b1c1c] hover:bg-[#000000] text-white font-bold text-sm shadow-sm flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Cobrar y Cerrar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
