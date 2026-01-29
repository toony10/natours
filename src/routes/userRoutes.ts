import express from 'express';
import { getAllUsers, createUser, getUser, updateUser, deleteUser } from '../controllers/userController';

/* 1) ROUTER */
export const router = express.Router();

/* 4) Routes */
router
    .route('/')
.get(getAllUsers)
.post(createUser);

router
    .route('/:id')
.get(getUser)
.patch(updateUser)
.delete(deleteUser);