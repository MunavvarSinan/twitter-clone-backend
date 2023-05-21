import express from 'express';
import { PrismaClient } from '@prisma/client';
import checkAuthorization, { CustomRequest } from '../middleware/checkAuth';
const tweetRoutes = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;

//create tweet
tweetRoutes.post('/', checkAuthorization, async (req: CustomRequest, res) => {
    const { content, image } = req.body;
    const authHeader = req.headers['authorization'];
    const userId = req?.userId as number
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    try {
        const result = await prisma.tweet.create({
            data: {
                content,
                image,
                userId
            },
            include: { user: true },
        });

        res.json(result);
    } catch (e) {
        res.status(400).json({ error: 'Username and email should be unique' });
    }

})

// list tweets
tweetRoutes.get('/', async (req, res) => {
    // { include: { user: true } } is used to include the user object in the tweet object instead of creating two seperate queries to list the tweets and the user
    /*
    include: { user: { select: { name: true, username: true, image: true } } } is used to include only the name, username and image of the user in the tweet object
    */
    const tweets = await prisma.tweet.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    username: true,
                    image: true
                }
            },
        },



    });
    res.json(tweets);
})

// Get one tweet
tweetRoutes.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await prisma.tweet.findUnique({ where: { id: Number(id) }, include: { user: true } });
        if (!result) return res.status(404).json({ error: "Tweet not found" });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: "Failed to get tweet" })
    }

})

//update tweet
tweetRoutes.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { content, image } = req.body;
    try {
        const result = await prisma.tweet.update({
            where: { id: Number(id) },
            data: {
                content,
                image
            }
        })
        res.status(200).json({ message: "Tweet updated successfully", result });
    } catch (error) {
        res.status(400).json({ error: "Failed to update tweet" })
    }
})

//delete tweet
tweetRoutes.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.tweet.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Tweet deleted successfully" });
})

export default tweetRoutes;