import express from 'express';

const tweetRoutes = express.Router();

//create tweet
tweetRoutes.post('/', (req, res) => {

})

// list tweets
tweetRoutes.get('/', (req, res) => {

})

// Get one tweet
tweetRoutes.get('/:id', (req, res) => {
    const { id } = req.params;
})

//update tweet
tweetRoutes.put('/:id', (req, res) => {
    const { id } = req.params;
})

//delete tweet
tweetRoutes.delete('/:id', (req, res) => {
    const { id } = req.params;
})

export default tweetRoutes;