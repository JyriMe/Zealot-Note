// Import React library - needed for all React components
import React from "react";

// Import routing components from react-router-dom
// These help us navigate between different pages in our app
import {
  BrowserRouter,  // Wraps our app to enable routing
  Routes,         // Container for all our routes
  Route,          // Defines a single route (URL path -> Component)
  Navigate,       // Redirects users from one path to another
  Outlet,         // Placeholder where child routes will be rendered
} from "react-router-dom";

// Import our page components
// "./" means "current directory" (src folder)
import Home from "./pages/Home/Home";
import Notes from "./pages/Notes/Notes";

/**
 * Layout Component
 * This is a wrapper component that can be used to add shared UI elements
 * like headers, footers, or navigation that appear on multiple pages.
 *
 * React.FC means "React Functional Component"
 * <Outlet /> is where the child routes (Home, Notes) will be displayed
 */
const Layout: React.FC = () => (
  <>
    {/* <> is a React Fragment - lets us return multiple elements without adding extra DOM nodes */}
    {/* You could add a persistent Header here that shows on all pages */}
    <Outlet />
    {/* You could add a persistent Footer here that shows on all pages */}
  </>
);

/**
 * Main App Component
 * This is the root component of our application.
 * It sets up all the routes (URL paths) and which components to show for each path.
 */
const App: React.FC = () => {
  return (
    // BrowserRouter enables client-side routing (navigation without page reloads)
    <BrowserRouter>
      {/* Routes is a container for all our Route definitions */}
      <Routes>
        {/*
          Route 1: Root path redirect
          When user visits "/" (root), automatically redirect them to "/home"
          "replace" means don't add this to browser history
        */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/*
          Nested Routes with Layout
          All routes inside this Route will be wrapped with the Layout component
        */}
        <Route element={<Layout />}>
          {/* When user visits "/home", show the Home component */}
          <Route path="/home" element={<Home />} />

          {/* When user visits "/notes", show the Notes component */}
          <Route path="/notes" element={<Notes />} />
        </Route>

        {/*
          Fallback 404 Route
          path="*" means "match any path that wasn't matched above"
          This shows when user tries to visit a URL that doesn't exist
        */}
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

// Export the App component so it can be imported in other files (like main.tsx)
export default App;
