import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [ordersGrouped, setOrdersGrouped] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        // Group orders by order id or date (assuming each order has an _id)
        const groupedOrders = response.data.orders.map((order) => {
          return {
            id: order._id,
            status: order.status,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            date: order.date,
            items: order.items,
          };
        });
        // Reverse to show latest orders first
        setOrdersGrouped(groupedOrders.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div>
      <div className="bg-primary mb-16">
        {/* Container */}
        <div className="max-padd-container py-10">
          <Title title1={"Order"} title2={" List"} />
          {/* Container */}
          {ordersGrouped.map((order) => (
            <div key={order.id} className="bg-white p-4 mt-3 rounded-lg">
              <div className="mb-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">Order Date: {new Date(order.date).toDateString()}</p>
                  <p>Status: {order.status}</p>
                  <p>Payment Method: {order.paymentMethod}</p>
                </div>
                <button onClick={loadOrderData} className="btn-secondary !p-1.5 !py-1 !text-xs">
                  Track Order
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-x-3 w-full">
                    {/* Image */}
                    <div className="flex gap-6">
                      <img
                        src={item.image[0]}
                        alt="orderImg"
                        className="sm:w-[77px] rounded-lg"
                      />
                    </div>
                    {/* order item info */}
                    <div className="block w-full">
                      <h5 className="h5 capitalize line-clamp-1">{item.name}</h5>
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
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
