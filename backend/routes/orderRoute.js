import express from 'express'
import { 
    allOrders, 
    placeOrder, 
    //placeOrderStripe, 
    placeOrderMidtrans,
    updateStatus, 
    userOrders, 
    //verifyStripe,
    verifyMidtrans 
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

export default orderRouter