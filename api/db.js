import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

export async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      ticketNumber TEXT,
      patientName TEXT,
      species TEXT,
      serviceType TEXT,
      doctorName TEXT,
      date TEXT,
      time TEXT,
      status TEXT,
      confirmed_attendance BOOLEAN DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Attempt to add column if it doesn't exist (SQLite ALTER TABLE limitation workaround)
  try {
    await db.execute("ALTER TABLE appointments ADD COLUMN confirmed_attendance BOOLEAN DEFAULT 0");
  } catch (e) {
    // Column likely already exists, ignore error
  }

  await db.execute(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      endpoint TEXT NOT NULL,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  console.log('Database tables initialized');
}
