import mysqlConnection from "../database/mysql/connection";
import { v4 as uuidv4 } from "uuid";
import { StaffLog } from "../models/StaffLogModel";
import { ResultSetHeader } from 'mysql2/promise';

/**
 * Creates a new log entry in the Staff_Logs table.
 * @param {Omit<IStaffLog, 'id' | 'created_at' | 'updated_at'>} logData - The data for the log entry, excluding auto-generated fields.
 * @returns {Promise<IStaffLog>} A promise that resolves to the created log object.
 */
export const createStaffLog = async (
    logData: Omit<StaffLog, 'id' | 'created_at' | 'updated_at'> // Omit auto-generated fields
): Promise<StaffLog> => {
    const logId = uuidv4(); // Generate a new UUID for the log entry

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

        const [results] = await mysqlConnection.executeQuery(query, params);

        // For INSERT, results is typically an OkPacket. We check affectedRows.
        if ((results as ResultSetHeader).affectedRows === 0) {
            throw new Error('Failed to create staff log: No rows affected.');
        }

        // Return the created log data, including the generated ID
        return {
            ...logData,
            id: logId,
            created_at: new Date().toISOString(), // Approximate, DB will set exact
            updated_at: new Date().toISOString()  // Approximate, DB will set exact
        };

    } catch (error) {
        console.error('Error in staffLogService.createStaffLog:', error);
        if (error instanceof Error) {
            throw new Error(`Could not create staff log: ${error.message}`);
        } else {
            throw new Error(`Could not create staff log: ${String(error)}`);
        }
    }
}