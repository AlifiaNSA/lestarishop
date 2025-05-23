import userModel from "../models/userModel.js"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// Function for creating token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Container function for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email });
        console.log("Retrieved user:", user);

        if(!user){
            return res.json({success: false, message: 'User dosent exists'})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isMatch);

        if(isMatch){ // Corrected logic
            const token = createToken(user._id)
            res.json({success: true, token})
        } else {
            res.json({success: false, message: 'Invalid credentials'}) // Corrected logic
        }

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// Container function for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body 

        // Checking if user is already exists
        const exists = await userModel.findOne({ email });

        if(exists){
            return res.json({success: false, message: 'User already exists'})
        }
        // validate password and checking password strength
        if(!validator.isEmail(email)){
            return res.json({success: false, message: 'Please enter a valid email'})
        }
        if(password.length < 8){
            return res.json({success: false, message: 'Password enter a strong password'})
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({success: true, token})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// Container function for user login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS){
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({success: true, token})
        }
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// New controller function to get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.body.userId
        const user = await userModel.findById(userId).select('-password')
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }
        res.json({ success: true, user })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { loginUser, registerUser, adminLogin, getUserProfile }
