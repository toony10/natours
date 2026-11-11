import { NextFunction, Request, Response } from 'express';
import { Tour } from '../models/toure.model';
import { APIFeatures } from '../utils/apiFeatures';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

export const getAllTours = catchAsync(async (req: Request, res: Response) => {
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
            },
        },
    });
});

export const getTourStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: null,
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                maxPrice: { $max: '$price' },
                minPrice: { $min: '$price' },
            },
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats,
        },
    });
});

export const aliasTopTours = async (req: Request, res: Response, next: NextFunction) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

export const createTour = catchAsync(async (req: Request, res: Response) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour,
        },
    });
});

export const getTour = catchAsync(async (req: Request, res: Response) => {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
        throw new AppError('No tour found with that ID', 404);
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
});

export const updateTour = catchAsync(async (req: Request, res: Response) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!tour) {
        throw new AppError('No tour found with that ID', 404);
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
});

export const deleteTour = catchAsync(async (req: Request, res: Response) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
        throw new AppError('No tour found with that ID', 404);
    }

    res.status(200).json({
        status: 'success',
        message: 'Tour deleted successfully',
        data: {
            tour,
        },
    });
});
