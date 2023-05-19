import express from 'express';

const userRoutes = express.Router();

//create user
userRoutes.post('/', (req, res) => {

})

// list users
userRoutes.get('/', (req, res) => {

})

// Get one user
userRoutes.get('/:id', (req, res) => {
    const { id } = req.params;
})

//update user
userRoutes.put('/:id', (req, res) => {
    const { id } = req.params;
})

//delete user
userRoutes.delete('/:id', (req, res) => {
    const { id } = req.params;
})

export default userRoutes;