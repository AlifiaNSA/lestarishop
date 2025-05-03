import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }
/*       const response = await axios.post(backendUrl + "/api/order/userorders", {}, { headers: { token } })
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order)=> {
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
        setOrderData(allOrdersItem.reverse())
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  } */
  {orders.map((order) => (
    <div key={order._id} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_0.5fr_1fr] gap-4 items-start p-3 text-gray-700 bg-white rounded-lg'>
      <div className='flexCenter'>
        <TfiPackage className='text-3xl text-secondary'/>
      </div>
      <div>
        <div className='flex items-start gap-1'>
          <div className='medium-14'>Items:</div>
          <div className='flex flex-col relative top-0.5'>
            {order.items.map((item, index) => {
              if(index === order.items.length - 1) {
                return <p key={index}>
                  {item.name} x {item.quantity} <span>"
                  {item.size}"</span>
                </p>
              } else {
                return <p key={index}>
                  {item.name} x {item.quantity} <span>"
                  {item.size}"</span> ,
                </p>
              }
            })}
          </div>
        </div>
        <p className='medium-14'><span className='text-tertiary'>Name: </span>
        {order.address.firstName + " " + order.address.lastName}</p>
        <p className='medium-14'><span className='text-tertiary'>Address: </span>
          <span>{order.address.street + ", " }</span>
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
      <p className='text-sm font-semibold'>Rp{order.amount}.000</p>
      <select onChange={(e) => statusHandler(e, order._id)} value={order.status} className='text-xs font-semibold p-1 ring-1 ring-slate-900/5 rounded max-w-36 bg-primary'>
        <option value="Pesanan Diterima">Pesanan Diterima</option>
        <option value="Pengemasan">Pengemasan</option>
        <option value="Dikirim">Dikirim</option>
        <option value="Dalam Pengiriman">Dalam Pengiriman</option>
        <option value="Terkirim">Terkirim</option>
      </select>
    </div>
  ))}
  //Temporary data
  useEffect(() => {
    loadOrderData()
  }, [token]);

  return (
    <div>
      <div className="bg-primary mb-16">
        {/* Container */}
        <div className="max-padd-container py-10">
          <Title title1={"Order"} title2={" List"} />
          {/* Container */}
          {orderData.map((item, i) => (
            <div key={i} className="bg-white p-2 mt-3 rounded-lg">
              <div className="text-gray-700 flex flex-col gap-4">
                <div className="flex gap-x-3 w-full">
                  {/* Image */}
                  <div className="flex gap-6">
                    <img
                      src={item.image[0]}
                      alt="orderImg"
                      className="sm:w-[77px] rounded-lg"
                    />
                  </div>
                  {/* order info */}
                  <div className="block w-full">
                    <h5 className="h5 capitalize line-clamp-1">
                      {item.name}
                    </h5>
                    <div className="flexBetween flex-wrap">
                      <div>
                        <div className="flex items-center gap-x-2 sm:gap-x-3">
                          <div className="flexCenter gap-x-2">
                            <h5 className="medium-14">Price:</h5>
                            <p>Rp{item.price}.000</p>
                          </div>
                          <div className="flexCenter gap-x-2">
                            <h5 className="medium-14">Quantity:</h5>
                            <p>{item.quantity}</p>
                          </div>
                          <div className="flexCenter gap-x-2">
                            <h5 className="medium-14">Size:</h5>
                            <p>{item.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <h5 className="medium-14">Date:</h5>
                          <p>{new Date(item.date).toDateString()}</p>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <h5 className="medium-14">Payment</h5>
                          <p>{item.paymentMethod}</p>
                        </div>
                      </div>
                      {/* Status & Button */}
                      <div className="flex gap-3">
                        <div className="flex items-center gap-2">
                          <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                          <p>{item.status}</p>
                        </div>
                        <button onClick={loadOrderData} className="btn-secondary !p-1.5 !py-1 !text-xs">
                          Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

     <Footer /> 
    </div>
  );
};

export default Orders;
