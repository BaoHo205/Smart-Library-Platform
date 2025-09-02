import { RowDataPacket } from 'mysql2/typings/mysql/lib/protocol/packets/RowDataPacket';
import mysql from '../database/mysql/connection';

export interface PublisherRow extends RowDataPacket {
  id: string;
  name: string;
}

const getPublishers = async () => {
  try {
    const query = `
                SELECT id, name
                FROM publishers;
            `;
    const result = await mysql.executeQuery(query);
    return result;
  } catch (error) {
    throw new Error(
      `Failed to get authors: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const createNewPublisher = async (name: string) => {
  try {
    const query = `CALL CreatePublisher(?);`;
    const result = (await mysql.executeQuery(query, [name])) as PublisherRow[];

    console.log(result[0]);
    return result[0];
  } catch (error) {
    throw new Error(
      `Failed to create publisher: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export default { getPublishers, createNewPublisher };
