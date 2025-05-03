import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { TfiPackage } from "react-icons/tfi";

const Orders = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

  // Utility function to format number as Rupiah currency string
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const fetchUserOrders = async () => {
    if (!token) {
      return null;
    }
    try {
      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        const ordersData = response.data.orders.reverse();
        console.log("Fetched ordersData:", ordersData);

        // Aggregate orders into one combined order
        if (ordersData.length > 0) {
          // Merge items by name and size, summing quantities
          const mergedItemsMap = new Map();
          ordersData.forEach(order => {
            order.items.forEach(item => {
              const key = item.name + '|' + item.size;
              if (mergedItemsMap.has(key)) {
                mergedItemsMap.get(key).quantity += item.quantity;
              } else {
                mergedItemsMap.set(key, { ...item });
              }
            });
          });
          const mergedItems = Array.from(mergedItemsMap.values());

          // Sum total amount
          const totalAmount = ordersData.reduce((sum, order) => sum + order.amount, 0);

          // Use first order's address, paymentMethod, payment status
          const firstOrder = ordersData[0];

          // Use latest date among orders
          const latestDate = new Date(Math.max(...ordersData.map(o => new Date(o.date).getTime()))).toISOString();

          // Use latest status (assuming last order's status)
          const latestStatus = ordersData[ordersData.length - 1].status;

          const combinedOrder = {
            _id: 'combined_order',
            items: mergedItems,
            amount: totalAmount,
            address: firstOrder.address,
            paymentMethod: firstOrder.paymentMethod,
            payment: firstOrder.payment,
            date: latestDate,
            status: latestStatus,
          };

          console.log("Combined order:", combinedOrder);
          setOrders([combinedOrder]);
        } else {
          setOrders([]);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const statusHandler = async () => {
    toast.info("Status update not available on frontend.");
  };

  useEffect(() => {
    fetchUserOrders();
  }, [token]);

  return (
    <div className="px-2 sm:px-8 mt-4 sm:mt-14">
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_0.5fr_1fr] gap-4 items-start p-3 text-gray-700 bg-white rounded-lg"
          >
            <div className="flexCenter">
              <TfiPackage className="text-3xl text-secondary" />
            </div>
            <div>
              <div className="flex items-start gap-1">
                <div className="medium-14">Items:</div>
                <div className="flex flex-col relative top-0.5">
                  {order.items.map((item, index) => (
                    <p key={index}>
                      {item.name} x {item.quantity} <span>"{item.size}"</span>
                    </p>
                  ))}
                </div>
              </div>
              {order.address && (
                <>
                  <p className="medium-14">
                    <span className="text-tertiary">Name: </span>
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="medium-14">
                    <span className="text-tertiary">Address: </span>
                    {order.address.street}, {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
                  </p>
                  <p>{order.address.phone}</p>
                </>
              )}
            </div>
            <div>
              <p className="text-sm">Total Items: {order.items.length}</p>
              <p className="mt-3">Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? "Done" : "Pending"}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm font-semibold">{formatRupiah(order.amount)}</p>
            <select
              onChange={() => statusHandler()}
              value={order.status}
              className="text-xs font-semibold p-1 ring-1 ring-slate-900/5 rounded max-w-36 bg-primary"
              disabled
            >
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
  );
};

export default Orders;
