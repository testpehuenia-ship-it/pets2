import React, { useState, useEffect } from 'react';
import { subscribeToPushNotifications } from './utils/push';
import { TabType, Pet, Appointment, VaccineRecord, CatalogItem, ClinicalRecord, Invoice } from './types';
import { INITIAL_PETS, INITIAL_APPOINTMENTS, INITIAL_FIELD_ALERTS } from './data/initialData';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { NavigationDrawer } from './components/NavigationDrawer';
import { EmergencyModal } from './components/EmergencyModal';
import { HomeView } from './components/views/HomeView';
import { BookingView } from './components/views/BookingView';
import { FirstAidView } from './components/views/FirstAidView';
import { ClientAccountView } from './components/views/ClientAccountView';
import { AdminDashboardView } from './components/views/AdminDashboardView';
import { TeamView } from './components/views/TeamView';
import { AuthModal } from './components/AuthModal';
import { InstallBanner } from './components/InstallBanner';

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('pets_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState<TabType | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>('inicio');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string | null>(null);

  // Core App State
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [fieldAlerts, setFieldAlerts] = useState(INITIAL_FIELD_ALERTS);

  // EMR & Billing State
  const [catalog, setCatalog] = useState<CatalogItem[]>([
    { id: 'c1', name: 'Consulta General', type: 'servicio', price: 15000 },
    { id: 'c2', name: 'Consulta Especialista', type: 'servicio', price: 25000 },
    { id: 'c3', name: 'Ecografía Abdominal', type: 'servicio', price: 35000 },
    { id: 'c4', name: 'Vacuna Sextuple', type: 'servicio', price: 18000 },
    { id: 'm1', name: 'Antiparasitario Interno (hasta 10kg)', type: 'medicacion', price: 5000 },
    { id: 'm2', name: 'Antiparasitario Interno (10-20kg)', type: 'medicacion', price: 8500 },
    { id: 'm3', name: 'Antibiótico Inyectable (Dosis)', type: 'medicacion', price: 12000 },
    { id: 'm4', name: 'Analgésico Inyectable (Dosis)', type: 'medicacion', price: 9000 },
  ]);
  const [records, setRecords] = useState<ClinicalRecord[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Notification badge counter for active appointments
  const notificationCount = appointments.filter(
    (a) => a.status === 'en_espera' || a.status === 'emergencia'
  ).length;

  const handleSelectTab = (tab: TabType) => {
    const protectedTabs: TabType[] = ['reservas', 'cuenta', 'admin'];
    
    if (protectedTabs.includes(tab) && !currentUser) {
      setPendingTab(tab);
      setIsAuthModalOpen(true);
      return;
    }
    
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchPets = async () => {
    const token = localStorage.getItem('pets_token');
    if (!token) return;
    try {
      const res = await fetch('/api/pets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPets(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAppointments = async () => {
    const token = localStorage.getItem('pets_token');
    if (!token) return;
    try {
      const res = await fetch('/api/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user);
    // Intentar suscribirse a notificaciones al iniciar sesión exitosamente
    subscribeToPushNotifications();
    fetchPets();
    fetchAppointments();
    if (pendingTab) {
      setCurrentTab(pendingTab);
      setPendingTab(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pets_user');
    localStorage.removeItem('pets_token');
    setCurrentUser(null);
    setPets([]);
    setAppointments([]);
    setCurrentTab('inicio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentUser) {
      subscribeToPushNotifications();
      fetchPets();
      fetchAppointments();
    }
  }, [currentUser]);

  const handleSelectDoctorForBooking = (doctorId: string) => {
    setPreselectedDoctorId(doctorId);
    setCurrentTab('reservas');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookVaccine = () => {
    setCurrentTab('reservas');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingConfirmed = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  const handleQuickEmergencyBooking = (aptPartial: Partial<Appointment>) => {
    const emergencyApt: Appointment = {
      id: `apt-emerg-${Date.now()}`,
      ticketNumber: `#EM-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: aptPartial.patientName || 'Paciente Urgente',
      species: aptPartial.species || 'General',
      serviceType: aptPartial.serviceType || 'Atención Urgente 24hs',
      doctorName: 'Guardia Médica 24hs',
      date: 'Hoy (Inmediato)',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeBadge: 'URG',
      status: 'emergencia',
      emergency: true,
      ownerName: aptPartial.ownerName || 'Ingreso Urgente',
      ownerPhone: aptPartial.ownerPhone || '+54 11 1234-5678',
      notes: aptPartial.notes || 'Ingreso por guardia de urgencia',
    };
    setAppointments((prev) => [emergencyApt, ...prev]);
  };

  const handleAddPet = (newPet: Pet) => {
    setPets((prev) => [...prev, newPet]);
  };

  const handleUpdatePetVaccines = (petId: string, vaccines: VaccineRecord[]) => {
    setPets((prev) =>
      prev.map((pet) => (pet.id === petId ? { ...pet, vaccines } : pet))
    );
  };

  const handleUpdateAppointmentStatus = (
    id: string,
    status: Appointment['status']
  ) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
  };

  return (
    <div className="min-h-screen bg-[#fbf9f8] text-[#1b1c1c] font-body flex flex-col antialiased selection:bg-[#c7f173] selection:text-[#141f00]">
      {/* Top App Bar Header */}
      <TopAppBar
        user={currentUser}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onLogout={handleLogout}
      />

      {/* Side Navigation Drawer (Mobile) */}
      <NavigationDrawer
        user={currentUser}
        pets={pets}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onLogout={handleLogout}
      />

      {/* Emergency 24hs Rapid Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onQuickBookEmergency={handleQuickEmergencyBooking}
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess} 
      />

      {/* Main View Container */}
      <main className="flex-1 pb-20 md:pb-12">
        {currentTab === 'inicio' && (
          <HomeView
            user={currentUser}
            onSelectTab={handleSelectTab}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
          />
        )}

        {currentTab === 'reservas' && (
          <BookingView
            user={currentUser}
            pets={pets}
            appointments={appointments}
            initialDoctorId={preselectedDoctorId}
            onBookingConfirmed={handleBookingConfirmed}
            onGoToAccount={() => handleSelectTab('cuenta')}
          />
        )}

        {currentTab === 'auxilios' && (
          <FirstAidView 
            onOpenEmergency={() => setIsEmergencyOpen(true)} 
            onGoToBooking={() => handleSelectTab('reservas')}
          />
        )}

        {currentTab === 'cuenta' && (
          <ClientAccountView
            user={currentUser}
            pets={pets}
            appointments={appointments}
            onBookVaccine={handleBookVaccine}
            onAddPet={async (petFormData: FormData) => {
              const token = localStorage.getItem('pets_token');
              if (!token) return;
              try {
                const res = await fetch('/api/pets', {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${token}` },
                  body: petFormData
                });
                if (res.ok) {
                  fetchPets(); // Refresh pets after adding
                }
              } catch (e) {
                console.error(e);
              }
            }}
            onEditPet={async (petId: string, petFormData: FormData) => {
              const token = localStorage.getItem('pets_token');
              if (!token) return;
              try {
                const res = await fetch(`/api/pets/${petId}`, {
                  method: 'PUT',
                  headers: { 'Authorization': `Bearer ${token}` },
                  body: petFormData
                });
                if (res.ok) {
                  fetchPets(); // Refresh pets after updating
                }
              } catch (e) {
                console.error(e);
              }
            }}
            onDeletePet={async (petId: string) => {
              const token = localStorage.getItem('pets_token');
              if (!token) return;
              try {
                const res = await fetch(`/api/pets/${petId}`, {
                  method: 'DELETE',
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                  fetchPets(); // Refresh pets after soft-deleting
                }
              } catch (e) {
                console.error(e);
              }
            }}
            onUpdatePetVaccines={handleUpdatePetVaccines}
          />
        )}

        {currentTab === 'equipo' && (
          <TeamView
            onSelectDoctorForBooking={handleSelectDoctorForBooking}
            onSelectTab={handleSelectTab}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardView
            appointments={appointments}
            fieldAlerts={fieldAlerts}
            catalog={catalog}
            setCatalog={setCatalog}
            records={records}
            setRecords={setRecords}
            invoices={invoices}
            setInvoices={setInvoices}
            onOpenBooking={() => handleSelectTab('reservas')}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
          />
        )}
      </main>

      {/* Bottom Navigation Bar (Mobile) */}
      <BottomNavBar user={currentUser} currentTab={currentTab} onSelectTab={handleSelectTab} />
      
      {/* PWA Install Banner */}
      <InstallBanner />
    </div>
  );
}
