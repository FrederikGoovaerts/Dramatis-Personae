import { Pool } from 'pg';

const pool = new Pool();

export async function terminate(): Promise<void> {
    await pool.end();
}

export default pool;
