import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

// @DEC create new order
// @ROUTE POST /api/orders
// @ACCESS Private
const addOrderItems = asyncHandler( async( req, res ) => {
    const { orderItems, billingAddress, paymentMethod, totalPrice } = req.body
    
    if(orderItems && orderItems.length === 0) {
        // bad request
        res.status(400)
        throw new Error(`Order is empty`)
    } else {
        const order = new Order({
            user: req.user._id,
            orderItems, 
            billingAddress, 
            paymentMethod, 
            totalPrice
        })
    
        const savedOrder = await order.save()
        
        res.status(201).json(savedOrder)
    }

})
// @DEC get order by id
// @ROUTE GET /api/orders/:id
// @ACCESS Private
const getOrder = asyncHandler( async( req, res ) => {
    // populate to get user
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if(order) {
        res.status(201).json(order)
    } else {
        // bad request
        res.status(404)
        throw new Error(`Order not found`)
    }
})
// @DEC update order to paid
// @ROUTE GET /api/orders/:id/pay
// @ACCESS Private
const updateOrderToPayed = asyncHandler( async( req, res ) => {
    // populate to get user
    const order = await Order.findById(req.params.id)
    if(order) {
        order.isPaid = true
        order.paidAt = Date.now()
        // from paypal api
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }
        // the order object returned by paypal looks like this:
        // Object { id: "78R270296V413942S", intent: "CAPTURE", status: "COMPLETED", purchase_units: (1) […], payer: {…}, create_time: "2021-07-21T09:53:50Z", update_time: "2021-07-21T09:54:56Z", links: (1) […] }
        // create_time: "2021-07-21T09:53:50Z"
        // id: "78R270296V413942S"
        // intent: "CAPTURE"
        // links: Array [ {…} ]
        // payer: Object { name: {…}, email_address: "sb-iftgx6853655@personal.example.com", payer_id: "M26UXU8EAEBLJ", … }
        // purchase_units: Array [ {…} ]
        // status: "COMPLETED"​
        // update_time: "2021-07-21T09:54:56Z"

        const updatedOrder = await order.save()

        res.json(updatedOrder)
    } else {
        // bad request
        res.status(404)
        throw new Error(`Payment not found`)
    }
})

// @DEC get the users orders for their profile page
// @ROUTE GET /api/orders/myorders
// @ACCESS Private
const getLoggedInUserOrders = asyncHandler( async( req, res ) => {
    // find the order based on the user._id
    const orders = await Order.find({ user: req.user._id })
    res.json(orders)
})

export { addOrderItems, getOrder, updateOrderToPayed, getLoggedInUserOrders }