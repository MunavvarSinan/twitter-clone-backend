import 'dotenv/config';
import express from 'express';
import userRoutes from './routes/userRoutes'
import tweetRoutes from './routes/tweetRoutes';


const app = express();
app.use(express.json()); // automatiaclly parse json body instead of using a string body

app.get('/', (req, res) => {
    res.send('Hello World');
})

const port = process.env.PORT || 5000;

app.use('/api/user', userRoutes);
app.use('/api/tweet', tweetRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})