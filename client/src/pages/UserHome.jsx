import { useState, useEffect } from "react";
import api from "../api";
import UserNavbar from "../components/UserNavbar";

function UserHome() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [rooms, setRooms] = useState([]);
  const [fromdate, setFromdate] = useState("");
  const [todate, setTodate] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  // Runs once when the page opens: fetch all rooms from the backend
  useEffect(() => {
    api
      .get("/rooms/getrooms")
      .then((res) => setRooms(res.data))
      .catch(() => setMessage({ text: "Could not load rooms", type: "danger" }));
  }, []);

  const bookRoom = async (roomId) => {
    if (!fromdate || !todate) {
      setMessage({ text: "Pick both dates first", type: "warning" });
      return;
    }
    try {
      const res = await api.post("/bookings/book", {
        roomId,
        guestName: user.name,
        fromdate,
        todate,
      });
      setMessage({
        text: `Booked! Total: Rs ${res.data.booking.totalAmount}`,
        type: "success",
      });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Something went wrong",
        type: "danger",
      });
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <UserNavbar />
      <div className="container mt-4">
        <h3>Available Rooms</h3>

        <div className="row g-2 my-3" style={{ maxWidth: 500 }}>
          <div className="col">
            <label className="form-label">Check-in</label>
            <input type="date" min={today} className="form-control" value={fromdate} onChange={(e) => setFromdate(e.target.value)} />
          </div>
          <div className="col">
            <label className="form-label">Check-out</label>
            <input type="date" min={fromdate || today} className="form-control" value={todate} onChange={(e) => setTodate(e.target.value)} />
          </div>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <div className="row">
          {rooms.map((room) => (
            <div className="col-md-4 mb-4" key={room._id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title text-capitalize">
                    {room.type} room #{room.roomNumber}
                  </h5>
                  <p className="card-text">{room.description}</p>
                  <p className="fw-bold">Rs {room.rent} / night</p>
                  <button className="btn btn-primary" onClick={() => bookRoom(room._id)}>
                    Book now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default UserHome;