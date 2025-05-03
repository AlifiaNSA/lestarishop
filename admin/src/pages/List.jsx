import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backend_url } from '../App'
import { toast } from 'react-toastify'
import { TbTrash } from 'react-icons/tb'

const List = ({ token }) => {

  const [list, setList] = useState([])

  const fetchList = async () => {
    try {
      const response = await axios.get(backend_url + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backend_url + '/api/product/remove', { id }, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='px-2 sm:px-8 sm:mt-14'>
      <div className='flex flex-col gap-2'>
        <div className='grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3.5fr_1.5fr_1fr_1fr_1fr] items-center py-1 px-2 bg-white bold-14 sm:bold-15 mb-1 rounded'>
          <h5>Image</h5>
          <h5>Name</h5>
          <h5>Category</h5>
          <h5>Price</h5>
          <h5>Stock</h5>
          <h5>Remove</h5>
        </div>
        {/* Product List */}
        {list.map((item) => (
          <div key={item._id} className='grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3.5fr_1.5fr_1fr_1fr_1fr] items-center gap-2 p-1 bg-white rounded-xl'>
            <img src={item.image[0]} alt="prdctImg"
              className='w-12 rounded-lg' />
            <h5 className='text-sm font-semibold'>{item.name}</h5>
            <p className='text-sm font-semibold'>{item.category}</p>
            <div className='text-sm font-semibold'>Rp{item.price}.000</div>
            <input
              type="number"
              className="w-full text-sm font-semibold border rounded px-1 py-0.5"
              value={item.stock ?? 0}
              onChange={async (e) => {
                const newStock = parseInt(e.target.value, 10);
                if (isNaN(newStock) || newStock < 0) return;
                try {
                  const response = await axios.post(backend_url + '/api/product/updateStock', { id: item._id, stock: newStock }, { headers: { token } });
                  if (response.data.success) {
                    toast.success('Stock updated successfully');
                    const updatedList = list.map(prod => prod._id === item._id ? { ...prod, stock: newStock } : prod);
                    setList(updatedList);
                  } else {
                    toast.error(response.data.message);
                  }
                } catch (error) {
                  console.error(error);
                  toast.error(error.message);
                }
              }}
            />
            <div onClick={() => removeProduct(item._id)}><TbTrash className='text-right md:text-center cursor-pointer text-lg' /></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default List
