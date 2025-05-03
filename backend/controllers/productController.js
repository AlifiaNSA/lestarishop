import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/productModel.js'

// Cotroller function for adding a product
const addProduct = async(req, res) => {
    try {
const {name, description, price, category, subCategory, sizes, popular, stock} = req.body


        // Extracting images if provided
        const image1 = req.files?.image1?.[0]
        const image2 = req.files?.image2?.[0]
        const image3 = req.files?.image3?.[0]
        const image4 = req.files?.image4?.[0]

        const images = [image1, image2, image3, image4].filter((item)=> item !== undefined) 

        // upload images to cloudinary or use a default image
        let imagesUrl
        if(images.length > 0){
            imagesUrl = await Promise.all(
                images.map(async (image) => {
                    const result = await cloudinary.uploader.upload(image.path, {resource_type: "image"})
                    return result.secure_url
                })
            )
        } else {
        // Default image URL if no image is provided
            imagesUrl = ["https://via.placeholder.com/150"]
        }

        // Create product data
        const productData ={
            name,
            description,

            price: Number(price),
            category,
            subCategory,
            popular: popular === 'true' ? true : false,
            sizes: sizes ? JSON.parse(sizes) : [], // Default to empty array if sizes not provided
            image: imagesUrl,
            stock: stock ? Number(stock) : 0,
            date: Date.now()
        }

        console.log(productData)

        const product = new productModel(productData)
        await product.save()

        res.json({ success: true, message: 'Product Added'})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Cotroller function for removing a product
const removeProduct = async(req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: 'Product Removed'})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Cotroller function for single product details
const singleProduct = async(req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({ success: true, product })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Cotroller function for product list
const listProduct = async(req, res) => {
    try {
        const products = await productModel.find({})
        res.json({ success: true, products })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateStock = async (req, res) => {
    try {
        const { id, stock } = req.body;
        if (!id || stock === undefined) {
            return res.status(400).json({ success: false, message: 'Product id and stock are required' });
        }
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        product.stock = stock;
        await product.save();
        res.json({ success: true, message: 'Stock updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export {addProduct, removeProduct, singleProduct, listProduct, updateStock}
