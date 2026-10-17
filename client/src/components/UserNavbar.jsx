import { Link, useNavigate } from "react-router-dom";

function UserNavbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand">HotelPro</span>
      <div className="d-flex align-items-center gap-3">
        <Link className="text-white text-decoration-none" to="/home">Rooms</Link>
        <Link className="text-white text-decoration-none" to="/mybookings">My Bookings</Link>
        <span className="text-white-50">Hi, {user.name}</span>
        <button className="btn btn-sm btn-outline-light" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

export default UserNavbar;