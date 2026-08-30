import React, { useState } from 'react';
import { Pet, Appointment, VaccineRecord } from '../../types';
import { CLINIC_IMAGES } from '../../data/initialData';
import { ImageCropperModal } from '../ImageCropperModal';

interface ClientAccountViewProps {
  user: any;
  pets: Pet[];
  appointments: Appointment[];
  onBookVaccine: () => void;
  onAddPet: (petFormData: FormData) => void;
  onEditPet: (petId: string, petFormData: FormData) => void;
  onDeletePet: (petId: string) => void;
  onUpdatePetVaccines: (petId: string, vaccines: VaccineRecord[]) => void;
}

export const ClientAccountView: React.FC<ClientAccountViewProps> = ({
  user,
  pets,
  appointments,
  onBookVaccine,
  onAddPet,
  onEditPet,
  onDeletePet,
  onUpdatePetVaccines,
}) => {
  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || '');
  const [isPetModalOpen, setIsPetModalOpen] = useState(pets.length === 0);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [newPetName, setNewPetName] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState<'Canino' | 'Felino' | 'Equino' | 'Bovino'>('Canino');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetPhoto, setNewPetPhoto] = useState<Blob | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [rawImageToCrop, setRawImageToCrop] = useState<string | null>(null);

  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0];

  const handleToggleVaccine = (vaccineId: string) => {
    if (!activePet) return;
    const updated = activePet.vaccines.map((v) => {
      if (v.id === vaccineId) {
        const nextStatus = v.status === 'completa' ? 'pendiente' : 'completa';
        return {
          ...v,
          status: nextStatus,
          date: nextStatus === 'completa' ? 'Hoy (Aplicada)' : 'Pendiente',
        };
      }
      return v;
    });
    onUpdatePetVaccines(activePet.id, updated);
  };

  const handleSavePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim()) return;

    const formData = new FormData();
    formData.append('name', newPetName);
    formData.append('species', newPetSpecies);
    formData.append('breed', newPetBreed || 'Mestizo');
    formData.append('age', newPetAge || '1 Año');
    if (newPetPhoto) {
      formData.append('photo', newPetPhoto);
    }

    if (editingPetId) {
      onEditPet(editingPetId, formData);
    } else {
      onAddPet(formData);
    }

    closePetModal();
  };

  const openAddPetModal = () => {
    setEditingPetId(null);
    setNewPetName('');
    setNewPetSpecies('Canino');
    setNewPetBreed('');
    setNewPetAge('');
    setNewPetPhoto(null);
    setPhotoPreview(null);
    setIsPetModalOpen(true);
  };

  const openEditPetModal = (pet: Pet) => {
    setEditingPetId(pet.id);
    setNewPetName(pet.name);
    setNewPetSpecies(pet.species as any);
    setNewPetBreed(pet.breed || '');
    setNewPetAge(pet.age || '');
    setNewPetPhoto(null);
    setPhotoPreview(pet.photo || null);
    setIsPetModalOpen(true);
  };

  const closePetModal = () => {
    setIsPetModalOpen(false);
    setEditingPetId(null);
    setNewPetName('');
    setNewPetBreed('');
    setNewPetAge('');
    setNewPetPhoto(null);
    setPhotoPreview(null);
  };

  return (
    <div className="py-6 px-4 max-w-md md:max-w-3xl mx-auto animate-in fade-in duration-300 space-y-6">
      {/* User Profile Overview */}
      <section className="flex items-center gap-4 p-4 md:p-6 bg-white rounded-2xl shadow-ambient border border-[#c3c9b3]/30">
        <div className="w-16 h-16 rounded-full bg-[#c7f173] text-[#324f00] flex items-center justify-center font-headline font-bold text-2xl border-2 border-[#8fc63d]">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-headline text-xl md:text-2xl font-bold text-[#1b1c1c]">
            Hola, {user?.name || 'Usuario'}
          </h2>
          <p className="text-xs md:text-sm text-[#434938]">
            {pets.length === 0 ? 'Agrega tu primera mascota para empezar.' : 'Tus mascotas te esperan en su panel de salud.'}
          </p>
        </div>
      </section>

      {/* Mis Mascotas Horizontal Scroll */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-headline text-lg font-bold text-[#1b1c1c]">
            Mis Mascotas
          </h3>
          <button
            onClick={openAddPetModal}
            className="text-xs font-bold text-[#436900] hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            Registrar Mascota
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {pets.map((pet) => {
            const isActive = pet.id === activePet?.id;
            return (
              <button
                key={pet.id}
                onClick={() => setSelectedPetId(pet.id)}
                className="flex flex-col items-center gap-1.5 shrink-0 min-w-[76px] group focus:outline-none"
              >
                <div
                  className={`w-18 h-18 rounded-full p-0.5 border-2 transition-all overflow-hidden ${
                    isActive
                      ? 'border-[#436900] ring-2 ring-[#8fc63d]/50 scale-105 shadow-sm'
                      : 'border-[#c3c9b3]/50 opacity-70 group-hover:opacity-100'
                  }`}
                >
                  <img
                    src={pet.photo}
                    alt={pet.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span
                  className={`text-xs ${
                    isActive ? 'font-bold text-[#1b1c1c]' : 'font-medium text-[#434938]'
                  }`}
                >
                  {pet.name}
                </span>
              </button>
            );
          })}

          {/* Add Pet Button */}
          <button
            onClick={openAddPetModal}
            className="flex flex-col items-center gap-1.5 shrink-0 min-w-[76px] group focus:outline-none"
          >
            <div className="w-18 h-18 rounded-full bg-[#f6f3f2] border-2 border-dashed border-[#737a66] flex items-center justify-center group-hover:border-[#436900] group-hover:bg-[#c7f173]/20 transition-all">
              <span className="material-symbols-outlined text-[#737a66] group-hover:text-[#436900] text-3xl">
                add
              </span>
            </div>
            <span className="text-xs text-[#737a66] group-hover:text-[#436900] font-medium">
              Nuevo
            </span>
          </button>
        </div>
      </section>

      {/* Próximos Turnos */}
      <section className="space-y-3">
        <h3 className="font-headline text-lg font-bold text-[#1b1c1c]">
          Próximos Turnos
        </h3>
        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl p-4 text-center text-xs text-[#737a66] border border-[#c3c9b3]/30">
            No tienes turnos próximos agendados.
          </div>
        ) : (
          appointments.slice(0, 2).map((apt) => (
            <div
              key={apt.id}
              className="bg-[#f6f3f2] rounded-2xl p-4 border border-[#c3c9b3]/35 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-xs"
            >
              <div className="bg-[#8fc63d] text-[#111f00] rounded-xl p-2.5 flex flex-col items-center justify-center min-w-[58px] shadow-xs">
                <span className="text-sm font-bold leading-tight">Hoy</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-headline font-bold text-sm text-[#1b1c1c] truncate">
                  {apt.serviceType}
                </h4>
                <p className="text-xs text-[#434938] flex items-center gap-1.5 mt-0.5">
                  <span className="material-symbols-outlined text-[15px] text-[#436900]">pets</span>
                  <span>{apt.patientName}</span>
                </p>
                <p className="text-xs text-[#434938] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#436900]">schedule</span>
                  <span>{apt.time} - {apt.doctorName}</span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                {apt.confirmed_attendance ? (
                  <div className="text-[11px] font-bold text-[#436900] bg-[#c7f173] px-2.5 py-1 rounded-full border border-[#8fc63d]/40">
                    Asistencia Confirmada
                  </div>
                ) : (
                  <button 
                    onClick={async () => {
                      const token = localStorage.getItem('pets_token');
                      if (token) {
                        try {
                          const res = await fetch(`/api/appointments/${apt.id}/confirm`, {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` }
                          });
                          if (res.ok) {
                            alert('¡Asistencia confirmada exitosamente!');
                            window.location.reload(); // Simplificación para demo
                          }
                        } catch (e) {
                          alert('Error al confirmar asistencia');
                        }
                      }
                    }}
                    className="w-full sm:w-auto text-[11px] font-bold text-white bg-[#ba1a1a] px-3 py-1.5 rounded-lg hover:bg-[#93000a] transition-colors"
                  >
                    Confirmar Asistencia
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </section>

      {/* Alerts / Reminders Banner */}
      {activePet && (
        <section>
          <div className="bg-[#ffdad6] text-[#93000a] rounded-2xl p-4 md:p-5 flex items-start gap-3.5 border border-[#ba1a1a]/25 shadow-xs">
            <span className="material-symbols-outlined text-2xl mt-0.5 text-[#ba1a1a] filled">
              notification_important
            </span>
            <div className="flex-1">
              <h4 className="font-headline font-bold text-sm">Vacunación Próxima</h4>
              <p className="text-xs text-[#93000a]/90 mt-1 leading-relaxed">
                {activePet.name} necesita su refuerzo anual de Rabia antes del 20 de Octubre.
              </p>
              <button
                onClick={onBookVaccine}
                className="mt-3 bg-white text-[#ba1a1a] font-bold text-xs px-4 py-2 rounded-lg shadow-sm hover:bg-[#ffffff]/90 active:scale-95 transition-all inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">calendar_add_on</span>
                Agendar Ahora
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Active Pet Profile Card (Max) */}
      {activePet && (
        <section className="bg-white rounded-2xl shadow-ambient border border-[#c3c9b3]/30 overflow-hidden relative">
          {/* Edit/Delete Actions */}
          <div className="absolute top-3 right-4 flex gap-2 z-10">
            <button
              onClick={() => openEditPetModal(activePet)}
              className="w-8 h-8 rounded-full bg-black/40 text-white backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
              title="Editar Mascota"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm(`¿Estás seguro de que quieres ocultar a ${activePet.name}? (Se mantendrá el historial médico)`)) {
                  onDeletePet(activePet.id);
                  // Default back to the first available pet
                  const remaining = pets.filter(p => p.id !== activePet.id);
                  if (remaining.length > 0) {
                    setSelectedPetId(remaining[0].id);
                  }
                }
              }}
              className="w-8 h-8 rounded-full bg-[#ba1a1a]/80 text-white backdrop-blur-sm flex items-center justify-center hover:bg-[#ba1a1a] transition-colors"
              title="Eliminar Mascota"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
          
          {/* Pet Cover Banner */}
          <div className="h-44 sm:h-52 w-full relative">
            <img
              src={activePet.coverPhoto || activePet.photo || CLINIC_IMAGES.petMaxPark}
              alt={activePet.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-3.5 left-4 text-white">
              <h2 className="font-headline text-2xl font-bold leading-tight">
                {activePet.name}
              </h2>
              <p className="text-xs text-white/90 font-medium">
                {activePet.breed} • Microchip: {activePet.microchip || 'No Registrado'}
              </p>
            </div>
          </div>

          {/* Vitals Bento */}
          <div className="p-4 md:p-6 space-y-5">
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-[#f6f3f2] p-3 rounded-xl text-center border border-[#c3c9b3]/20">
                <span className="block text-[10px] text-[#737a66] font-bold uppercase tracking-wider mb-0.5">
                  Especie
                </span>
                <span className="font-headline font-bold text-sm text-[#1b1c1c]">
                  {activePet.species}
                </span>
              </div>

              <div className="bg-[#f6f3f2] p-3 rounded-xl text-center border border-[#c3c9b3]/20">
                <span className="block text-[10px] text-[#737a66] font-bold uppercase tracking-wider mb-0.5">
                  Edad
                </span>
                <span className="font-headline font-bold text-sm text-[#1b1c1c]">
                  {activePet.age}
                </span>
              </div>

              <div className="bg-[#f6f3f2] p-3 rounded-xl text-center border border-[#c3c9b3]/20">
                <span className="block text-[10px] text-[#737a66] font-bold uppercase tracking-wider mb-0.5">
                  Peso
                </span>
                <span className="font-headline font-bold text-sm text-[#1b1c1c]">
                  {activePet.weight || 'N/A'}
                </span>
              </div>
            </div>

            {/* Vaccination History Checklist */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-headline font-bold text-sm text-[#1b1c1c] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#436900] text-lg filled">
                    vaccines
                  </span>
                  Historial de Vacunas
                </h4>
                <span className="text-[11px] text-[#737a66]">
                  Toca para cambiar estado
                </span>
              </div>

              <ul className="space-y-2">
                {(activePet.vaccines || []).length === 0 ? (
                  <li className="text-xs text-gray-500 italic p-2 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    No hay vacunas registradas
                  </li>
                ) : (
                  (activePet.vaccines || []).map((vac) => {
                    const isCompleted = vac.status === 'completa';
                    return (
                    <li
                      key={vac.id}
                      onClick={() => handleToggleVaccine(vac.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        isCompleted
                          ? 'bg-[#ffffff] border-[#c3c9b3]/30 hover:border-[#8fc63d]'
                          : 'bg-[#ffdad6]/25 border-[#ba1a1a]/30'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-xl ${
                          isCompleted
                            ? 'text-[#436900] filled'
                            : 'text-[#ba1a1a]'
                        }`}
                      >
                        {isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-xs block truncate ${
                            isCompleted ? 'text-[#1b1c1c] font-medium' : 'text-[#93000a] font-bold'
                          }`}
                        >
                          {vac.name}
                        </span>
                        {vac.badgeText && (
                          <span className="text-[10px] bg-[#ba1a1a] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                            {vac.badgeText}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs ${
                          isCompleted ? 'text-[#737a66]' : 'text-[#ba1a1a] font-bold'
                        }`}
                      >
                        {vac.date}
                      </span>
                    </li>
                  );
                })
                )}
              </ul>
            </div>

            {/* Acciones Rápidas de la Mascota */}
            <div className="pt-4 mt-2 border-t border-[#c3c9b3]/30 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  // En un flujo real redirige a la vista de reserva con la mascota seleccionada
                  alert('Ir a Sacar Turno para ' + activePet.name);
                }}
                className="flex items-center justify-center gap-2 bg-[#c7f173] text-[#324f00] p-3 rounded-xl font-bold text-xs hover:bg-[#8fc63d] transition-colors border border-[#8fc63d]"
              >
                <span className="material-symbols-outlined text-lg">calendar_add_on</span>
                Sacar Turno
              </button>
              
              <button
                onClick={() => {
                  alert('Ir a Atención de Urgencia 24hs para ' + activePet.name);
                }}
                className="flex items-center justify-center gap-2 bg-[#ffdad6] text-[#ba1a1a] p-3 rounded-xl font-bold text-xs hover:bg-[#ffb4ab] transition-colors border border-[#ba1a1a]/30"
              >
                <span className="material-symbols-outlined text-lg filled">emergency</span>
                Urgencia
              </button>
              
              <button
                onClick={() => {
                  alert('Ir a Asistente de Primeros Auxilios (IA)');
                }}
                className="flex items-center justify-center gap-2 bg-[#eae8e7] text-[#436900] p-3 rounded-xl font-bold text-xs hover:bg-[#e5e1db] transition-colors border border-[#c3c9b3]"
              >
                <span className="material-symbols-outlined text-lg">medical_information</span>
                Primeros Auxilios
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Add/Edit Pet Modal */}
      {isPetModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={closePetModal}
          />
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full z-10 border border-[#c3c9b3]">
            <h3 className="font-headline font-bold text-lg text-[#436900] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">pets</span>
              {editingPetId ? 'Editar Mascota' : 'Registrar Nueva Mascota'}
            </h3>

            <form onSubmit={handleSavePet} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#434938] mb-1">
                  Nombre de la Mascota *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Toby"
                  value={newPetName}
                  onChange={(e) => setNewPetName(e.target.value)}
                  className="w-full border border-[#c3c9b3] rounded-lg p-2.5 text-xs text-[#1b1c1c] focus:border-[#436900] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#434938] mb-1">
                    Especie
                  </label>
                  <select
                    value={newPetSpecies}
                    onChange={(e) => setNewPetSpecies(e.target.value as any)}
                    className="w-full border border-[#c3c9b3] rounded-lg p-2.5 text-xs text-[#1b1c1c] focus:border-[#436900] outline-none"
                  >
                    <option value="Canino">Canino (Perro)</option>
                    <option value="Felino">Felino (Gato)</option>
                    <option value="Equino">Equino (Caballo)</option>
                    <option value="Bovino">Bovino / Ganado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#434938] mb-1">
                    Raza
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Labrador"
                    value={newPetBreed}
                    onChange={(e) => setNewPetBreed(e.target.value)}
                    className="w-full border border-[#c3c9b3] rounded-lg p-2.5 text-xs text-[#1b1c1c] focus:border-[#436900] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#434938] mb-1">
                    Edad
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 2 Años"
                    value={newPetAge}
                    onChange={(e) => setNewPetAge(e.target.value)}
                    className="w-full border border-[#c3c9b3] rounded-lg p-2.5 text-xs text-[#1b1c1c] focus:border-[#436900] outline-none"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-bold text-[#434938] mb-1">
                  Foto de la Mascota
                </label>
                
                {photoPreview ? (
                  <div className="relative w-20 h-20 mb-2 group">
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-full border-2 border-[#8fc63d]" />
                    <button
                      type="button"
                      onClick={() => {
                        setNewPetPhoto(null);
                        setPhotoPreview(null);
                      }}
                      className="absolute inset-0 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setRawImageToCrop(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                        e.target.value = '';
                      }
                    }}
                    className="w-full text-xs text-[#1b1c1c] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#c7f173] file:text-[#324f00] hover:file:bg-[#8fc63d]"
                  />
                )}
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closePetModal}
                  className="px-4 py-2 text-xs font-bold text-[#737a66] hover:text-[#1b1c1c]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#8fc63d] text-[#111f00] rounded-lg hover:bg-[#9fd74d]"
                >
                  {editingPetId ? 'Guardar Cambios' : 'Guardar Mascota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Cropper Modal */}
      {rawImageToCrop && (
        <ImageCropperModal
          isOpen={true}
          imageSrc={rawImageToCrop}
          onClose={() => setRawImageToCrop(null)}
          onCropComplete={(blob) => {
            setNewPetPhoto(blob);
            setPhotoPreview(URL.createObjectURL(blob));
            setRawImageToCrop(null);
          }}
        />
      )}
    </div>
  );
};
