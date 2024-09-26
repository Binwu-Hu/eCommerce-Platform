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
app.use(cors())

connectDB()

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/carts', cartRoutes);

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
