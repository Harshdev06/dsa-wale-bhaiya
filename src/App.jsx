import logo from "./assets/dsa-logo.png";
function App() {
  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="brand">
          <img
  src={logo}
  alt="DSA Wale Bhaiya"
  className="brand-logo"
/>
          <span>Wale Bhaiya</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#doubts">Doubts</a>
          <a href="#how-it-works">How it works</a>
          <button className="login-btn">Login</button>
        </div>
      </nav>


      {/* Hero */}
      <section className="hero" id="home">

        <div className="hero-content">

          <p className="eyebrow">
            DSA • CODING • PROBLEM SOLVING
          </p>

          <h1>
            Stuck on a
            <span> coding problem?</span>
          </h1>

          <p className="hero-description">
            Post your doubt and get a clear solution through
            video, notes, code and simple explanations.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">
              Ask a Doubt →
            </button>

            <button className="secondary-btn">
              Browse Doubts
            </button>
          </div>

        </div>

      </section>


      {/* Recent Doubts */}
      <section className="doubts-section" id="doubts">

        <div className="section-header">

          <div>
            <p className="section-label">
              COMMUNITY
            </p>

            <h2>
              Recent Doubts
            </h2>
          </div>

          <button className="view-all">
            View all →
          </button>

        </div>


        <div className="doubt-grid">

          <div className="doubt-card">

            <p className="doubt-topic">
              ARRAYS
            </p>

            <h3>
              Why is my Two Sum code not working?
            </h3>

            <p className="doubt-description">
              I am using unordered_map but getting the wrong answer.
            </p>

            <div className="doubt-footer">
              <span>Easy</span>
              <strong>View doubt →</strong>
            </div>

          </div>


          <div className="doubt-card">

            <p className="doubt-topic">
              RECURSION
            </p>

            <h3>
              I don't understand recursion and backtracking
            </h3>

            <p className="doubt-description">
              Can someone explain what actually happens inside recursion?
            </p>

            <div className="doubt-footer">
              <span>Medium</span>
              <strong>View doubt →</strong>
            </div>

          </div>


          <div className="doubt-card">

            <p className="doubt-topic">
              SEARCHING
            </p>

            <h3>
              Binary Search giving wrong index
            </h3>

            <p className="doubt-description">
              My logic looks correct but the answer is still incorrect.
            </p>

            <div className="doubt-footer">
              <span>Easy</span>
              <strong>View doubt →</strong>
            </div>

          </div>

        </div>

      </section>
      {/* How It Works */}
<section className="how-section" id="how-it-works">

  <p className="section-label">
    SIMPLE PROCESS
  </p>

  <h2>
    Ask. Understand. Solve.
  </h2>

  <div className="steps">

    <div className="step">
      <div className="step-number">01</div>

      <h3>Ask your doubt</h3>

      <p>
        Post your DSA question, code, screenshot or
        problem statement.
      </p>
    </div>


    <div className="step">
      <div className="step-number">02</div>

      <h3>Get the solution</h3>

      <p>
        Get a solution through video, notes, code or
        detailed explanation.
      </p>
    </div>


    <div className="step">
      <div className="step-number">03</div>

      <h3>Understand it</h3>

      <p>
        Learn the thought process instead of simply
        copying the answer.
      </p>
    </div>

  </div>

</section>
{/* Footer */}
<footer className="footer">

  <div className="footer-brand">
    <img
      src={logo}
      alt="DSA Wale Bhaiya"
      className="footer-logo"
    />

    <div>
      <h3>DSA Wale Bhaiya</h3>
      <p>Learn DSA. Solve problems. Get better.</p>
    </div>
  </div>

  <div className="footer-right">
    <p>Made for students who want to understand, not memorize.</p>
  </div>

</footer>

    </div>
  );
}

export default App;