import express from 'express';
import { PrismaClient } from '@prisma/client';


const userRoutes = express.Router();
const prisma = new PrismaClient();

//create user
userRoutes.post('/', async (req, res) => {
    const { email, name, username } = req.body;
    try {
        const result = await prisma.user.create({
            data: {
                email,
                name,
                username
            }
        })
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: "Username or email already exists" });
    }
})

// list users
userRoutes.get('/', async (req, res) => {
    const allUsers = await prisma.user.findMany();
    console.log(allUsers);
    res.json(allUsers);
})

// Get one user
userRoutes.get('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: Number(id) } }); // we have to convert id to number because it is string by default and the database expects a number as id
    res.json(user);
})

//update user
userRoutes.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { bio, name, image } = req.body;
    try {
        const result = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                bio,
                name,
                image
            }
        })
        res.json({ message: "User updated successfully", result });
    } catch (error) {
        res.status(400).json({ error: "Failed to update the user" });
    }
})

//delete user
userRoutes.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: Number(id) } })
    res.status(200).json({ message: "User deleted successfully" });
})

export default userRoutes;