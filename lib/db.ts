import { Pool } from 'pg';
import crypto from 'crypto';

// Define the story interface
export interface Story {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  approved: boolean;
}

// Create a new database pool
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon connections
  },
});

// Generate a random UUID
function generateId(): string {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : crypto.randomBytes(16).toString('hex');
}

// Initialize the database schema if it doesn't exist
export async function initializeDb() {
  try {
    // Connect to the database
    const client = await pool.connect();
    try {
      // Create the counters table if it doesn't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS counters (
          id TEXT PRIMARY KEY,
          count INTEGER NOT NULL DEFAULT 0
        );
      `);

      // Insert the LDR counter record if it doesn't exist
      await client.query(`
        INSERT INTO counters (id, count)
        VALUES ('ldr-counter', 0)
        ON CONFLICT (id) DO NOTHING;
      `);

      // Create the stories table if it doesn't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS stories (
          id TEXT PRIMARY KEY,
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          timestamp TIMESTAMP NOT NULL,
          approved BOOLEAN NOT NULL DEFAULT FALSE
        );
      `);

      // Create the submissions table to track one-time submissions
      await client.query(`
        CREATE TABLE IF NOT EXISTS submissions (
          ip TEXT PRIMARY KEY,
          timestamp TIMESTAMP NOT NULL
        );
      `);

      console.log('Database initialized successfully');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Get the current counter value
export async function getCounterValue() {
  try {
    const result = await pool.query(
      'SELECT count FROM counters WHERE id = $1',
      ['ldr-counter']
    );

    return result.rows[0]?.count || 0;
  } catch (error) {
    console.error('Error getting counter value:', error);
    return 0;
  }
}

// Increment the counter and return the new value
export async function incrementCounter() {
  try {
    const result = await pool.query(
      'UPDATE counters SET count = count + 1 WHERE id = $1 RETURNING count',
      ['ldr-counter']
    );

    return result.rows[0].count;
  } catch (error) {
    console.error('Error incrementing counter:', error);
    throw error;
  }
}

// Check if an IP has already submitted
export async function hasSubmitted(ip: string) {
  try {
    const result = await pool.query('SELECT * FROM submissions WHERE ip = $1', [
      ip,
    ]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking submission:', error);
    return false;
  }
}

// Record a submission from an IP
export async function recordSubmission(ip: string) {
  try {
    await pool.query(
      'INSERT INTO submissions (ip, timestamp) VALUES ($1, NOW()) ON CONFLICT (ip) DO UPDATE SET timestamp = NOW()',
      [ip]
    );
  } catch (error) {
    console.error('Error recording submission:', error);
    throw error;
  }
}

// Add a story to the database
export async function addStory(story: Omit<Story, 'id'>) {
  try {
    const id = generateId();
    await pool.query(
      'INSERT INTO stories (id, question, answer, timestamp, approved) VALUES ($1, $2, $3, $4, $5)',
      [id, story.question, story.answer, story.timestamp, story.approved]
    );
    return id;
  } catch (error) {
    console.error('Error adding story:', error);
    throw error;
  }
}

// Get approved stories
export async function getApprovedStories() {
  try {
    const result = await pool.query(
      'SELECT * FROM stories WHERE approved = TRUE ORDER BY timestamp DESC LIMIT 6'
    );
    return result.rows as Story[];
  } catch (error) {
    console.error('Error getting approved stories:', error);
    return [];
  }
}
