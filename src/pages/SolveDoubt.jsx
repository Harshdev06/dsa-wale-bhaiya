import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import supabase from "../lib/supabase";

function SolveDoubt() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doubt, setDoubt] = useState(null);

  const [solutionNotes, setSolutionNotes] = useState("");
  const [solutionCode, setSolutionCode] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState("pending");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchDoubt() {
    const { data, error } = await supabase
      .from("doubts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching doubt:", error);
      setLoading(false);
      return;
    }

    setDoubt(data);

    setSolutionNotes(data.solution_notes || "");
    setSolutionCode(data.solution_code || "");
    setVideoUrl(data.solution_video_url || "");
    setStatus(data.status || "pending");

    setLoading(false);
  }

  useEffect(() => {
    async function checkAdmin() {
      // Check logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      // Check admin profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (error || !profile?.is_admin) {
        alert("Access denied ❌");
        navigate("/");
        return;
      }

      // User is admin
      fetchDoubt();
    }

    checkAdmin();
  }, [navigate, id]);

  async function handleSave(e) {
    e.preventDefault();

    setSaving(true);

    const { error } = await supabase
      .from("doubts")
      .update({
        solution_notes: solutionNotes,
        solution_code: solutionCode,
        solution_video_url: videoUrl,
        status: status,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      console.error("Error saving solution:", error);
      alert("Solution save nahi hui ❌");
      return;
    }

    alert("Solution successfully saved! 🎉");

    navigate("/admin");
  }

  if (loading) {
    return (
      <div className="solve-page">
        <p className="loading-text">
          Checking admin access...
        </p>
      </div>
    );
  }

  if (!doubt) {
    return (
      <div className="solve-page">
        <h1>Doubt not found</h1>

        <Link to="/admin" className="primary-btn">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="solve-page">

      <Link to="/admin" className="back-link">
        ← Back to dashboard
      </Link>


      {/* HEADER */}

      <div className="solve-header">

        <p className="section-label">
          SOLVE DOUBT
        </p>

        <h1>
          {doubt.title}
        </h1>

        <div className="detail-meta">

          <span className="doubt-topic">
            {doubt.topic}
          </span>

          <span className="doubt-status">
            {doubt.status}
          </span>

        </div>

      </div>


      {/* STUDENT DOUBT */}

      <section className="student-doubt">

        <p className="section-label">
          STUDENT'S DOUBT
        </p>

        <p className="detail-description">
          {doubt.description}
        </p>

      </section>


      {/* STUDENT CODE */}

      {doubt.code && (

        <section className="student-doubt">

          <p className="section-label">
            STUDENT'S CODE
          </p>

          <pre className="code-block">
            <code>
              {doubt.code}
            </code>
          </pre>

        </section>

      )}


      {/* SOLUTION FORM */}

      <form
        className="solution-form"
        onSubmit={handleSave}
      >

        <div className="solution-form-header">

          <p className="section-label">
            YOUR SOLUTION
          </p>

          <h2>
            Add the answer
          </h2>

        </div>


        {/* NOTES */}

        <div className="form-group">

          <label htmlFor="solutionNotes">
            Solution Notes
          </label>

          <textarea
            id="solutionNotes"
            rows="12"
            value={solutionNotes}
            onChange={(e) =>
              setSolutionNotes(e.target.value)
            }
            placeholder="Explain the approach, logic, mistakes and solution..."
          />

        </div>


        {/* CODE */}

        <div className="form-group">

          <label htmlFor="solutionCode">
            Correct Solution Code
          </label>

          <textarea
            id="solutionCode"
            rows="14"
            value={solutionCode}
            onChange={(e) =>
              setSolutionCode(e.target.value)
            }
            placeholder="Paste the correct C++, Java, Python etc. solution here..."
          />

        </div>


        {/* VIDEO */}

        <div className="form-group">

          <label htmlFor="videoUrl">
            Video Solution URL
            <span> (optional)</span>
          </label>

          <input
            id="videoUrl"
            type="url"
            value={videoUrl}
            onChange={(e) =>
              setVideoUrl(e.target.value)
            }
            placeholder="https://youtube.com/..."
          />

        </div>


        {/* STATUS */}

        <div className="form-group">

          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >

            <option value="pending">
              Pending
            </option>

            <option value="solved">
              Solved
            </option>

          </select>

        </div>


        <button
          type="submit"
          className="primary-btn"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Solution →"}
        </button>

      </form>

    </div>
  );
}

export default SolveDoubt;