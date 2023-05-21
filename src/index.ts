import 'dotenv/config';
import express from 'express';
import userRoutes from './routes/userRoutes'
import tweetRoutes from './routes/tweetRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
app.use(express.json()); // automatiaclly parse json body instead of using a string body

app.get('/', (req, res) => {
    res.send('Hello World');
})

const port = process.env.PORT || 5000;

app.use('/api/user', userRoutes);
app.use('/api/tweet', tweetRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})