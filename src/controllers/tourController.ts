import { NextFunction, Request, Response } from 'express';
import { Tour } from '../models/toure.model';

export const getAllTours = async (req: Request, res: Response) => {
    try {
        // Create the query object
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));

        // Sorting
        if (req.query.sort) { 
            const sortBy = (req.query.sort as string).split(',').join(' ');
            console.log('sort by',sortBy);
            query = query.sort(sortBy);
        }else {
            query = query.sort('-createdAt');
        }

        // Field limiting
        if (req.query.fields) {
            const fields = (req.query.fields as string).split(',').join(' ');
            console.log('fields',fields);
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // Pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        const total = await Tour.countDocuments();
        const totalpages = Math.ceil(total / limit);
        if (req.query.page) {
            if (skip >= total) throw new Error('This page does not exist');
        }

    const tours = await query;
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
            pagination: {
                page,
                limit,
                total,
                totalpages,
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

export const aliasTopTours = async (req: Request, res: Response, next: NextFunction) => { 
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fildes = "name,price,ratingsAverage,summary,difficulty";
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