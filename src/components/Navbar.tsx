import { NavLink } from "react-router-dom";
import { useTheme } from "../context/themeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const linkStyle: React.CSSProperties = { padding: '8px 12px', textDecoration: 'none' };
  const activeStyle: React.CSSProperties = { fontWeight: 'bold', textDecoration: 'underline' };

  return (
    <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #eee' }}>
      {/* <NavLink to="/" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
        Card
      </NavLink> */}
      <NavLink to="/counter" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
        Counter
      </NavLink>
      <NavLink to="/todo" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
        ToDo List
      </NavLink>
      <NavLink to="/clock" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
        ClockDemo
      </NavLink>
      <NavLink to="/rick-morty" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
        Rick & Morty
      </NavLink>
      <NavLink to="/form" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
        FormDemo
      </NavLink>
      <NavLink to="/pokeapi" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
        PokeAPI
      </NavLink>
      <NavLink to="/dynamic-form" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>
        DynamicFormDemo
      </NavLink>
      
      {/* Toggle tema */}
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
    </nav>
  );
}