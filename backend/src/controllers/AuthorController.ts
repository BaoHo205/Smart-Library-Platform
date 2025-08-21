import { Request, Response, NextFunction } from 'express';
import AuthorService, { AuthorRow } from '@/services/AuthorService';

const getAuthors = async (req: Request, res: Response) => {
    try {
        const authors = await AuthorService.getAuthors();
        res.status(200).json({
            success: true,
            message: 'Authors retrieved successfully',
            data: authors,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}

const createNewAuthor = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName } = req.body;

        // Validation for empty or null names.
        if (!firstName || !lastName || firstName.trim() === '' || lastName.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'First name and last name are required.',
            });
        }

        const author: AuthorRow = await AuthorService.createNewAuthor(firstName.trim(), lastName.trim());

        res.status(200).json({
            success: true,
            message: 'Author created successfully',
            data: author,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}

export default { getAuthors, createNewAuthor }