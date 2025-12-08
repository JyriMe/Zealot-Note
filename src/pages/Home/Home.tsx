import React from "react";
import { Link } from "react-router-dom";

/**
 * The landing page of the note‑taking app.
 * No props are required right now, but you can extend it later.
 */
const Home: React.FC = () => {
  return (
    <main className="u-padded">
      <h1>📝 Lumo Notes</h1>
      <p>Welcome, Zealot! This is the landing page for your note‑taking app.</p>

      {/* Simple navigation – replace with real routes later */}
      <nav style={{ marginTop: "1rem" }}>
        <Link to="/notes" className="button">
          View My Notes
        </Link>
        {" | "}
        <Link to="/about" className="button">
          About
        </Link>
      </nav>
    </main>
  );
};

export default Home;