import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkRecoverySession() {
      // Supabase handles the recovery link and creates the session.
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session) {
        setCheckingSession(false);
        return;
      }

      // Password recovery can fire through this auth event.
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (!mounted) return;

        if (event === "PASSWORD_RECOVERY" && session) {
          setCheckingSession(false);
        }
      });

      // Give Supabase a moment to process the recovery URL.
      setTimeout(async () => {
        if (!mounted) return;

        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!currentSession) {
          setError(
            "Reset link invalid ya expire ho gaya hai. Dobara password reset request karo."
          );
        }

        setCheckingSession(false);
        subscription.unsubscribe();
      }, 1000);
    }

    checkRecoverySession();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleUpdatePassword(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password kam se kam 6 characters ka hona chahiye.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords match nahi kar rahe ❌");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Password successfully update ho gaya! 🎉");

    setPassword("");
    setConfirmPassword("");

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }

  if (checkingSession) {
    return (
      <div className="login-page">
        <div className="login-box">
          <p className="section-label">RESET PASSWORD</p>

          <h1>Checking reset link...</h1>

          <p className="login-subtitle">
            Please wait while we verify your password reset link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <p className="section-label">RESET PASSWORD</p>

        <h1>Create new password</h1>

        <p className="login-subtitle">
          Apna naya password set karo.
        </p>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        {success ? (
          <p className="login-success">
            {success}
            <br />
            Login page par redirect kar rahe hain...
          </p>
        ) : (
          <form onSubmit={handleUpdatePassword}>
            <div className="form-group">
              <label htmlFor="new-password">
                New Password
              </label>

              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                minLength={6}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm-new-password">
                Confirm Password
              </label>

              <input
                id="confirm-new-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter password again"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Update Password →"}
            </button>
          </form>
        )}

        <p className="login-footer-text">
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              background: "none",
              border: "none",
              color: "#f97316",
              fontWeight: "600",
              padding: 0,
              cursor: "pointer",
            }}
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;