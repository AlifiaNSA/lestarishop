import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { FaRegWindowClose } from 'react-icons/fa'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import CartTotal from '../components/CartTotal'
import Footer from '../components/Footer'

const Cart = () => {

  const { products, currency, cartItems, getCartCount, navigate, updateQuantity } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])
  const [quantitites, setQuantities] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      const tempData = []
      const initialQuantities = {}
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            })
            initialQuantities[`${items}-${item}`] = cartItems[items][item]
          }
        }
      }
      setCartData(tempData)
      setQuantities(initialQuantities)
    }
  }, [cartItems, products])

  const increment = (id, size) => {
    const key = `${id}-${size}`
    const newValue = quantitites[key] + 1
    setQuantities(prev => ({ ...prev, [key]: newValue }))
    updateQuantity(id, size, newValue)
  }

  const decrement = (id, size) => {
    const key = `${id}-${size}`
    if (quantitites[key] > 1) {
      const newValue = quantitites[key] - 1
      setQuantities(prev => ({ ...prev, [key]: newValue }))
      updateQuantity(id, size, newValue)
    }
  }

  return (
    <div>
      <div className='bg-primary mb-16'>
        <div className='max-padd-container py-10'>
          {/* Title */}
          <div className='flexStart gap-x-4'>
            <Title title1={'Cart'} title2={' List'} titleStyles={'h3'} />
            <h5 className='medium-15 text-gray-30 relative bottom-1.5'>({getCartCount()} Items)</h5>
          </div>
          {/* Container */}
          <div className='mt-6'>
            {cartData.map((item, i) => {
              const productData = products.find(product => product._id === item._id)
              const key = `${item._id}-${item.size}`

              return (
                <div key={i} className='rounde-lg bg-white p-2 mb-3'>
                  <div className='flex items-center gap-x-3'>
                    <div className='flex items-start gap-6'>
                      <img
                        src={productData.image[0]}
                        alt="productImg"
                        className='w-16 sm:w-18 rounded'
                      />
                    </div>
                    <div className='flex flex-col w-full'>
                      <div className='flexBetween'>
                        <h5 className='h5 !my-0 line-clamp-1'>
                          {productData.name}
                        </h5>
                        <FaRegWindowClose onClick={() => updateQuantity(item._id, item.size, 0)}
                          className='cursor-pointer text-secondary'
                        />
                      </div>
                      <p>{item.size}</p>
                      <div className='flexBetween'>
                        <div className='flex items-center ring-1 ring-slate-900/5 
                        rounded-full overvlow-hidden bg-primary'>
                          <button onClick={() => decrement(item._id, item.size)} className='p-1.5 bg-white text-secondary rounded-full shadow-md'>
                            <FaMinus className='text-xs' />
                          </button>
                          <p className='px-2'>{quantitites[key]}</p>
                          <button onClick={() => increment(item._id, item.size)} className='p-1.5 bg-white text-secondary rounded-full shadow-md'>
                            <FaPlus className='text-xs' />
                          </button>
                        </div>
                        <h4 className='h4'>
                          Rp{productData.price}.000
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className='flex my-20'>
            <div className='w-full sm:w-[450px]'>
              <CartTotal />
              <button onClick={() => navigate('/place-order')} className='btn-secondary mt-7'>
                Proceed to checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Cart
