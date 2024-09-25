import express from 'express'

import dotenv from 'dotenv'
dotenv.config()

import connectDB from './db/db.js'

import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'

import cors from 'cors'

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

connectDB()

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
