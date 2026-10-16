import { NextFunction, Request, Response } from 'express';
import { Tour } from '../models/toure.model';
import {APIFeatures} from '../utils/apiFeatures';

export const getAllTours = async (req: Request, res: Response) => {
    try {
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
        
        const tours = await features.query;
        
        const total = await Tour.countDocuments(features.query.getFilter());
        const totalpages = Math.ceil(total / features.limit);
        
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
            pagination: {
              page: features.page,
              limit: features.limit,
              total: total,
              totalpages: totalpages,
            }
        }
  });
} catch (err) {
    res.status(404).json({
        status: 'error',
        message: 'No tours found',
        error: (err as Error).message
    });
}
}

export const getTourStats = async (req: Request, res: Response) => { 
    try { 
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: null,
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    maxPrice: { $max: '$price' },
                    minPrice: { $min: '$price' }
                }
            }
        ]);
        
        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    }catch (err) {
        res.status(404).json({
            status: 'error',
            message: 'No stats found',
            error: (err as Error).message
        });
    }
}

export const aliasTopTours = async (req: Request, res: Response, next: NextFunction) => { 
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";
    next();
}

export const createTour = async (req: Request, res: Response) => {
    try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Error creating tour',
            error: (err as Error).message
        });
    }
}

export const getTour = async (req: Request, res: Response) => {
    try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'No tour found with that ID',
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
} catch (err) {
    res.status(404).json({
        status: 'error',
        message: 'No tour found',
        error: (err as Error).message
    });
}
}

export const updateTour = async (req: Request, res: Response) => { 
    try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
} catch (err) {
    res.status(404).json({
        status: 'error',
        message: 'No tour found',
        error: (err as Error).message
    });
}
}


export const deleteTour = async (req: Request, res: Response) => {
    try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'No tour found with that ID',
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Tour deleted successfully',
        data: {
            tour
        }
    });
} catch (err) {
    res.status(404).json({
        status: 'error',
        message: 'No tour found',
        error: (err as Error).message
    });
}
}