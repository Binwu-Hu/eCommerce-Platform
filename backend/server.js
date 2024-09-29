import cartRoutes from './routes/cartRoutes.js';
import connectDB from './db/db.js'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()


const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectDB()
const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  const frontendUrl = req.headers['frontend_url']; // Retrieve the frontend URL from the headers

  if (frontendUrl) {
    corsOptions = { origin: frontendUrl }; // Allow the request origin
  } else {
    corsOptions = { origin: false }; // Disable CORS if no valid origin is found
  }

  callback(null, corsOptions); // callback expects two parameters: error and options
};
app.use(cors(corsOptionsDelegate)); 

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/cart', cartRoutes);

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
