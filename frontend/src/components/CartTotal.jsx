import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = () => {

    const {currency, getCartAmount, delivery_charges} = useContext(ShopContext)

  return (
    <section>
        <Title title1={'Cart'} title2={' Total'} titleStyles={'h3'} />
        <div className='flexBetween pt-3'>
            <h5 className='h5'>SubTotal:</h5>
            <p className='h5'>Rp{getCartAmount()}.000</p>
        </div>
        <hr className='mx-auto h-[1px] w-full bg-gray-900/10 my-1'/>
        <div className='flexBetween pt-3'>
            <h5 className='h5'>Ongkos kirim:</h5>
            <p className='h5'>{getCartAmount() === 0 ? 'Rp0.000' : `Rp${delivery_charges}.000`}</p>
        </div>
        <div className='flexBetween pt-3'>
            <h5 className='h5'>Total:</h5>
            <p className='h5'>{getCartAmount() === 0 ? 'Rp0.000' : `Rp${getCartAmount() + delivery_charges}.000`}</p>
        </div>
        <hr className='mx-auto h-[1px] w-full bg-gray-900/10 my-1'/>
    </section>
  )
}

export default CartTotal
