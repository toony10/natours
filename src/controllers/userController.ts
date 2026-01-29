import { Request, Response } from 'express';
import fs from 'fs';

const users= JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`, 'utf-8'),
);

export const getAllUsers = (req: Request, res: Response) => { 
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
}

export const createUser = (req: Request, res: Response) => { 
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}


export const getUser = (req: Request, res: Response) => { 
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

export const updateUser = (req: Request, res: Response) => { 
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

export const deleteUser = (req: Request, res: Response) => { 
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}