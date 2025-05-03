import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [transaction, setTransaction] = useState(null);

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
        const orders = response.data.orders;
        // Combine all items from all orders into one transaction
        let allItems = [];
        let latestDate = null;
        let paymentMethod = null;
        let status = null;

        orders.forEach((order) => {
          allItems = allItems.concat(order.items);
          // Find latest date
          const orderDate = new Date(order.date);
          if (!latestDate || orderDate > latestDate) {
            latestDate = orderDate;
            paymentMethod = order.paymentMethod;
            status = order.status;
          }
        });

        setTransaction({
          items: allItems,
          date: latestDate,
          paymentMethod,
          status,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  if (!transaction) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="bg-primary mb-16">
        <div className="max-padd-container py-10">
          <Title title1={"Order"} title2={" List"} />
          <div className="bg-white p-4 mt-3 rounded-lg">
            <div className="text-gray-700 flex flex-col gap-4">
              <div className="flexBetween flex-wrap mb-4">
                <div>
                  <div className="flex items-center gap-x-2">
                    <h5 className="medium-14">Date:</h5>
                    <p>{transaction.date ? transaction.date.toDateString() : ""}</p>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <h5 className="medium-14">Payment:</h5>
                    <p>{transaction.paymentMethod}</p>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <h5 className="medium-14">Status:</h5>
                    <p>{transaction.status}</p>
                  </div>
                </div>
                <button
                  onClick={loadOrderData}
                  className="btn-secondary !p-1.5 !py-1 !text-xs"
                >
                  Track Order
                </button>
              </div>
              {transaction.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-x-3 w-full border-t pt-3 first:border-t-0 first:pt-0"
                >
                  <div className="flex gap-6">
                    <img
                      src={item.image[0]}
                      alt="orderImg"
                      className="sm:w-[77px] rounded-lg"
                    />
                  </div>
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Orders;
