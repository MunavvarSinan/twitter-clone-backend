import express from 'express';
import { PrismaClient } from '@prisma/client';

const tweetRoutes = express.Router();
const prisma = new PrismaClient();
//create tweet
tweetRoutes.post('/', async (req, res) => {
    const { content, image, userId } = req.body;
    try {
        const result = await prisma.tweet.create({
            data: {
                content,
                image,
                userId
            }
        })
        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({ error: "Failed to create tweet" })
    }

})

// list tweets
tweetRoutes.get('/', async (req, res) => {
    const tweets = await prisma.tweet.findMany();
    res.json(tweets);
})

// Get one tweet
tweetRoutes.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await prisma.tweet.findUnique({ where: { id: Number(id) } });
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