import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

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
        // Sort orders by date descending (latest first)
        const sortedOrders = response.data.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handlePrintOrder = async (orderId) => {
    try {
      if (!token) {
        toast.error("User not authenticated");
        return;
      }
      const response = await axios.get(`${backendUrl}/api/order/print/${orderId}`, {
        headers: { token }
      });
      if (response.data.success) {
        const order = response.data.order;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          const itemsHtml = order.items.map(item => `
            <div>
              <h4>${item.name}</h4>
              <p>Price: Rp${item.price}.000</p>
              <p>Quantity: ${item.quantity}</p>
              <p>Size: ${item.size}</p>
            </div>
            <hr/>
          `).join('');
            printWindow.document.write(`
            <html>
              <head>
              <title>Print Order</title>
              <style>
                body {
                font-family: Arial, sans-serif;
                font-size: 12px;
                margin: 0;
                padding: 0;
                }
                .receipt {
                width: 280px;
                padding: 10px;
                margin: auto;
                }
                .header, .footer {
                text-align: center;
                margin-bottom: 10px;
                }
                .header h2, .footer p {
                margin: 0;
                }
                .details, .items, .total {
                margin-bottom: 10px;
                }
                .details p, .items p, .total p {
                margin: 5px 0;
                }
                .items .item {
                border-bottom: 1px dashed #000;
                padding-bottom: 5px;
                margin-bottom: 5px;
                }
                .total {
                font-weight: bold;
                }
              </style>
              </head>
              <body>
              <div class="receipt">
                <div class="header">
                <h2>Order Receipt</h2>
                <p>Order ID: ${order._id}</p>
                <p>${new Date(order.date).toDateString()}</p>
                </div>
                <div class="details">
                <p>Payment Method: ${order.paymentMethod}</p>
                <p>Status: ${order.status || 'N/A'}</p>
                </div>
                <div class="items">
                <h3>Items:</h3>
                ${order.items.map(item => `
                  <div class="item">
                  <p>${item.name}</p>
                  <p>Price: Rp${item.price}.000</p>
                  <p>Quantity: ${item.quantity}</p>
                  <p>Size: ${item.size}</p>
                  </div>
                `).join('')}
                </div>
                <div class="total">
                <p>Total Payment: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                  order.items && order.items.length > 0
                  ? order.items.reduce((total, item) => total + item.price * item.quantity * 1000, 0)
                  : 0
                )}</p>
                </div>
                <div class="footer">
                <p>Thank you for your purchase!</p>
                </div>
              </div>
              <script>
                window.onload = function() {
                window.print();
                window.onafterprint = function() { window.close(); }
                }
              </script>
              </body>
            </html>
            `);
          printWindow.document.close();
        } else {
          toast.error("Unable to open print window");
        }
      } else {
        toast.error("Failed to fetch order details for printing");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while printing order");
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  if (!orders.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="bg-primary mb-16">
        <div className="max-padd-container py-10">
          <Title title1={"Order"} title2={" List"} />
          <div className="bg-white p-4 mt-3 rounded-lg">
            <div className="text-gray-700 flex flex-col gap-8">
              {orders.map((transaction, index) => (
                <div key={index} className="border-b pb-6">
                  <div className="flexBetween flex-wrap mb-4">
                    <div>
                      <div className="flex items-center gap-x-2">
                        <h5 className="medium-14">Total Payment:</h5>
                        <p className='text-sm font-semibold'>
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                            transaction.items && transaction.items.length > 0
                              ? transaction.items.reduce((total, item) => total + item.price * item.quantity * 1000, 0)
                              : 0
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <h5 className="medium-14">Date:</h5>
                        <p>{transaction.date ? new Date(transaction.date).toDateString() : ""}</p>
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
                    <button
                      onClick={() => handlePrintOrder(transaction._id)}
                      className="btn-secondary !p-1.5 !py-1 !text-xs ml-2"
                    >
                      Print Order
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
