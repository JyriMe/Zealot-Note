import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Notes from "./pages/Notes/Notes";

/**
 * Optional Layout component – you can expand it with a header/footer later.
 */
const Layout: React.FC = () => (
  <>
    {/* Place a persistent Header here if you want */}
    <Outlet />
    {/* Persistent Footer could go here */}
  </>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Wrap pages in Layout if you need shared UI */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/notes" element={<Notes />} />
        </Route>

        {/* Fallback 404 */}
        <Route
          path="*"
          element={
            <section className="u-padded">
              <h2>Page not found</h2>
              <p>Sorry, that URL doesn’t exist.</p>
            </section>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;