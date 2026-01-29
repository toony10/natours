import express from 'express';
import { getAllTours, createTour,getTour, updateTour, deleteTour } from '../controllers/tourController';

/* 1) ROUTER */
export const router = express.Router();




/* 2) ROUTES */
router.route('/')
.get(getAllTours)
.post(createTour);

router.route('/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour);