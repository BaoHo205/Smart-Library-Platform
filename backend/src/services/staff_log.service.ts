import mysqlConnection from "../database/mysql/connection";
import { v4 as uuidv4 } from "uuid";
import { StaffLog } from "../models/staff_log.model";
import { ResultSetHeader } from 'mysql2/promise';
import * as mysql from 'mysql2/promise';

/**
 * Creates a new log entry in the Staff_Logs table.
 * @param {Omit<StaffLog, 'id' | 'created_at' | 'updated_at'>} logData - The data for the log entry, excluding auto-generated fields.
 * @param {mysql.PoolConnection} [connection] - An optional existing database connection to use for transactions.
 * @returns {Promise<StaffLog>} A promise that resolves to the created log object.
 */
export const createStaffLog = async (
    logData: Omit<StaffLog, 'id' | 'created_at' | 'updated_at'>,
    connection?: mysql.PoolConnection // <-- The key change: accept an optional connection
): Promise<StaffLog> => {
    const logId = uuidv4();

    try {
        const query = `
            INSERT INTO Staff_Logs (id, staff_id, action_type, action_details)
            VALUES (?, ?, ?, ?)
        `;
        const params = [
            logId,
            logData.staff_id,
            logData.action_type,
            logData.action_details
        ];

        const [results] = await mysqlConnection.executeQuery(query, params, connection);

        if ((results as ResultSetHeader).affectedRows === 0) {
            throw new Error('Failed to create staff log: No rows affected.');
        }

        return {
            ...logData,
            id: logId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

    } catch (error) {
        // We do NOT call rollback here. The calling function (e.g., addNewBook) is responsible for that.
        console.error('Error in staffLogService.createStaffLog:', error);
        if (error instanceof Error) {
            throw new Error(`Could not create staff log: ${error.message}`);
        } else {
            throw new Error(`Could not create staff log: ${String(error)}`);
        }
    }
};
