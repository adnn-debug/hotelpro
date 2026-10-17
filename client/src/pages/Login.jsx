import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      // Save the token and user so they survive a page refresh
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Send each role to its own dashboard
      if (res.data.user.type === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h2 className="mb-4">Log In</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input className="form-control mb-3" name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input className="form-control mb-3" name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button className="btn btn-primary w-100" type="submit">Log in</button>
      </form>

      <p className="mt-3">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
}

export default Login;