import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'

import connectDB from './db/db.js'

dotenv.config()
connectDB()

const importData = async () => {
  try {
    //delete everything before importing

    await Product.deleteMany()
    await User.deleteMany()

    //create users into DB
    const createUsers = await User.insertMany(users)

    //get admin user
    const adminUser = createUsers[0]._id

    //create products by admin user
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser }
    })

    //insert products into DB
    await Product.insertMany(sampleProducts)

    console.log('Data Imported!'.green.inverse)

    process.exit()
  } catch (error) {
    console.log(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Product.deleteMany()
    await User.deleteMany()

    console.log('Data Destroyed!'.red.inverse)

    process.exit()
  } catch (error) {
    console.log(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
