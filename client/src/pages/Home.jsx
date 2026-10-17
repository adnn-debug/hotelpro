import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

// The hero section rotates through these slides
const slides = [
  { title: "Welcome to HotelPro", text: "Comfortable rooms at honest prices" },
  { title: "Book in minutes", text: "Pick your dates, choose a room, done" },
  { title: "Manage your stay", text: "View or cancel your bookings anytime" },
];

function Home() {
  const [index, setIndex] = useState(0);
  const [rooms, setRooms] = useState([]);

  // Move to the next slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer); // stop the timer when leaving the page
  }, []);

  // Load the first three rooms for the preview
  useEffect(() => {
    api
      .get("/rooms/getrooms")
      .then((res) => setRooms(res.data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <>
      <nav className="navbar navbar-dark bg-dark px-3">
        <span className="navbar-brand">HotelPro</span>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
          <Link className="btn btn-primary btn-sm" to="/signup">Sign Up</Link>
        </div>
      </nav>

      <header className="bg-dark text-white text-center py-5">
        <div className="container py-4">
          <h1 className="display-5">{slides[index].title}</h1>
          <p className="lead">{slides[index].text}</p>
          <Link className="btn btn-primary btn-lg" to="/signup">Get started</Link>
        </div>
      </header>

      <section className="container my-5">
        <h2>About HotelPro</h2>
        <p className="text-muted">
          HotelPro makes hotel booking simple. Browse rooms, choose your dates and
          book in a few clicks, then view or cancel your bookings whenever you need to.
          Hotel staff get one place to manage rooms, bookings and guests.
        </p>
      </section>

      <section className="container mb-5">
        <h2 className="mb-3">Our rooms</h2>
        <div className="row">
          {rooms.map((room) => (
            <div className="col-md-4 mb-4" key={room._id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title text-capitalize">{room.type} room</h5>
                  <p className="card-text">{room.description}</p>
                  <p className="fw-bold">Rs {room.rent} / night</p>
                  <Link className="btn btn-outline-primary" to="/login">Log in to book</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;