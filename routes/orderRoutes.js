import express from 'express'
const router = express.Router()
import { verifyUser, admin } from '../middleware/auth.js'
import { addOrderItems, getOrder, updateOrderToPayed, getLoggedInUserOrders } from '../controllers/orderController.js'

router.route('/').post(verifyUser, addOrderItems)
router.route('/myorders').get(verifyUser, getLoggedInUserOrders)
router.route('/:id/pay').put(verifyUser, updateOrderToPayed)
router.route('/:id').get(verifyUser, getOrder)

export default router