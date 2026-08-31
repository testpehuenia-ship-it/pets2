export type TabType = 'inicio' | 'reservas' | 'auxilios' | 'cuenta' | 'admin' | 'equipo';

export type SpeciesType = 'perro' | 'gato' | 'caballo' | 'vaca_oveja' | 'todos';

export interface VaccineRecord {
  id: string;
  name: string;
  date: string;
  status: 'completa' | 'pendiente' | 'proxima';
  badgeText?: string;
}

export interface Pet {
  id: string;
  name: string;
  species: 'Canino' | 'Felino' | 'Equino' | 'Bovino' | 'Otro';
  speciesKey: 'perro' | 'gato' | 'caballo' | 'vaca_oveja';
  breed: string;
  age: string;
  weight: string;
  photo: string;
  coverPhoto?: string;
  microchip?: string;
  ownerName: string;
  vaccines: VaccineRecord[];
  notes?: string;
}

export interface Appointment {
  id: string;
  ticketNumber: string;
  patientName: string;
  species: string;
  breed?: string;
  serviceType: string;
  doctorName: string;
  date: string;
  time: string;
  timeBadge?: string;
  status: 'confirmado' | 'en_espera' | 'en_atencion' | 'emergencia' | 'completado' | 'cancelado';
  emergency?: boolean;
  confirmed_attendance?: boolean;
  notes?: string;
  ownerName: string;
  ownerPhone: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  badge: string;
  badgeType: 'primary' | 'tertiary' | 'secondary' | 'error';
  photo: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  description: string;
  category: 'pequenos' | 'grandes' | 'clinica';
}

export interface FirstAidGuide {
  id: string;
  title: string;
  species: ('perro' | 'gato' | 'caballo')[];
  severity: 'Urgente' | 'Observación' | 'Moderado';
  severityColor: 'error' | 'warning' | 'info';
  whatToDo: string[];
  whatNotToDo: string[];
  icon: string;
  summary: string;
}

export interface FieldAlert {
  id: string;
  title: string;
  description: string;
  time: string;
  location: string;
  type: 'retraso' | 'alerta' | 'urgencia';
}

export interface CatalogItem {
  id: string;
  name: string;
  type: 'servicio' | 'medicacion';
  price: number;
}

export interface ClinicalRecord {
  id: string;
  appointmentId: string;
  notes: string;
  date: string;
  services: CatalogItem[];
  medications: CatalogItem[];
}

export interface Invoice {
  id: string;
  appointmentId: string;
  date: string;
  total: number;
  paymentMethod: 'Efectivo' | 'T. Débito' | 'T. Crédito' | 'Mercado Pago';
  items: CatalogItem[];
}
