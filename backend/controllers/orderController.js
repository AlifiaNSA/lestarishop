import Midtrans from '../config/midtrans.js'
import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'

// Contorller function for Placing order using COD method
export const placeOrder = async (req, res) => {
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
export const placeOrderMidtrans = async (req, res) => {
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
export const verifyMidtrans = async (req, res) => {
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
export const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        // Fetch user info for each order
        const ordersWithUser = await Promise.all(orders.map(async (order) => {
            const user = await userModel.findById(order.userId).select('username email')
            return {
                ...order._doc,
                userAccount: user ? { username: user.username, email: user.email } : null
            }
        }))
        res.json({ success: true, orders: ordersWithUser })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Controller function for getting user orders for frontend
export const userOrders = async (req, res) => {
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
export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: 'Status Updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Controller function to get order details by ID for printing
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params
        const order = await orderModel.findById(orderId)
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }
        res.json({ success: true, order })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}
