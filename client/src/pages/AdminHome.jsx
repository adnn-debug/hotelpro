import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function AdminHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [tab, setTab] = useState("bookings"); // which tab is open
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [form, setForm] = useState({
    roomNumber: "",
    description: "",
    type: "single",
    rent: "",
    count: 1,
  });

  // Fetch bookings, rooms and users from the backend
  const loadAll = () => {
    api.get("/bookings/all").then((r) => setBookings(r.data)).catch(() => {});
    api.get("/rooms/getrooms").then((r) => setRooms(r.data)).catch(() => {});
    api.get("/auth/users").then((r) => setUsers(r.data)).catch(() => {});
  };

  useEffect(() => {
    loadAll();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addRoom = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    try {
      await api.post("/rooms/addroom", {
        roomNumber: form.roomNumber,
        description: form.description,
        type: form.type,
        rent: Number(form.rent),
        count: Number(form.count),
        photos: [],
      });
      setMessage({ text: "Room added successfully", type: "success" });
      setForm({ roomNumber: "", description: "", type: "single", rent: "", count: 1 });
      loadAll(); // refresh so the new room shows in All Rooms
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Something went wrong",
        type: "danger",
      });
    }
  };

  const tabs = [
    { key: "bookings", label: "All Bookings" },
    { key: "rooms", label: "All Rooms" },
    { key: "add", label: "Add Room" },
    { key: "users", label: "All Users" },
  ];

  return (
    <>
      <nav className="navbar navbar-dark bg-dark px-3">
        <span className="navbar-brand">HotelPro Admin</span>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white-50">Hi, {user.name}</span>
          <button className="btn btn-sm btn-outline-light" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container mt-4">
        <ul className="nav nav-tabs mb-4">
          {tabs.map((t) => (
            <li className="nav-item" key={t.key}>
              <button
                className={`nav-link ${tab === t.key ? "active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>

        {tab === "bookings" && (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Contact</th>
                  <th>Room</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.guestName}</td>
                    <td>
                      {b.user?.email}
                      <br />
                      {b.user?.phone}
                    </td>
                    <td className="text-capitalize">
                      {b.room?.type} #{b.room?.roomNumber}
                    </td>
                    <td>{new Date(b.fromdate).toLocaleDateString()}</td>
                    <td>{new Date(b.todate).toLocaleDateString()}</td>
                    <td>Rs {b.totalAmount}</td>
                    <td>
                      <span className={`badge ${b.status === "booked" ? "bg-success" : "bg-secondary"}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && <p className="text-muted">No bookings yet.</p>}
          </div>
        )}

        {tab === "rooms" && (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Rent</th>
                  <th>Units</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r._id}>
                    <td>{r.roomNumber}</td>
                    <td className="text-capitalize">{r.type}</td>
                    <td>{r.description}</td>
                    <td>Rs {r.rent}</td>
                    <td>{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "add" && (
          <div style={{ maxWidth: 480 }}>
            {message.text && (
              <div className={`alert alert-${message.type}`}>{message.text}</div>
            )}
            <form onSubmit={addRoom}>
              <input className="form-control mb-3" name="roomNumber" placeholder="Room number" value={form.roomNumber} onChange={handleChange} required />
              <input className="form-control mb-3" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
              <select className="form-select mb-3" name="type" value={form.type} onChange={handleChange}>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
              </select>
              <input className="form-control mb-3" name="rent" type="number" min="1" placeholder="Rent per night" value={form.rent} onChange={handleChange} required />
              <input className="form-control mb-3" name="count" type="number" min="1" placeholder="Number of rooms of this kind" value={form.count} onChange={handleChange} required />
              <button className="btn btn-primary" type="submit">Add room</button>
            </form>
          </div>
        )}

        {tab === "users" && (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td className="text-capitalize">{u.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminHome;