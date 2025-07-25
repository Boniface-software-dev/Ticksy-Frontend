import AdminSidebar from "../../components/AdminSidebar";
import { useState, useEffect } from "react";
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
  // Demo data — replace with real API data!
  const [dashboard, setDashboard] = useState({
    total_users: 210000,
    ticket_sales: 12350,
    approved_events: 78,
    pending_approvals: 15,
    ticket_sales_over_time: [
      { month: "Jan", sales: 1200 },
      { month: "Feb", sales: 2200 },
      { month: "Mar", sales: 1800 },
      { month: "Apr", sales: 2600 },
      { month: "May", sales: 2400 },
      { month: "Jun", sales: 4100 },
    ],
    recent_activity: [
      { message: "Anthony Brown registered", status: "Success" },
      { message: "Event 'Charity Gala' created", status: "Success" },
      { message: "Event 'Music Festival' Created", status: "Failed" },
    ],
    pending_events: [
      {
        title: "Midnight Vibes",
        organizer: "L. Chebet",
        date: "24th June, 2025",
        status: "Pending",
      },
      {
        title: "Just Incase",
        organizer: "G. Zawadi",
        date: "28th June, 2025",
        status: "Pending",
      },
      {
        title: "Midnight Vibes",
        organizer: "C. Mecheo",
        date: "28th June, 2025",
        status: "Pending",
      },
      {
        title: "Drillwood Streams",
        organizer: "J. Malinda",
        date: "30th June, 2025",
        status: "Pending",
      },
    ],
    users: [
      { id: 1, name: "B. Mugura", role: "Organizer", status: "Reactive" },
      { id: 2, name: "J. Aquila", role: "Admin", status: "Pending" },
      { id: 3, name: "E. Kipyego", role: "Attendee", status: "Ban" },
    ],
  });

  // TODO: Replace with real API call
  // useEffect(() => { fetch dashboard data and setDashboard(...) }, []);

  return (
    <div className="flex min-h-screen bg-[#faf8ff]">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-5 text-[#1a1240]">Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-7">
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-start">
            <div className="text-gray-500 text-sm mb-1">Total Users</div>
            <div className="text-3xl font-extrabold tracking-tight text-[#1a1240]">
              {dashboard.total_users.toLocaleString()}
              <span className="text-lg font-normal text-[#1a1240]">K</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-start">
            <div className="text-gray-500 text-sm mb-1">Total Ticket Sales</div>
            <div className="text-3xl font-extrabold tracking-tight text-[#1a1240]">
              {dashboard.ticket_sales.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-start">
            <div className="text-gray-500 text-sm mb-1">Approved Event</div>
            <div className="text-3xl font-extrabold tracking-tight text-[#1a1240]">
              {dashboard.approved_events}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-start">
            <div className="text-gray-500 text-sm mb-1">
              Pending Event Approvals
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-[#1a1240]">
              {dashboard.pending_approvals}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-7">
          {/* Ticket Sales Graph */}
          <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[320px]">
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold text-[#1a1240]">
                Ticket Sales Over Time
              </div>
              <div className="flex gap-2 text-xs text-gray-400 font-medium">
                <span className="cursor-pointer hover:text-[#9747ff]">
                  Analytics
                </span>
                <span className="cursor-pointer hover:text-[#9747ff]">
                  Reports
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={dashboard.ticket_sales_over_time}>
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

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[250px]">
            <div className="font-semibold text-[#1a1240] mb-3">
              Recent Activity
            </div>
            <ul className="space-y-3">
              {dashboard.recent_activity.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span className="text-sm text-[#1a1240]">{item.message}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold
                    ${
                      item.status === "Success"
                        ? "bg-green-100 text-green-600"
                        : item.status === "Failed"
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pending Events Table */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="font-semibold text-[#1a1240] mb-3">
              Pending Events
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f8f4ff]">
                  <th className="text-left py-2 px-2">Title</th>
                  <th className="text-left py-2 px-2">Organizer</th>
                  <th className="text-left py-2 px-2">Date Created</th>
                  <th className="text-left py-2 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.pending_events.map((event, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-2">{event.title}</td>
                    <td className="py-2 px-2">{event.organizer}</td>
                    <td className="py-2 px-2">{event.date}</td>
                    <td className="py-2 px-2">
                      <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs font-semibold">
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="font-semibold text-[#1a1240] mb-3">Users</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f8f4ff]">
                  <th className="text-left py-2 px-2">ID</th>
                  <th className="text-left py-2 px-2">Name</th>
                  <th className="text-left py-2 px-2">Role</th>
                  <th className="text-left py-2 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.users.map((u, idx) => (
                  <tr key={u.id}>
                    <td className="py-2 px-2">{u.id}</td>
                    <td className="py-2 px-2">{u.name}</td>
                    <td className="py-2 px-2">{u.role}</td>
                    <td className="py-2 px-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold
                        ${
                          u.status === "Ban"
                            ? "bg-red-100 text-red-600"
                            : u.status === "Reactive"
                            ? "bg-purple-100 text-purple-600"
                            : u.status === "Pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
