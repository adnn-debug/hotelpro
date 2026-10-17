import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UserHome from "./pages/UserHome";
import MyBookings from "./pages/MyBookings";
import AdminHome from "./pages/AdminHome";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1 className="text-center mt-5">HotelPro Home</h1>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Customer pages: only a logged-in customer can open these */}
      <Route
        path="/home"
        element={
          <ProtectedRoute role="customer">
            <UserHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mybookings"
        element={
          <ProtectedRoute role="customer">
            <MyBookings />
          </ProtectedRoute>
        }
      />

      {/* Admin page: only a logged-in admin can open this */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminHome />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;