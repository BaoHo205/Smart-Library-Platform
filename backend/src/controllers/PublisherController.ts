import { Request, Response, NextFunction } from 'express';
import PublisherService, { PublisherRow } from '@/services/PublisherService';

const getPublishers = async (req: Request, res: Response) => {
  try {
    const publishers = await PublisherService.getPublishers();
    res.status(200).json({
      success: true,
      message: 'Publishers retrieved successfully',
      data: publishers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
};

const createNewPublisher = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Name is required.',
      });
    }
    const publisher: PublisherRow = await PublisherService.createNewPublisher(
      name.trim()
    );

    res.status(200).json({
      success: true,
      message: 'Publisher created successfully',
      data: publisher,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
};

export default { getPublishers, createNewPublisher };
