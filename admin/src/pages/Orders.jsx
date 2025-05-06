import React from 'react'
import { useState } from 'react'
import { backend_url } from '../App'
import axios from 'axios'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { TfiPackage } from 'react-icons/tfi'
import * as XLSX from 'xlsx'

const printOrders = (orders, formatRupiah) => {
  if (orders.length === 0) {
    alert('No orders to export')
    return
  }
  // Prepare data for Excel export
  const data = orders.map(order => {
    const items = order.items.map(item => `${item.name} x${item.quantity} (${item.size})`).join(', ')
    const recipient = order.address.firstName + ' ' + order.address.lastName
    const address = `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}`
    const phone = order.address.phone
    const totalItems = order.items.length
    const paymentMethod = order.paymentMethod
    const paymentStatus = order.payment ? 'Done' : 'Pending'
    const date = new Date(order.date).toLocaleDateString()
    const user = order.userAccount && order.userAccount.username ? order.userAccount.username : (order.userAccount && order.userAccount.name ? order.userAccount.name : 'Unknown')
    const status = order.status
    const amount = formatRupiah(order.amount)
    return {
      'Order ID': order._id,
      'Items': items,
      'Recipient': recipient,
      'Address': address,
      'Phone': phone,
      'Total Items': totalItems,
      'Payment Method': paymentMethod,
      'Date': date,
      'User': user,
      'Amount (IDR)': amount
    }
  })

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')
  XLSX.writeFile(workbook, 'orders_report.xlsx')
}

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])
  const [totalSales, setTotalSales] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)

  // Utility function to format number as Rupiah currency string with ".000" decimal
  const formatRupiah = (number) => {
    // Format the number without decimals, then append ".000" to represent thousands
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number) + '.000'
  }

  const fetchAllOrders = async () => {
    if (!token) {
      return null
    }
    try {
      const response = await axios.post(backend_url + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        const ordersData = response.data.orders.reverse()
        setOrders(ordersData)
        // Calculate total sales and total orders
        const sales = ordersData.reduce((acc, order) => acc + order.amount, 0)
        setTotalSales(sales)
        setTotalOrders(ordersData.length)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  const statusHandler = async (e, orderId) => {
    try {
      const response = await axios.post(backend_url + '/api/order/status', { orderId, status: e.target.value }, { headers: { token } })
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div className='px-2 sm:px-8 mt-4 sm:mt-14'>
      <div className='mb-6 p-4 bg-white rounded-lg shadow'>
        <h2 className='text-xl font-semibold mb-2'>Laporan Penjualan</h2>
        <p className='text-lg'>Pemasukan: {formatRupiah(totalSales)}</p>
      <p className='text-lg'>Total Orders: {totalOrders}</p>
      <button
        onClick={() => printOrders(orders, formatRupiah)}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Cetak XLSX
      </button>
      </div>
      <div className='flex flex-col gap-4'>
        {orders.map((order) => (
          <div key={order._id} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_0.5fr_1fr_1fr] gap-4 items-start p-3 text-gray-700 bg-white rounded-lg'>
            <div className='flexCenter'>
              <TfiPackage className='text-3xl text-secondary' />
            </div>
            <div>
              <div className='flex items-start gap-1'>
                <div className='medium-14'>Items:</div>
                <div className='flex flex-col relative top-0.5'>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return <p key={index}>
                        {item.name} x {item.quantity} <span>"
                          {item.size}"</span>
                      </p>
                    } else {
                      return <p key={index}>
                        {item.name} x {item.quantity} <span>"
                          {item.size}"</span>
                      </p>
                    }
                  })}
                </div>
              </div>
              <p className='medium-14'><span className='text-tertiary'>Nama Penerima: </span>
                {order.address.firstName + " " + order.address.lastName}</p>
              <p className='medium-14'><span className='text-tertiary'>Address: </span>
                <span>{order.address.street + ", "}</span>
                <span>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</span>
              </p>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className='text-sm'>Total: {order.items.length}</p>
              <p className='mt-3'>Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? "Done" : "Pending"}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className='text-sm font-semibold'>{formatRupiah(order.amount)}</p>
            <p className='text-sm font-semibold'><span className='text-tertiary'>User: </span>{order.userAccount && order.userAccount.username ? order.userAccount.username : (order.userAccount && order.userAccount.name ? order.userAccount.name : 'Unknown')}</p>
            <select onChange={(e) => statusHandler(e, order._id)} value={order.status} className='text-xs font-semibold p-1 ring-1 ring-slate-900/5 rounded max-w-36 bg-primary'>
              <option value="Pesanan Diterima">Pesanan Diterima</option>
              <option value="Pengemasan">Pengemasan</option>
              <option value="Dikirim">Dikirim</option>
              <option value="Dalam Pengiriman">Dalam Pengiriman</option>
              <option value="Terkirim">Terkirim</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders

