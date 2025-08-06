import { Request, Response } from "express";
import StaffService from "../services/StaffService";

const getMostBorrowedBooks = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required'
            });
        }

        const result = await StaffService.getMostBorrowedBooks(String(startDate), String(endDate));
        res.status(200).json({
            success: true,
            message: 'Most borrowed books retrieved successfully',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `${error instanceof Error ? error.message : 'Unknown error'}`
        });
    }
}

const getTopActiveReaders = async (req: Request, res: Response) => {
    try {
        const result = await StaffService.getTopActiveReaders();
        res.status(200).json({
            success: true,
            message: 'Top active readers retrieved successfully',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `${error instanceof Error ? error.message : 'Unknown error'}`
        });
    }
}

const getBooksWithLowAvailability = async (req: Request, res: Response) => {
    try {
        const response = await StaffService.getBooksWithLowAvailability();
        res.status(200).json({
            success: true,
            message: 'Books with low availability retrieved successfully',
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `${error instanceof Error ? error.message : 'Unknown error'}`
        });
    }

}

export default {
    getMostBorrowedBooks,
    getTopActiveReaders,
    getBooksWithLowAvailability
}