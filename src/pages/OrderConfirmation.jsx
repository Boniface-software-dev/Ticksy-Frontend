import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API } from "../config";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    let interval;

    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${API}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);

        if (response.data.status === "paid" && interval) {
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId, token]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Order not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            {order.status === "paid" ? (
              <div className="text-green-600">
                <div className="text-6xl mb-4">✅</div>
                <h1 className="text-3xl font-bold">Payment Successful!</h1>
              </div>
            ) : (
              <div className="text-yellow-600">
                <div className="text-6xl mb-4">⏳</div>
                <h1 className="text-3xl font-bold">Payment Pending</h1>
              </div>
            )}
          </div>

          <div className="text-left bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-2">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Total Amount:</strong> KES {order.total_amount.toLocaleString()}</p>
              <p><strong>Status:</strong> <span className="capitalize">{order.status}</span></p>
              {order.mpesa_receipt && (
                <p><strong>Mpesa Receipt:</strong> {order.mpesa_receipt}</p>
              )}
            </div>
          </div>

          {order.status === "pending" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">
                Please complete the payment on your M-Pesa app. This page will
                update automatically once payment is confirmed.
              </p>
            </div>
          )}

          {order.status === "paid" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">
                Your ticket has been confirmed! You will receive it via email
                shortly.
              </p>
            </div>
          )}

          <button
            onClick={() => window.location.href = "/"}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
