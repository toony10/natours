import { NextFunction, Request, Response } from 'express';
import { Tour } from '../models/toure.model';
import { Query } from "mongoose";
import { ParsedQs } from "qs";

class APIFeatures {
    public page = 1;
    public limit = 10;
    constructor(public query: Query<any, any>,
        public queryString: ParsedQs) { }
    
    // Filtering
    filter() { 
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${ match }`);
        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
         if (this.queryString.sort) { 
            const sortBy = (this.queryString.sort as string).split(',').join(' ');
            console.log('sort by',sortBy);
            this.query = this.query.sort(sortBy);
        }else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() { 
        if (this.queryString.fields) {
            const fields = (this.queryString.fields as string).split(',').join(' ');
            console.log('fields',fields);
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        this.page = parseInt(this.queryString.page as string) || 1;
        this.limit = parseInt(this.queryString.limit as string) || 10;

        const skip = (this.page - 1) * this.limit;

        this.query = this.query.skip(skip).limit(this.limit);

        return this;
    }
}

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