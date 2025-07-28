import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import API from "../../utils/axiosInstance";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

export default function AdminAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.currentUser);

  const [summary, setSummary] = useState(null);
  const [salesTrends, setSalesTrends] = useState([]);
  const [revenueByType, setRevenueByType] = useState([]);
  const [topEventTypes, setTopEventTypes] = useState([]);
  const [topCategories, setTopCategories] = useState([]);

  const [loading, setLoading] = useState({
    summary: true,
    trends: true,
    revenue: true,
    types: true,
    categories: true,
  });

  // ✅ Redirect if user is invalid or doesn't match URL
  useEffect(() => {
    if (!user || user.role !== "admin" || user.id.toString() !== id) {
      navigate("/unauthorized");
    }
  }, [user, id, navigate]);

  useEffect(() => {
    API.get("/admin/analytics/summary")
      .then((res) => setSummary(res.data))
      .catch(() => setSummary(null))
      .finally(() => setLoading((prev) => ({ ...prev, summary: false })));

    API.get("/admin/analytics/ticket-sales-trends")
      .then((res) => setSalesTrends(res.data || []))
      .catch(() => setSalesTrends([]))
      .finally(() => setLoading((prev) => ({ ...prev, trends: false })));

    API.get("/admin/analytics/revenue-by-ticket-type")
      .then((res) => setRevenueByType(res.data || []))
      .catch(() => setRevenueByType([]))
      .finally(() => setLoading((prev) => ({ ...prev, revenue: false })));

    API.get("/admin/analytics/top-event-types")
      .then((res) => setTopEventTypes(res.data || []))
      .catch(() => setTopEventTypes([]))
      .finally(() => setLoading((prev) => ({ ...prev, types: false })));

    API.get("/admin/analytics/top-events-by-revenue")
      .then((res) => setTopCategories(res.data || []))
      .catch(() => setTopCategories([]))
      .finally(() => setLoading((prev) => ({ ...prev, categories: false })));
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f8f4ff]">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <h1 className="text-3xl font-extrabold text-[#164e63] mb-8">
          Admin Analytics Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {loading.summary ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : summary ? (
            <>
              <SummaryCard
                title="Total Revenue"
                value={`KSh ${summary.total_revenue?.toLocaleString()}`}
                color="#06b6d4"
              />
              <SummaryCard
                title="Tickets Sold"
                value={summary.total_tickets?.toLocaleString()}
                color="#164e63"
              />
              <SummaryCard
                title="Events Created"
                value={summary.total_events}
                color="#0e7490"
              />
            </>
          ) : (
            <span className="col-span-3 text-red-500 text-center">
              Failed to load summary.
            </span>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <AnalyticsCard
            title="Ticket Sales (Monthly Trend)"
            loading={loading.trends}
          >
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={salesTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ r: 4, stroke: "#06b6d4", fill: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </AnalyticsCard>

          <AnalyticsCard
            title="Revenue Breakdown by Ticket Type"
            loading={loading.revenue}
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#0e7490" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </AnalyticsCard>

          <AnalyticsCard
            title="Top Event Types by Tickets Sold"
            loading={loading.types}
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topEventTypes.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="type" width={110} />
                <Tooltip />
                <Bar dataKey="tickets" fill="#06b6d4" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </AnalyticsCard>

          <AnalyticsCard
            title="Top Event Categories by Revenue"
            loading={loading.categories}
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topCategories.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="category" width={110} />
                <Tooltip />
                <Bar dataKey="count" fill="#164e63" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-gray-400 mt-3">
              Based on event categories with highest total revenue.
            </div>
          </AnalyticsCard>
        </div>
      </main>
    </div>
  );
}

// Reusable Analytics Card
function AnalyticsCard({ title, loading, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 transition hover:shadow-lg">
      <h2 className="text-[#164e63] text-lg font-semibold mb-4">{title}</h2>
      {loading ? (
        <div className="flex items-center justify-center h-[180px]">
          <span className="text-[#06b6d4] animate-pulse font-semibold">
            Loading…
          </span>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

// Summary Card
function SummaryCard({ title, value, color }) {
  return (
    <div className="bg-gradient-to-br from-[#f8f4ff] to-white border border-[#bae6fd] rounded-2xl shadow-sm p-6 hover:shadow-md transition">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-3xl font-bold" style={{ color: color || "#164e63" }}>
        {value || "—"}
      </p>
    </div>
  );
}

// Skeleton Loader
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow p-6 h-[84px] animate-pulse flex flex-col justify-center space-y-2">
      <div className="h-4 w-28 bg-gray-200 rounded"></div>
      <div className="h-6 w-20 bg-gray-300 rounded"></div>
    </div>
  );
}
