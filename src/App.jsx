import { useEffect, useState } from "react";
import logo from "./assets/dsa-logo.png";
import {
  HashRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import supabase from "./lib/supabase";

import AskDoubt from "./pages/AskDoubt";
import DoubtDetail from "./pages/DoubtDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import SolveDoubt from "./pages/SolveDoubt";


function Home() {
  const [doubts, setDoubts] = useState([]);

  useEffect(() => {
    async function fetchDoubts() {
      const { data, error } = await supabase
        .from("doubts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching doubts:", error);
        return;
      }

      setDoubts(data);
    }

    fetchDoubts();
  }, []);

  return (
    <div className="app">

      {/* NAVBAR */}

      <nav className="navbar">

        <Link to="/" className="brand">

          <img
            src={logo}
            alt="DSA Wale Bhaiya"
            className="brand-logo"
          />

          <span>
            DSA Wale Bhaiya
          </span>

        </Link>


        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          <a href="#doubts">
            Doubts
          </a>

          <a href="#how-it-works">
            How it works
          </a>

          <Link
            to="/login"
            className="nav-login"
          >
            Login
          </Link>

        </div>

      </nav>


      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <p className="section-label">
            DSA • CODING • GUIDANCE
          </p>

          <h1>
            Stuck on a
            <span> coding problem?</span>
          </h1>

          <p className="hero-text">
            Ask your DSA doubt. Get a clear explanation
            with code, notes and video solutions.
          </p>


          <div className="hero-buttons">

            <Link
              to="/ask"
              className="primary-btn"
            >
              Ask a Doubt →
            </Link>

            <a
              href="#doubts"
              className="secondary-btn"
            >
              Browse Doubts
            </a>

          </div>

        </div>

      </section>


      {/* RECENT DOUBTS */}

      <section
        className="doubts-section"
        id="doubts"
      >

        <div className="section-header">

          <div>

            <p className="section-label">
              COMMUNITY
            </p>

            <h2>
              Recent Doubts
            </h2>

          </div>


          <Link
            to="/ask"
            className="view-all"
          >
            Ask a doubt →
          </Link>

        </div>


        <div className="doubt-grid">

          {doubts.length === 0 ? (

            <p className="empty-doubts">
              No doubts yet. Be the first one to ask! 🚀
            </p>

          ) : (

            doubts.map((doubt) => (

              <div
                className="doubt-card"
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


                <div className="doubt-footer">

                  <span>
                    {new Date(
                      doubt.created_at
                    ).toLocaleDateString()}
                  </span>


                  <Link
                    to={`/doubt/${doubt.id}`}
                    className="view-doubt"
                  >
                    View doubt →
                  </Link>

                </div>

              </div>

            ))

          )}

        </div>

      </section>


      {/* HOW IT WORKS */}

      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="section-header">

          <div>

            <p className="section-label">
              SIMPLE PROCESS
            </p>

            <h2>
              How It Works
            </h2>

          </div>

        </div>


        <div className="steps">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <h3>
              Ask your doubt
            </h3>

            <p>
              Explain your coding problem and add
              your code if you have one.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              02
            </div>

            <h3>
              We solve it
            </h3>

            <p>
              Understand the approach, logic and
              code behind the solution.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              03
            </div>

            <h3>
              Learn & improve
            </h3>

            <p>
              Read the notes or watch the video
              solution and strengthen your DSA concepts.
            </p>

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="footer">

        <div className="footer-content">

          <div className="footer-brand">

            <img
              src={logo}
              alt="DSA Wale Bhaiya"
              className="footer-logo"
            />

            <div>

              <h3>
                DSA Wale Bhaiya
              </h3>

              <p>
                Making DSA easier, one doubt at a time.
              </p>

            </div>

          </div>


          <p className="footer-copy">
            © 2026 DSA Wale Bhaiya
          </p>

        </div>

      </footer>

    </div>
  );
}


function App() {
  return (
    <HashRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/ask"
          element={<AskDoubt />}
        />

        <Route
          path="/doubt/:id"
          element={<DoubtDetail />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/solve/:id"
          element={<SolveDoubt />}
        />

      </Routes>

    </HashRouter>
  );
}


export default App;