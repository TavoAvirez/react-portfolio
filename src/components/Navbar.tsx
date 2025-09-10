import { NavLink } from "react-router-dom";
import { useTheme } from "../context/themeContext";
import { useState } from "react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const linkStyle: React.CSSProperties = { padding: '8px 12px', textDecoration: 'none' };
  const activeStyle: React.CSSProperties = { fontWeight: 'bold', textDecoration: 'underline' };

  // Close the menu after clicking a link on mobile
  const handleNavClick = () => setOpen(false);

  return (
    <nav className="navbar navbar-expand-md border-bottom sticky-top bg-body">
      <div className="container-fluid">
        {/* Brand */}
        <NavLink to="/" className="navbar-brand fw-semibold" onClick={handleNavClick}>
          React Portfolio
        </NavLink>

        {/* Toggler (controlled by React state, no Bootstrap JS needed) */}
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          aria-controls="mainNavbar"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div id="mainNavbar" className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          {/* Left: nav links */}
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            {/* Uncomment if you want Card page */}
            {/* <li className="nav-item"><NavLink to="/" className={linkClass} onClick={handleNavClick}>Card</NavLink></li> */}

            <li className="nav-item"><NavLink to="/counter" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}  onClick={handleNavClick}>Counter</NavLink></li>
            <li className="nav-item"><NavLink to="/todo" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}  onClick={handleNavClick}>ToDo List</NavLink></li>
            <li className="nav-item"><NavLink to="/clock" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}  onClick={handleNavClick}>ClockDemo</NavLink></li>
            <li className="nav-item"><NavLink to="/pokeapi" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}  onClick={handleNavClick}>PokeAPI</NavLink></li>
            <li className="nav-item"><NavLink to="/rick-morty" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}  onClick={handleNavClick}>Rick & Morty</NavLink></li>
            <li className="nav-item"><NavLink to="/form" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}  onClick={handleNavClick}>FormDemo</NavLink></li>
            <li className="nav-item"><NavLink to="/dynamic-form" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}  onClick={handleNavClick}>DynamicFormDemo</NavLink></li>
            <li className="nav-item"><NavLink to="/memory-game" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}  onClick={handleNavClick}>MemoryGame</NavLink></li>
          </ul>

          {/* Right: theme switch */}
          <div className="navbar-text d-flex align-items-center gap-2">
            <div className="form-check form-switch m-0">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="themeSwitch"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              <label className="form-check-label ms-2" htmlFor="themeSwitch">
                {theme === "dark" ? "Dark" : "Light"}
              </label>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}