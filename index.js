const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const userRouter = require('./src/routes/user.routes');
const carRouter = require('./src/routes/cars.routes');

dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 4500;

app.get('/', (req, res) => {
  res.send('Welcome To My Home Page');
});

app.use('/api/users', userRouter);
app.use('/api/cars', carRouter);

// connect DB first, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});