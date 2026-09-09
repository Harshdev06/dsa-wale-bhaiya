import { useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../lib/supabase";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleReset(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
          "localhost:5173/#/reset-password",
      }
    );

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(
      "Password reset email bhej diya gaya hai! 📧 Apna email check karo."
    );
  }

  return (
    <div className="login-page">
      <div className="login-box">

        <p className="section-label">
          PASSWORD RESET
        </p>

        <h1>Forgot your password?</h1>

        <p className="login-subtitle">
          Apna registered email enter karo. Hum password reset
          karne ka link bhej denge.
        </p>

        <form onSubmit={handleReset}>

          <div className="form-group">
            <label htmlFor="reset-email">
              Email
            </label>

            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your registered email"
              required
            />
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          {success && (
            <p className="login-success">
              {success}
            </p>
          )}

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Send Reset Link →"}
          </button>

        </form>

        <p className="login-footer-text">
          Remember your password?{" "}
          <Link to="/login">
            Back to Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;