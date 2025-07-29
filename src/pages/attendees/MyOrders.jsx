import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import AttendeeNavBar from "../../components/AttendeeNavBar";
import AttendeeSideBar from "../../components/AttendeeSideBar";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosInstance.get("/orders")
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch orders.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <AttendeeNavBar />
      <div className="max-w-7xl mx-auto p-4 flex gap-6">
        <AttendeeSideBar />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4 text-black">My Orders</h2>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && orders.length === 0 && (
            <p className="text-gray-500">You have no orders yet.</p>
          )}

          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow p-4 rounded text-black"
              >
                <h3 className="text-lg font-bold">Order ID: {order.order_id}</h3>
                <p>Status: <span className="capitalize">{order.status}</span></p>
                <p>Total Amount: KES {order.total_amount}</p>
                {order.mpesa_receipt && (
                  <p className="text-green-600">M-Pesa Receipt: {order.mpesa_receipt}</p>
                )}
                <p>Created At: {new Date(order.created_at).toLocaleString()}</p>

                <div className="mt-4">
                  <h4 className="font-semibold">Tickets:</h4>
                  {order.order_items.map((item) => (
                    <div key={item.id} className="ml-4">
                      <p>
                        <span className="font-medium">{item.ticket.event.title}</span> -{" "}
                        {item.ticket.type} x {item.quantity} @ KES {item.ticket.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
