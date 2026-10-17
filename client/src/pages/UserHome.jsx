import { useState, useEffect } from "react";
import api from "../api";
import UserNavbar from "../components/UserNavbar";
import PaymentModal from "../components/PaymentModal";

const roomImages = {
  single:
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80",
  double:
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
  suite:
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
};

function UserHome() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [rooms, setRooms] = useState([]);
  const [fromdate, setFromdate] = useState("");
  const [todate, setTodate] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    api
      .get("/rooms/getrooms")
      .then((res) => setRooms(res.data))
      .catch(() => setMessage({ text: "Could not load rooms", type: "danger" }));
  }, []);

  const openPayment = (room) => {
    if (!fromdate || !todate) {
      setMessage({ text: "Pick both dates first", type: "warning" });
      return;
    }
    if (todate <= fromdate) {
      setMessage({ text: "Check-out must be after check-in", type: "danger" });
      return;
    }
    setMessage({ text: "", type: "" });
    setSelectedRoom(room);
  };

  const bookRoom = async () => {
    if (!selectedRoom) return;

    try {
      const res = await api.post("/bookings/book", {
        roomId: selectedRoom._id,
        guestName: user?.name,
        fromdate,
        todate,
      });
      setMessage({
        text: `Payment successful. Booked! Total: Rs ${res.data.booking.totalAmount}`,
        type: "success",
      });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Something went wrong",
        type: "danger",
      });
    }
    setSelectedRoom(null);
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
            <input
              type="date"
              min={today}
              className="form-control"
              value={fromdate}
              onChange={(e) => setFromdate(e.target.value)}
            />
          </div>
          <div className="col">
            <label className="form-label">Check-out</label>
            <input
              type="date"
              min={fromdate || today}
              className="form-control"
              value={todate}
              onChange={(e) => setTodate(e.target.value)}
            />
          </div>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <div className="row">
          {rooms.map((room) => (
            <div className="col-md-4 mb-4" key={room._id}>
              <div className="card h-100">
                <img
                  src={room.photos?.[0] || roomImages[room.type] || roomImages.double}
                  className="card-img-top"
                  alt={`${room.type} room ${room.roomNumber}`}
                  style={{ height: 220, objectFit: "cover" }}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = roomImages.double;
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title text-capitalize">
                    {room.type} room #{room.roomNumber}
                  </h5>
                  <p className="card-text">{room.description}</p>
                  <p className="fw-bold">Rs {room.rent} / night</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => openPayment(room)}
                  >
                    Book now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRoom && (
        <PaymentModal
          room={selectedRoom}
          fromdate={fromdate}
          todate={todate}
          onClose={() => setSelectedRoom(null)}
          onPaid={bookRoom}
        />
      )}
    </>
  );
}

export default UserHome;
