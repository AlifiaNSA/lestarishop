import express from 'express'
import { 
    allOrders, 
    placeOrder, 
    //placeOrderStripe, 
    placeOrderMidtrans,
    updateStatus, 
    userOrders, 
    //verifyStripe,
    verifyMidtrans,
    getOrderById
} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// For Admin
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// For Payment
orderRouter.post('/place', authUser, placeOrder)
//orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/midtrans', authUser, placeOrderMidtrans)

// Verify Payment
//orderRouter.post('/verifyStripe', authUser, verifyStripe)
orderRouter.post('/verifyMidtrans',authUser, verifyMidtrans)

// For User
orderRouter.post('/userorders', authUser, userOrders)

// For printing order details
orderRouter.get('/print/:orderId', authUser, getOrderById)

export default orderRouter
