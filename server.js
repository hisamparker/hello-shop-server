import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDb from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import { notFound, errorHandler } from './middleware/handleErrors.js'

dotenv.config()

connectDb()

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

//app.get('/api/config/paypal', (req, res) =>  res.send(process.env.PAYPAL_CLIENT_ID))

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on ${PORT}`.rainbow))