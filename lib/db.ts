import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '',
  database: process.env.POSTGRES_DB || 'my_database',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  max: 10,
  idleTimeoutMillis: 30000
});

export default pool;
