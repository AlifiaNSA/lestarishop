import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import Footer from '../components/Footer'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

    const { navigate, token, cartItems, setCartItems, getCartAmount, delivery_charges, products, backendUrl } = useContext(ShopContext)
    const [method, setMethod] = useState('cod')

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: "",
    })

    const onChangeHandler = (e) => {
        const name = e.target.name
        const value = e.target.value

        setFormData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            let orderItems = []
            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        if (itemInfo) {
                            itemInfo.size = item
                            itemInfo.quantity = cartItems[items][item]
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }
            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_charges
            }

            switch (method) {
                // api calls for COD
                case 'cod': {
                    const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
                    console.log(response)
                    if (response.data.success) {
                        setCartItems({})
                        navigate('/orders')
                    } else {
                        toast.error(response.data.message)
                    }
                    break
                }

                case 'transfer': {
                    try {
                        const responseMidtrans = await axios.post(backendUrl + '/api/order/midtrans', orderData, { headers: { token } })
                        if (responseMidtrans.data.success) {
                            window.location.href = responseMidtrans.data.session_url
                        } else {
                            toast.error('Failed to process your payment')
                        }
                    } catch (error) {
                        console.error(error)
                        toast.error(error.response?.data?.message || 'Payment processing failed')
                    }
                    break
                }
                default:
                    break
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return (
        <div>
            <div className='bg-primary mb-16'>
                {/* Container */}
                <form onSubmit={onSubmitHandler} className='max-padd-container py-10'>
                    <div className='flex flex-col xl:flex-row gap-20 xl:gap-28'>
                        {/* Left Side */}
                        <div className='flex flex-col gap-3 text-[95%]'>
                            <Title title1={'Delivery'} title2={' Information'} />
                            <div className='flex gap-3'>
                                <input
                                    onChange={onChangeHandler}
                                    value={formData.firstName}
                                    type='text'
                                    name='firstName'
                                    placeholder='First Name'
                                    className='ring-1 ring-slate-900/15 p-1 pl-3 
                                rounded-sm bg-white outline-none w-1/2' required
                                />
                                <input
                                    onChange={onChangeHandler}
                                    value={formData.lastName}
                                    type='text'
                                    name='lastName'
                                    placeholder='Last Name'
                                    className='ring-1 ring-slate-900/15 p-1 pl-3 
                                rounded-sm bg-white outline-none w-1/2' required
                                />
                            </div>
                            <input
                                onChange={onChangeHandler}
                                value={formData.email}
                                type='text'
                                name='email'
                                placeholder='Email'
                                className='ring-1 ring-slate-900/15 p-1 pl-3 
                                rounded-sm bg-white outline-none' required
                            />
                            <input
                                onChange={onChangeHandler}
                                value={formData.phone}
                                type='text'
                                name='phone'
                                placeholder='Nomor Telepon'
                                className='ring-1 ring-slate-900/15 p-1 pl-3 
                                rounded-sm bg-white outline-none' required
                            />
                            <input
                                onChange={onChangeHandler}
                                value={formData.street}
                                type='text'
                                name='street'
                                placeholder='Jalan'
                                className='ring-1 ring-slate-900/15 p-1 pl-3 
                                rounded-sm bg-white outline-none' required
                            />
                            <div className='flex gap-3'>
                                <input
                                    onChange={onChangeHandler}
                                    value={formData.city}
                                    type='text'
                                    name='city'
                                    placeholder='Kota'
                                    className='ring-1 ring-slate-900/15 p-1 pl-3 
                                rounded-sm bg-white outline-none w-1/2' required
                                />
                                <input
                                    onChange={onChangeHandler}
                                    value={formData.state}
                                    type='text'
                                    name='state'
                                    placeholder='Provinsi'
                                    className='ring-1 ring-slate-900/15 p-1 pl-3 
                                rounded-sm bg-white outline-none w-1/2' required
                                />
                            </div>
                            <div className='flex gap-3'>
                                <input
                                    onChange={onChangeHandler}
                                    value={formData.zipcode}
                                    type='text'
                                    name='zipcode'
                                    placeholder='Kode Pos'
                                    className='ring-1 ring-slate-900/15 p-1 pl-3 
                                rounded-sm bg-white outline-none w-1/2' required
                                />
                                <input
                                    onChange={onChangeHandler}
                                    value={formData.country}
                                    type='text'
                                    name='country'
                                    placeholder='Negara'
                                    className='ring-1 ring-slate-900/15 p-1 pl-3 
                                rounded-sm bg-white outline-none w-1/2' required
                                />
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className='flex flex-1 flex-col'>
                            <CartTotal />
                            {/* Payment method */}
                            <div className='my-6'>
                                <h3 className='bold-20 mb-5'>
                                    Payment <span className='text-secondary'> Method</span>
                                </h3>
                                <div className='flex gap-3'>
                                    <div
                                        onClick={() => setMethod('transfer')}
                                        className={`${method === "transfer" ? "btn-dark" : "btn-white"} !py-1 text-xs cursor-pointer`}>
                                        Transfer
                                    </div>
                                    <div
                                        onClick={() => setMethod('cod')}
                                        className={`${method === "cod" ? "btn-dark" : "btn-white"} !py-1 text-xs cursor-pointer`}>
                                        Cash on Delivery
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button type='submit' className='btn-secondary'>Place Order</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    )
}

export default PlaceOrder
