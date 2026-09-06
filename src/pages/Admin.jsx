import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";

function Admin() {
  const navigate = useNavigate();

  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchDoubts() {
    const { data, error } = await supabase
      .from("doubts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching doubts:", error);
      setLoading(false);
      return;
    }

    setDoubts(data);
    setLoading(false);
  }

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // User logged in nahi hai
      if (!user) {
        navigate("/login");
        return;
      }

      // Profile se admin status check
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
      fetchDoubts();
    }

    checkAdmin();
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  const pendingDoubts = doubts.filter(
    (doubt) => doubt.status === "pending"
  );

  const solvedDoubts = doubts.filter(
    (doubt) => doubt.status === "solved"
  );

  return (
    <div className="admin-page">

      <div className="admin-header">

        <div>
          <p className="section-label">
            ADMIN DASHBOARD
          </p>

          <h1>
            Manage Doubts
          </h1>

          <p className="admin-subtitle">
            Review student doubts and add solutions.
          </p>
        </div>

        <div className="admin-actions">

          <Link
            to="/"
            className="secondary-btn"
          >
            View Website
          </Link>

          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>

        </div>

      </div>


      <div className="admin-stats">

        <div className="admin-stat">
          <span>Total Doubts</span>
          <strong>{doubts.length}</strong>
        </div>

        <div className="admin-stat">
          <span>Pending</span>
          <strong>{pendingDoubts.length}</strong>
        </div>

        <div className="admin-stat">
          <span>Solved</span>
          <strong>{solvedDoubts.length}</strong>
        </div>

      </div>


      <section className="admin-doubts">

        <div className="admin-section-header">

          <h2>
            All Doubts
          </h2>

          <span>
            {doubts.length} total
          </span>

        </div>


        {loading ? (

          <p className="admin-message">
            Checking admin access...
          </p>

        ) : doubts.length === 0 ? (

          <p className="admin-message">
            No doubts submitted yet.
          </p>

        ) : (

          <div className="admin-doubt-list">

            {doubts.map((doubt) => (

              <div
                className="admin-doubt"
                key={doubt.id}
              >

                <div className="admin-doubt-info">

                  <div className="doubt-top">

                    <span className="doubt-topic">
                      {doubt.topic}
                    </span>

                    <span className="doubt-status">
                      {doubt.status}
                    </span>

                  </div>

                  <h3>
                    {doubt.title}
                  </h3>

                  <p>
                    {doubt.description}
                  </p>

                  <small>
                    {new Date(
                      doubt.created_at
                    ).toLocaleString()}
                  </small>

                </div>

                <Link
                  to={`/solve/${doubt.id}`}
                  className="primary-btn admin-view-btn"
                >
                  Solve →
                </Link>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default Admin;