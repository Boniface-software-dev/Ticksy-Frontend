import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import AttendeeNavBar from "../../components/AttendeeNavBar";
import AttendeeSideBar from "../../components/AttendeeSideBar";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance.get("/my-orders")
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch orders.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <AttendeeNavBar />
      <div className="max-w-7xl mx-auto p-4 flex gap-6 text-black">
        <AttendeeSideBar />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && orders.length === 0 && (
            <p className="text-gray-500">You have no orders yet.</p>
          )}
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold text-lg">Order ID: {order.order_id}</h3>
                <p>Status: <span className="font-medium">{order.status}</span></p>
                <p>Total: <span className="text-green-600">Ksh {order.total_amount}</span></p>
                <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                {order.mpesa_receipt && <p>Receipt: {order.mpesa_receipt}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
