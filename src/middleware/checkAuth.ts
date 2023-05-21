import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export interface CustomRequest extends Request {
    userId?: number;
}


const checkAuthorization = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
        // Verify and decode the token
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET as string) as { tokenId: number }
        if (!decodedToken.tokenId) return res.status(401).json({ error: "Unauthorized" });
        const dbToken = await prisma.token.findUnique({ where: { id: decodedToken.tokenId }, include: { user: true } });
        if (!dbToken || !dbToken?.valid || dbToken.expiration < new Date()) {
            return res.status(401).json({ error: "API token not valid or expired" });
        }
        req.userId = dbToken.user.id;

        // Add the decoded token data to the request object
        // req.userId = decodedToken.userId;

        // If additional data needs to be passed, add it to the request object as well

        // Call next() to proceed to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token is not valid' });
    }
}


export default checkAuthorization;