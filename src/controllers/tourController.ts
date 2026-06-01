import { Request, Response } from 'express';
import fs from 'fs';


const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'),
);

export const checkID = (req: Request, res: Response, next: Function, val: string) => {
    const id = Number(req.params.id);
    console.log(`Tour id is: ${val}`);
    if (isNaN(id) || id <= 0 || id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    next();
}

export const checkBody = (req: Request, res: Response, next: Function) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        });
    }
    next();
}

export const getAllTours = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
}

export const createTour = (req: Request, res: Response) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    
    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Error creating tour'
            });
        }
        res.status(201).json({
            status: 'success',
            message: 'Tour created successfully',
            data: newTour
        });
    });
}

export const getTour = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const tour = tours.find((tour: any) => tour.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
}

export const updateTour =  (req: Request, res: Response) => { 
    const id = Number(req.params.id);
    const tour = tours.find((tour: any) => tour.id === id);
    
    Object.assign(tour, req.body);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Error updating tour'
            });
        }
    });
    res.status(200).json({
        status: 'success',
        message: 'Tour updated successfully',
        data: {
            tour
        }
    });
}


export const deleteTour = (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const newTours = tours.filter((tour: any) => tour.id !== id);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(newTours), (err) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: err.message
            });
        }
    });
    res.status(200).json({
        status: 'success',
        message: 'Tour deleted successfully',
        data: null
    });
} 