import pool from '../database/mysql/connection';
import { RowDataPacket } from 'mysql2/typings/mysql/lib/protocol/packets/RowDataPacket';

export interface GenreSelect extends RowDataPacket {
  value: string;
  label: string;
}

async function getAllGenres(): Promise<GenreSelect[]> {
  const rows = (await pool.executeQuery(
    'SELECT id as value, name as label FROM genres'
  )) as GenreSelect[];
  return rows;
}

export { getAllGenres };
