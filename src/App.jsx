import { useEffect, useState } from "react";
import logo from "./assets/dsa-logo.png";
import homeBg from "./assets/home-bg.png";

import {
  HashRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import supabase from "./lib/supabase";

import AskDoubt from "./pages/AskDoubt";
import DoubtDetail from "./pages/DoubtDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import SolveDoubt from "./pages/SolveDoubt";
import MyDoubts from "./pages/MyDoubts";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();

      setIsAdmin(profile?.is_admin === true);
      setLoading(false);
    }

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user || null;

        setUser(currentUser);

        if (!currentUser) {
          setIsAdmin(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", currentUser.id)
          .maybeSingle();

        setIsAdmin(profile?.is_admin === true);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  function goToSection(sectionId) {
    closeMenu();

    if (window.location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }

    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleLogout() {
    closeMenu();
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link
          to="/"
          className="brand"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="DSA Wale Bhaiya"
            className="brand-logo"
          />
          <span>DSA Wale Bhaiya</span>
        </Link>

        <button
          type="button"
          className={`mobile-menu-btn ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-links ${menuOpen ? "mobile-open" : ""}`}>
          <button
            type="button"
            onClick={() => {
              closeMenu();
              navigate("/");
            }}
            className="nav-text-btn"
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => goToSection("doubts")}
            className="nav-text-btn"
          >
            Doubts
          </button>

          <button
            type="button"
            onClick={() => goToSection("how-it-works")}
            className="nav-text-btn"
          >
            How it works
          </button>

          {!loading && !user && (
            <Link
              to="/login"
              className="nav-action"
              onClick={closeMenu}
            >
              Login
            </Link>
          )}

          {!loading && user && !isAdmin && (
            <Link
              to="/my-doubts"
              className="nav-action"
              onClick={closeMenu}
            >
              My Doubts
            </Link>
          )}

          {!loading && user && isAdmin && (
            <Link
              to="/admin"
              className="nav-action"
              onClick={closeMenu}
            >
              Admin
            </Link>
          )}

          {!loading && user && (
            <button
              type="button"
              onClick={handleLogout}
              className="nav-logout"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

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

      setDoubts(data || []);
    }

    fetchDoubts();
  }, []);

  return (
    <div className="app">
      <Navbar />

      <main>
        <section
          className="hero"
          style={{ "--home-bg": `url(${homeBg})` }}
        >
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">DSA • CODING • GUIDANCE</p>

              <h1>
                Stuck on a
                <span> coding problem?</span>
              </h1>

              <p className="hero-text">
                Ask your DSA doubt. Get a clear explanation,
                correct code, and a solution you can actually
                understand.
              </p>

              <div className="hero-buttons">
                <Link to="/ask" className="primary-btn">
                  Ask a doubt <span>→</span>
                </Link>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    document
                      .getElementById("doubts")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Browse doubts
                </button>
              </div>

              <div className="hero-note">
                <span className="hero-dot" />
                Free • Student focused • Community driven
              </div>
            </div>

            <div className="hero-side">
              <div className="hero-card">
                <div className="hero-card-top">
                  <span>01</span>
                  <span>ASK</span>
                </div>

                <div className="hero-card-line" />

                <h2>Understand the problem.</h2>

                <p>
                  Don't just copy a solution. Learn why the
                  approach works.
                </p>
              </div>

              <div className="hero-card hero-card-offset">
                <div className="hero-card-top">
                  <span>02</span>
                  <span>SOLVE</span>
                </div>

                <div className="hero-card-line" />

                <h2>Build better DSA thinking.</h2>

                <p>
                  Step-by-step explanations, code and video
                  solutions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="doubts-section" id="doubts">
          <div className="section-header">
            <div>
              <p className="section-label">COMMUNITY</p>
              <h2>Recent doubts</h2>
            </div>

            <Link to="/ask" className="text-link">
              Ask a doubt →
            </Link>
          </div>

          <div className="doubt-grid">
            {doubts.length === 0 ? (
              <div className="empty-doubts">
                <span>—</span>
                <p>No doubts yet. Be the first one to ask.</p>
                <Link to="/ask" className="text-link">
                  Ask your first doubt →
                </Link>
              </div>
            ) : (
              doubts.map((doubt, index) => (
                <article className="doubt-card" key={doubt.id}>
                  <div className="doubt-card-top">
                    <span className="doubt-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="doubt-topic">
                      {doubt.topic}
                    </span>

                    <span className="doubt-status">
                      {doubt.status}
                    </span>
                  </div>

                  <h3>{doubt.title}</h3>

                  <p>{doubt.description}</p>

                  <div className="doubt-footer">
                    <span>
                      {new Date(
                        doubt.created_at
                      ).toLocaleDateString()}
                    </span>

                    <Link
                      to={`/doubt/${doubt.id}`}
                      className="text-link"
                    >
                      View doubt →
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="how-inner">
            <div className="section-header how-header">
              <div>
                <p className="section-label">THE PROCESS</p>
                <h2>Simple by design.</h2>
              </div>

              <p className="section-intro">
                A straightforward flow from confusion to
                understanding.
              </p>
            </div>

            <div className="steps">
              <div className="step">
                <span className="step-number">01</span>
                <div>
                  <h3>Ask your doubt</h3>
                  <p>
                    Explain the problem, share what you tried,
                    and add your code if you have it.
                  </p>
                </div>
              </div>

              <div className="step">
                <span className="step-number">02</span>
                <div>
                  <h3>Get the reasoning</h3>
                  <p>
                    Understand the approach instead of only
                    seeing the final answer.
                  </p>
                </div>
              </div>

              <div className="step">
                <span className="step-number">03</span>
                <div>
                  <h3>Learn from it</h3>
                  <p>
                    Revisit the explanation, code and video
                    whenever you need it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img
              src={logo}
              alt="DSA Wale Bhaiya"
              className="footer-logo"
            />

            <div>
              <h3>DSA Wale Bhaiya</h3>
              <p>Making DSA easier, one doubt at a time.</p>
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
        <Route path="/" element={<Home />} />
        <Route path="/ask" element={<AskDoubt />} />
        <Route path="/doubt/:id" element={<DoubtDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
        <Route path="/my-doubts" element={<MyDoubts />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/solve/:id" element={<SolveDoubt />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
