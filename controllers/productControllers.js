import asyncHandler from 'express-async-handler'
import Product from '../models/ProductModel.js'

// @DEC FETCH ALL PRODUCTS
// @ROUTE GET /API/PRODUCTS
// @ACCESS PUBLIC
const getProducts = asyncHandler( async( req, res ) => {
    const products = await Product.find({})
    res.json(products)
})

// @DEC FETCH SELECTED PRODUCT
// @ROUTE GET /API/PRODUCTS/ID
// @ACCESS PUBLIC
const getProductById = asyncHandler( async(req, res) => {
    const requestedProduct = await Product.findById(req.params.id)
    if(requestedProduct) {
        res.json(requestedProduct);
    } else {
        // we set the status and that triggers our custom notFound error handler and then sets the message
        res.status(404)
        throw new Error(`Sorry, we can't find that product!`)
    }
})

export {getProducts, getProductById}