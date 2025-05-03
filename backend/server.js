import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import productRouter from "./routes/productRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

// App Config
const app = express()
const port = process.env.PORT || 4000

connectDB()
connectCloudinary()

// Middleware
app.use(express.json())
app.use(cors({
  origin: 'https://lestarishop.vercel.app',
  optionsSuccessStatus: 200
}))

// Handle preflight OPTIONS requests for all routes
app.options('*', cors({
  origin: 'https://lestarishop.vercel.app',
  optionsSuccessStatus: 200
}))

// Error handling middleware to catch errors and ensure CORS headers
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  })
})

// Api endpoint
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get('/', (req, res)=>{
    res.send('Api Working')
})

app.listen(port, ()=> console.log('Server is running on port:' + port))