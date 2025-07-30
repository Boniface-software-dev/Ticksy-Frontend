import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/AdminPanel";
import API from "../../utils/axiosInstance";
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
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin" || user.id.toString() !== id) {
      navigate("/unauthorized");
    }
  }, [user, id, navigate]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.get("/admin/dashboard"),
      API.get("/admin/analytics/ticket-sales-trends"),
      API.get("/admin/logs"),
    ])
      .then(([dashboardRes, trendRes, logsRes]) => {
        const summaryData = dashboardRes.data.summary || {};
        const trendData = trendRes.data || [];
        const totalSales = trendData.reduce((acc, cur) => acc + cur.sales, 0);

        setSummary({
          ...summaryData,
          total_tickets_sold: totalSales,
        });

        setTicketSalesData(trendData);
        setLogs(logsRes.data || []);
      })
      .catch((err) => {
        console.error("Error loading dashboard data:", err);
        setError("Could not load summary");
      })
      .finally(() => setLoading(false));
  }, []);

  const downloadCSV = () => {
    const headers = [
      "id,user_id,user_name,action,target_type,target_id,status,ip_address,timestamp,extra_data",
    ];
    const rows = logs.map((log) =>
      [
        log.id,
        log.user_id,
        `"${log.user_name}"`,
        `"${log.action}"`,
        log.target_type,
        log.target_id,
        log.status,
        log.ip_address,
        log.timestamp,
        log.extra_data ? JSON.stringify(log.extra_data) : "",
      ].join(",")
    );
    const blob = new Blob([headers.concat(rows).join("\n")], {
      type: "text/csv",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "admin_audit_logs.csv";
    link.click();
  };

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

        {/* Graph */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="font-semibold text-[#1a1240] mb-2">
            Ticket Sales Over Time
          </div>
          <ResponsiveContainer width="100%" height={200}>
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

        {/* Logs Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1a1240]">
              Recent Audit Logs
            </h2>
            <button
              onClick={downloadCSV}
              className="bg-[#9747ff] hover:bg-purple-800 text-white px-4 py-2 rounded text-sm font-medium"
            >
              Download Logs (.csv)
            </button>
          </div>
          <div className="overflow-y-auto max-h-[320px] border-t border-gray-200 pt-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex justify-between items-start py-2 border-b border-gray-100"
              >
                <div>
                  <p className="text-sm font-medium text-[#1a1240]">
                    {log.user_name} —{" "}
                    <span className="font-normal">{log.action}</span>
                  </p>
                  <p className="text-xs text-gray-500">{log.timestamp}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    log.status === "Success"
                      ? "bg-green-100 text-green-700"
                      : log.status === "Failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
