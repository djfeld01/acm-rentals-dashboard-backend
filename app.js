require('dotenv').config();
require('express-async-errors');

//extra security packages
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');

//packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const express = require('express');
const app = express();

//connect to db
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/authRoutes');
const locationRouter = require('./routes/locationRoutes');
const tenantActivityRouter = require('./routes/tenantActivityRoutes');

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
// const { authenticateUser } = require('./middleware/authentication');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.static('./public'));
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));

app.use(morgan('tiny'));
app.use(cookieParser(process.env.JWT_SECRET));

app.get('/', (req, res) => {
  res.send('acm-rentals-dashboard');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/location', locationRouter);
app.use('/api/v1/tenantActivity', tenantActivityRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// app.get('/', (req,res)=>{

//     res.send(`Rentals API`)
// })

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
