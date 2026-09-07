import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";

function MyDoubts() {
  const navigate = useNavigate();

  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyDoubts() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("doubts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching my doubts:", error);
        setLoading(false);
        return;
      }

      setDoubts(data);
      setLoading(false);
    }

    fetchMyDoubts();
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="my-doubts-page">
        <p className="loading-text">
          Loading your doubts...
        </p>
      </div>
    );
  }

  return (
    <div className="my-doubts-page">

      <div className="my-doubts-header">

        <div>
          <p className="section-label">
            STUDENT DASHBOARD
          </p>

          <h1>
            My Doubts
          </h1>

          <p className="my-doubts-subtitle">
            Track your questions and check their solutions.
          </p>
        </div>

        <div className="my-doubts-actions">

          <Link
            to="/"
            className="secondary-btn"
          >
            Home
          </Link>

          <Link
            to="/ask"
            className="primary-btn"
          >
            Ask a Doubt →
          </Link>

          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>

        </div>

      </div>


      <section className="my-doubts-list">

        <div className="my-doubts-section-header">

          <h2>
            Your Questions
          </h2>

          <span>
            {doubts.length} total
          </span>

        </div>


        {doubts.length === 0 ? (

          <div className="no-my-doubts">

            <h2>
              No doubts yet 🚀
            </h2>

            <p>
              You haven't asked any doubt yet.
            </p>

            <Link
              to="/ask"
              className="primary-btn"
            >
              Ask Your First Doubt →
            </Link>

          </div>

        ) : (

          <div className="my-doubt-grid">

            {doubts.map((doubt) => (

              <div
                className="my-doubt-card"
                key={doubt.id}
              >

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


                <div className="my-doubt-footer">

                  <span>
                    {new Date(
                      doubt.created_at
                    ).toLocaleDateString()}
                  </span>

                  <Link
                    to={`/doubt/${doubt.id}`}
                    className="view-doubt"
                  >
                    {doubt.status === "solved"
                      ? "View Solution →"
                      : "View Doubt →"}
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default MyDoubts;