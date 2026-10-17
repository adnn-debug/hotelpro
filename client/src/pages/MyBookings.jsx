import { useState, useEffect } from "react";
import api from "../api";
import UserNavbar from "../components/UserNavbar";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  // Fetch the logged-in user's bookings
  const loadBookings = () => {
    api
      .get("/bookings/mybookings")
      .then((res) => setBookings(res.data))
      .catch(() => setError("Could not load bookings"));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const cancel = async (bookingId) => {
    try {
      await api.post("/bookings/cancelbooking", { bookingId });
      loadBookings(); // refresh the list so the status updates
    } catch (err) {
      setError(err.response?.data?.message || "Could not cancel");
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="container mt-4">
        <h3>My Bookings</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        {bookings.length === 0 ? (
          <p className="text-muted">No bookings yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Room</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b._id}</td>
                    <td className="text-capitalize">{b.room?.type} #{b.room?.roomNumber}</td>
                    <td>{new Date(b.fromdate).toLocaleDateString()}</td>
                    <td>{new Date(b.todate).toLocaleDateString()}</td>
                    <td>Rs {b.totalAmount}</td>
                    <td>
                      <span className={`badge ${b.status === "booked" ? "bg-success" : "bg-secondary"}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.status === "booked" && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => cancel(b._id)}>
                          Cancel
                        </button>
                      )}
                    </td>
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

export default MyBookings;