import mysql from '../database/mysql/connection';
import { RowDataPacket } from 'mysql2/typings/mysql/lib/protocol/packets/RowDataPacket';

export interface AuthorRow extends RowDataPacket {
    id: string;
    firstName: string;
    lastName: string;
};

const getAuthors = async () => {
    try {
        const query = `
                SELECT id, firstName, lastName
                FROM authors;
            `;
        const result = await mysql.executeQuery(query);
        console.log(result)
        return result;
    } catch (error) {
        throw new Error(
            `Failed to get authors: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
}

const createNewAuthor = async (firstName: string, lastName: string) => {
    try {
        const query = `CALL CreateAuthor(?, ?);`;
        const result = await mysql.executeQuery(query, [firstName, lastName]) as AuthorRow[];

        return result[0];
    } catch (error) {
        throw new Error(
            `Failed to create author: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
}

export default { getAuthors, createNewAuthor }