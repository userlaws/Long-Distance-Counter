import { Pool } from 'pg';

// Create a new database pool
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon connections
  },
});

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
