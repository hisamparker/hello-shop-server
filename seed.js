import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import products from './data/products.js'
import users from './data/users.js'
import Product from './models/ProductModel.js'
import Order from './models/orderModel.js'
import User from './models/userModel.js'
import connectDb from './config/db.js'

dotenv.config()

connectDb()

const importData = async () => {
    try {
        // clear everything from db
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        const testUsers = await User.insertMany(users)

        const testAdmin = testUsers[0]._id

        const adminOwnedProducts = products.map( product => {
            return {...product, user: testAdmin}
        })

        await Product.insertMany(adminOwnedProducts)

        console.log(`Data imported to DB`.zebra)
        process.exit()
    } catch (err) {
        console.error(`${err}`.red.inverse)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        // clear everything from db
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        console.log(`Data destroyed to DB`.america)
        process.exit()
    } catch (err) {
        console.error(`${err}`.red.inverse)
        process.exit(1)
    }
}

// old friend process.argv! if the command at index 2 is -d, then call destroyData, else call import (we make a script in package.json)
if(process.argv[2] === '-d') {
    destroyData()
} else {
    importData()
}