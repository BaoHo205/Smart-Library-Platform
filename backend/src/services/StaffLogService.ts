import mysqlConnection from '../database/mysql/connection';
import { v4 as uuidv4 } from 'uuid';
import { StaffLog } from '../models/mysql/StaffLog';
import { ResultSetHeader } from 'mysql2/promise';
import { AppError } from '@/types/errors';

/**
 * Creates a new log entry in the Staff_Logs table.
 * @param {Omit<IStaffLog, 'id' | 'created_at' | 'updated_at'>} logData - The data for the log entry, excluding auto-generated fields.
 * @returns {Promise<IStaffLog>} A promise that resolves to the created log object.
 */
export const createStaffLog = async (
  logData: Omit<StaffLog, 'id' | 'createdAt' | 'updatedAt'> // Omit auto-generated fields
): Promise<StaffLog> => {
  const logId = uuidv4(); // Generate a new UUID for the log entry

  try {
    const query = `
            INSERT INTO staff_logs (id, userId, bookId, actionType, actionDetails, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `;
    const params = [
      logId,
      logData.userId,
      logData.bookId,
      logData.actionType,
      logData.actionDetails,
    ];

    const results = await mysqlConnection.executeQuery(query, params);

    // For INSERT, results is typically an OkPacket. We check affectedRows.
    if ((results as ResultSetHeader).affectedRows === 0) {
      throw new Error('Failed to create staff log: No rows affected.');
    }

    // Return the created log data, including the generated ID
    return {
      ...logData,
      id: logId,
      createdAt: new Date(), // Approximate, DB will set exact
      updatedAt: new Date(), // Approximate, DB will set exact
    };
  } catch (error) {
    console.error('Error in staffLogService.createStaffLog:', error);
    if (error instanceof Error) {
      throw new Error(`Could not create staff log: ${error.message}`);
    } else {
      throw new Error(`Could not create staff log: ${String(error)}`);
    }
  }
};


const getStaffLogs = async (startDate?: string, endDate?: string): Promise<StaffLog[]> => {
  try {
    let query: string;
    let params: string[] = [];

    if (startDate && endDate) {
      // Filter by date range if both dates are provided
      query = `
        SELECT 
          l.id,
          CONCAT(u.firstName, ' ', u.lastName) AS userName,
          l.actionType,
          l.actionDetails,
          l.createdAt
        FROM
          staff_logs l
              JOIN
          users u ON u.id = l.userId
        WHERE
          l.createdAt BETWEEN ? AND ?
        ORDER BY l.createdAt DESC;
      `;
      params = [startDate, endDate];
    } else {
      // Get all logs if no date range is provided
      query = `
        SELECT 
          l.id,
          CONCAT(u.firstName, ' ', u.lastName) AS userName,
          l.actionType,
          l.actionDetails,
          l.createdAt
        FROM
          staff_logs l
              JOIN
          users u ON u.id = l.userId
        ORDER BY l.createdAt DESC;
      `;
    }

    const results = await mysqlConnection.executeQuery(query, params) as StaffLog[];
    return results;
  } catch (error) {
    // AppError
    if (error instanceof AppError) {
      throw error;
    }
    // Handle database errors
    console.error('Database error in staff log retrieval:', error);
    throw new Error('Failed to retrieve staff log due to database error');
  }
}

export default {
  createStaffLog,
  getStaffLogs
};