import AdminSidebar from "./components/AdminSidebar";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center text-2xl text-gray-400">
          This is the main content area
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
