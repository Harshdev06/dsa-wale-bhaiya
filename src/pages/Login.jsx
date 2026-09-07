import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import supabase from "../lib/supabase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    // Login
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    const user = data.user;

    // Check admin status
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    setLoading(false);

    // Admin
    if (profile?.is_admin === true) {
      navigate("/admin");
      return;
    }

    // Normal student
    navigate("/my-doubts");
  }

  return (
    <div className="login-page">

      <div className="login-box">

        <p className="section-label">
          LOGIN
        </p>

        <h1>
          Welcome back
        </h1>

        <p className="login-subtitle">
          Login to ask doubts and track your solutions.
        </p>


        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              required
            />

          </div>


          {/* ERROR */}

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login →"}
          </button>

        </form>


        {/* SIGNUP */}

        <p className="login-footer-text">

          Don't have an account?{" "}

          <Link to="/signup">
            Create account
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;