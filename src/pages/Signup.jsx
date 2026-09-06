import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords match nahi kar rahe ❌");
      return;
    }

    if (password.length < 6) {
      setError("Password kam se kam 6 characters ka hona chahiye.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Agar email confirmation disabled hai
    if (data.session) {
      navigate("/ask");
      return;
    }

    // Agar email confirmation enabled hai
    setSuccess(
      "Account create ho gaya! 📧 Email check karke account confirm karo, phir login karo."
    );
  }

  return (
    <div className="login-page">

      <div className="login-box">

        <p className="section-label">
          STUDENT SIGN UP
        </p>

        <h1>
          Create your account
        </h1>

        <p className="login-subtitle">
          Create an account to ask doubts and track your solutions.
        </p>


        <form onSubmit={handleSignup}>

          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="signup-email">
              Email
            </label>

            <input
              id="signup-email"
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

            <label htmlFor="signup-password">
              Password
            </label>

            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Create a password"
              required
            />

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="form-group">

            <label htmlFor="confirm-password">
              Confirm Password
            </label>

            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Enter password again"
              required
            />

          </div>


          {/* ERROR */}

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}


          {/* SUCCESS */}

          {success && (
            <p className="login-success">
              {success}
            </p>
          )}


          {/* BUTTON */}

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account →"}
          </button>

        </form>


        <p className="login-footer-text">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Signup;