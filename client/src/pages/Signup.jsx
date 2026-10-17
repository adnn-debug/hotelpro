import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function Signup() {
  const navigate = useNavigate();

  // One object holds everything the user types
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    phone: "",
  });
  const [error, setError] = useState("");

  // Update the field that changed
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the page from reloading
    setError("");

    // Confirm password is checked here only and is never sent to the server
    if (form.password !== form.cpassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        type: "customer",
      });
      alert("Account created successfully");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h2 className="mb-4">Sign Up</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input className="form-control mb-3" name="name" placeholder="Name" onChange={handleChange} required />
        <input className="form-control mb-3" name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input className="form-control mb-3" name="phone" placeholder="Phone" onChange={handleChange} required />
        <input className="form-control mb-3" name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input className="form-control mb-3" name="cpassword" type="password" placeholder="Confirm password" onChange={handleChange} required />
        <button className="btn btn-primary w-100" type="submit">Create account</button>
      </form>

      <p className="mt-3">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default Signup;