import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleGenAI } from '@google/genai';
import { db, initDb } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar el libro de emergencias en memoria
let petEmergenciaBook = '';
try {
  petEmergenciaBook = fs.readFileSync(path.join(__dirname, 'data', 'pet_emergencia.md'), 'utf-8');
  console.log('Libro "Pet Emergencia" cargado correctamente en memoria.');
} catch (e) {
  console.warn('No se pudo cargar pet_emergencia.md:', e.message);
}

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_pets_key';

// Initialize DB
initDb().catch(console.error);

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = 'usr_' + Date.now();
    
    await db.execute({
      sql: 'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
      args: [userId, name, email, hashedPassword]
    });
    
    const token = jwt.sign({ id: userId, email, name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: userId, name, email } });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'El email ya está registrado o hubo un error.' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email]
    });
    
    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Create Appointment
app.post('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const { patientName, species, serviceType, doctorName, date, time } = req.body;
    const aptId = 'apt_' + Date.now();
    const ticketNumber = '#PT-' + Math.floor(1000 + Math.random() * 9000);
    
    await db.execute({
      sql: 'INSERT INTO appointments (id, user_id, ticketNumber, patientName, species, serviceType, doctorName, date, time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [aptId, req.user.id, ticketNumber, patientName, species, serviceType, doctorName, date, time, 'confirmado']
    });
    
    res.json({ success: true, appointment: { id: aptId, ticketNumber, patientName, species, serviceType, doctorName, date, time, status: 'confirmado' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
});

// Get User Appointments
app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM appointments WHERE user_id = ? ORDER BY id DESC',
      args: [req.user.id]
    });
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// AI First Aid Assistant
app.post('/api/first-aid', async (req, res) => {
  try {
    const { query, species } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY no está configurada en el servidor.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `Actúa ESTRICTAMENTE como un Veterinario Virtual experto. 
A continuación te proporciono un manual de emergencias veterinarias llamado "Pet Emergencia":

--- INICIO DEL MANUAL PET EMERGENCIA ---
${petEmergenciaBook}
--- FIN DEL MANUAL PET EMERGENCIA ---

Un usuario consulta sobre una emergencia o síntoma de su animal (Especie: ${species}). 
Consulta del usuario: "${query}"

REGLAS ESTRICTAS:
1. BASA tu respuesta EXCLUSIVAMENTE en la información proporcionada en el "Manual Pet Emergencia". No inventes tratamientos ni recomiendes medicamentos humanos que no estén avalados en el manual.
2. Si el síntoma o emergencia consultada NO se menciona en el manual, debes indicar claramente: "Lamentablemente, este caso específico no está cubierto en mi manual de primeros auxilios. Debes acudir a una clínica veterinaria de inmediato."
3. Brinda una guía estructurada, rápida y concisa en formato Markdown.
4. Tu respuesta DEBE incluir:
   - Breve evaluación rápida del riesgo (basado en el manual).
   - Qué HACER (pasos claros y seguros extraídos del manual).
   - Qué NO HACER (errores comunes o prohibiciones indicadas en el manual).
5. Termina SIEMPRE con una advertencia en negrita recordando que esto no reemplaza la atención veterinaria profesional y que si es urgente, acudan a una clínica.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ result: response.text });
  } catch (error) {
    console.error('Error con Gemini AI:', error);
    res.status(500).json({ error: 'Hubo un error al procesar tu consulta con la IA.' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
