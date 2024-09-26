import connectDB from './db/index.js';
import cors from 'cors';
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import productRouter from './routes/product.js';
import errorHandlerMiddleware from './middleware/errorHandler.js'; 

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/products', productRouter);

connectDB();

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
