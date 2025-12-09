import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Home from "./pages/Home/Home";
import Notes from "./pages/Notes/Notes";

// Layout wrapper - <Outlet /> renders the child route components
const Layout: React.FC = () => (
  <>
    <Outlet />
  </>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect "/" to "/home" */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Main routes wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
        </Route>

        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <section className="u-padded">
              <h2>Page not found</h2>
              <p>Sorry, that URL doesn't exist.</p>
            </section>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
