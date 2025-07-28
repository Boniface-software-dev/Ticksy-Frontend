import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import API from "../../utils/axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.currentUser);

  const [summary, setSummary] = useState({});
  const [ticketSalesData, setTicketSalesData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin" || user.id.toString() !== id) {
      navigate("/unauthorized");
    }
  }, [user, id, navigate]);

  useEffect(() => {
    setLoading(true);
    API.get("/admin/dashboard")
      .then((res) => {
        setSummary(res.data.summary || {});
        setTicketSalesData(res.data.ticket_sales_over_time || []);
      })
      .catch(() => setError("Could not load summary"));

    API.get("/admin/logs")
      .then((res) => {
        setRecentActivity(
          res.data.slice(0, 8).map((log) => ({
            message:
              log.action +
              (log.extra_data ? ` (${JSON.stringify(log.extra_data)})` : ""),
            status: log.status,
            time: log.timestamp,
          }))
        );
      })
      .catch(() => setRecentActivity([]));

    API.get("/admin/pending")
      .then((res) => setPendingEvents(res.data || []))
      .catch(() => setPendingEvents([]));

    API.get("/admin/users")
      .then((res) => setUsers(res.data || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-gray-500">Loading dashboard...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#faf8ff]">
      <AdminSidebar />

      <main className="flex-1 p-8 relative">
        <h1 className="text-2xl font-bold mb-5 text-[#1a1240]">
          Admin Dashboard
        </h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-7">
          {[
            { label: "Total Users", value: summary.total_users },
            { label: "Total Tickets Sold", value: summary.total_tickets_sold },
            { label: "Approved Events", value: summary.active_events },
            {
              label: "Pending Event Approvals",
              value: summary.pending_events,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-5 flex flex-col items-start"
            >
              <div className="text-gray-500 text-sm mb-1">{stat.label}</div>
              <div className="text-3xl font-extrabold tracking-tight text-[#1a1240]">
                {stat.value?.toLocaleString() || 0}
              </div>
            </div>
          ))}
        </div>

        {/* Graph and Recent Activity */}
        <div className="flex flex-col md:flex-row gap-6 mb-7">
          <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[320px]">
            <div className="font-semibold text-[#1a1240] mb-2">
              Ticket Sales Over Time
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={ticketSalesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9747ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#e7dbfa" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#9747ff"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[250px]">
            <div className="font-semibold text-[#1a1240] mb-3">
              Recent Activity
            </div>
            <ul className="space-y-3">
              {recentActivity.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span className="text-sm text-[#1a1240]">{item.message}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      item.status === "Success"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Link
          to={`${basePath}/profile`}
          className="fixed bottom-8 left-8 bg-purple-700 text-white rounded-full shadow-lg px-5 py-2 text-lg font-semibold hover:bg-purple-800 transition duration-200 z-50"
        >
          Profile
        </Link>
      </main>
    </div>
  );
}
