import Midtrans from '../config/midtrans.js'
import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'

// Contorller function for Placing order using COD method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address} = req.body

        // Input validation
        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ success: false, message: 'Missing required fields' })
        }

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now(),
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.status(201).json({ success: true, message: 'Pesanan Diterima' })
    } catch (error) {
        console.error('Error in placeOrder:', error)
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

// Controller function for Placing order using Midtrans
const placeOrderMidtrans = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body

        // Input validation
        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ success: false, message: 'Missing required fields' })
        }

        const origin = req.headers.origin || `${req.protocol}://${req.get('host')}`
        
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: 'Transfer',
            payment: false,
            date: Date.now(),
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        // Create Midtrans transaction
        const parameter = {
            transaction_details: {
                order_id: newOrder._id.toString(),
                gross_amount: amount
            },
            customer_details: {
                user_id: userId
            },
            callbacks: {
                finish: `${origin}/verify?success=true&orderId=${newOrder._id}`,
                cancel: `${origin}/verify?success=false&orderId=${newOrder._id}`
            }
        }

        const transaction = await Midtrans.createTransaction(parameter)
        res.status(201).json({ success: true, session_url: transaction.redirect_url })
    } catch (error) {
        console.error('Error in placeOrderMidtrans:', error)
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

// Controller function for verifying Midtrans payment
const verifyMidtrans = async (req, res) => {
    const { orderId, success, userId } = req.body
    try {
       if (success === 'true') {
           await orderModel.findByIdAndUpdate(orderId, { payment: true})
           await userModel.findByIdAndUpdate(userId, { cartData: {} })
           res.json({ success: true, message: 'Payment Verified' })
       }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// Controller function for getting all orders data for Admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Controller function for getting user orders for frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Controller function for updating order status for Admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: 'Status Updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { 
    placeOrder, 
    placeOrderMidtrans,
    allOrders, 
    userOrders, 
    updateStatus, 
    verifyMidtrans 
}
