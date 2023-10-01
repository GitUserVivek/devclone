import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <span style={{ padding: "1rem" }}>
        <NavLink
          to="/"
          style={{
            color: "var(--primary)",
            fontWeight: "500",
            textDecoration: "none",
          }}
        >
          DEV Community
        </NavLink>
        — A constructive and inclusive social network for software developers.
        With you every step of your journey.
      </span>

      <span>
        Built on
        <a
          href="https://www.forem.com/"
          target="blank"
          style={{
            color: "var(--primary)",
            fontWeight: "normal",
            textDecoration: "none",
          }}
        >
          Forem
        </a>
        — the
        <a
          href="https://dev.to/t/opensource"
          target="blank"
          style={{
            color: "var(--primary)",
            fontWeight: "normal",
            textDecoration: "none",
          }}
        >
          open source
        </a>
        software that powers
        <NavLink
          to="/"
          style={{
            color: "var(--primary)",
            fontWeight: "normal",
            textDecoration: "none",
          }}
        >
          DEV
        </NavLink>
        and other inclusive communities.
      </span>
      <span>
        Made with love and
        <a
          href="https://dev.to/t/rails"
          target="blank"
          style={{
            color: "var(--primary)",
            fontWeight: "normal",
            textDecoration: "none",
          }}
        >
          Ruby on Rails
        </a>
        DEV Community © 2016 - 2022.
      </span>
    </footer>
  );
};
export default Footer;
