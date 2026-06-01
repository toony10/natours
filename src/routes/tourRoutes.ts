import express from 'express';
import {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    checkID,
    checkBody
} from '../controllers/tourController';

/* 1) ROUTER */
export const router = express.Router();

router.param('id', checkID);

/* 2) ROUTES */
router.route('/')
.get(getAllTours)
.post(checkBody, createTour);

router.route('/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour);