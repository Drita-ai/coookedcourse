import express, { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import catchAsync from '../utils/catchAsync'

// Validate client
const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // Check if token exist in the request body
    if (req.body.client !== '') token = req.body.client

    // If not, create token
    if (!token) token = uuidv4()

    req._cooked_client = token;

    next()
})

const generateClient = (req: Request, res: Response, next: NextFunction) => {
    const client = uuidv4();

    // Set the Client in cookie 
    const cookieOptions = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }

    res.cookie("client-cooking-course", client, cookieOptions)

    return client;
}

export default { generateClient, protect }