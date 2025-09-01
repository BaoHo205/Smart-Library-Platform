import mysql from '../database/mysql/connection';

const getGenres = async () => {
  try {
    const query = `
                SELECT id, name
                FROM genres;
            `;
    const result = await mysql.executeQuery(query);
    return result;
  } catch (error) {
    throw new Error(
      `Failed to get authors: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export default { getGenres };
