import React from 'react';
import Link from 'gatsby-link';
import headshotImage from '../../images/cball-headshot.jpg';

import styles from './styles';

const Sidebar = () => (
  <div className="sidebar" style={styles.sidebar}>
    <div style={styles.myInfo}>
      <img src={headshotImage} style={styles.headshot} />
      <div style={styles.name}>Chris Ball</div>
      <div style={styles.bio}>
        Managing Partner at @echobind. Maker. Cycling & camping to
        counter-balance business & code.
      </div>
    </div>

    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
    </ul>

    <div className="social-icons">
      <a href="https://twitter.com/cball_" target="_blank">
        <img
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3OSA3OSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNmZmZ9PC9zdHlsZT48L2RlZnM+PHRpdGxlPkFzc2V0IDM8L3RpdGxlPjxnIGlkPSJMYXllcl8yIiBkYXRhLW5hbWU9IkxheWVyIDIiPjxnIGlkPSJMYXllcl80IiBkYXRhLW5hbWU9IkxheWVyIDQiPjxwYXRoIGlkPSJUd2l0dGVyIiBjbGFzcz0iY2xzLTEiIGQ9Ik01Ni44IDI0LjNhMTMuOTEgMTMuOTEgMCAwIDEtNC45IDEuOSA3LjcxIDcuNzEgMCAwIDAtNS42LTIuNSA3LjgxIDcuODEgMCAwIDAtNy43IDcuOSAxMSAxMSAwIDAgMCAuMiAxLjhBMjEuNjUgMjEuNjUgMCAwIDEgMjMgMjUuMmE3LjY3IDcuNjcgMCAwIDAtMSA0IDguMzMgOC4zMyAwIDAgMCAzLjQgNi42IDcuMTEgNy4xMSAwIDAgMS0zLjUtMXYuMWE3Ljc1IDcuNzUgMCAwIDAgNi4yIDcuNyA2LjQ1IDYuNDUgMCAwIDEtMiAuMyA2LjE1IDYuMTUgMCAwIDEtMS40LS4xIDcuODQgNy44NCAwIDAgMCA3LjIgNS41IDE1LjA5IDE1LjA5IDAgMCAxLTkuNSAzLjQgMTAuODcgMTAuODcgMCAwIDEtMS44LS4xIDIxLjU0IDIxLjU0IDAgMCAwIDExLjggMy41YzE0LjEgMCAyMS45LTEyIDIxLjktMjIuNHYtMWExNC44NyAxNC44NyAwIDAgMCAzLjgtNC4xIDEzLjcyIDEzLjcyIDAgMCAxLTQuNCAxLjIgMTEgMTEgMCAwIDAgMy4xLTQuNXoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0zOS41IDc5QTM5LjUgMzkuNSAwIDEgMSA3OSAzOS41IDM5LjUyIDM5LjUyIDAgMCAxIDM5LjUgNzl6bTAtNzZBMzYuNSAzNi41IDAgMSAwIDc2IDM5LjUgMzYuNTggMzYuNTggMCAwIDAgMzkuNSAzeiIvPjwvZz48L2c+PC9zdmc+"
          alt="twitter"
        />
      </a>

      <a href="https://github.com/cball" target="_blank">
        <img
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMCAxNS44MDhRMCAxMi41NDQgMS4yOCA5LjZxMi41MjgtNS45NTIgOC40OC04LjQ4IDIuOTQ0LTEuMjggNi4yMDgtMS4yOHQ2LjIwOCAxLjI4cTUuODg4IDIuNDk2IDguNDggOC40OCAxLjI4IDMuMDQgMS4yOCA2LjIwOHQtMS4yOCA2LjIwOHEtMi41OTIgNi4wMTYtOC40OCA4LjU0NC0yLjk0NCAxLjI4LTYuMjA4IDEuMjhUOS43NiAzMC41NlEzLjgwOCAyOCAxLjI4IDIyLjAxNiAwIDE5LjA3MiAwIDE1LjgwOHptMi40OTYgMHEwIDQuNTEyIDIuNjg4IDguMDY0IDIuNjU2IDMuNDg4IDYuOTQ0IDQuOTZ2LTIuNTZxMC0xLjkyIDEuMjgtMi43ODQtLjY0LS4wMzItMS41MDQtLjIyNC0xLjYzMi0uMjg4LTIuNzg0LTEuMDI0LTIuOTEyLTEuNzYtMi45MTItNi4zNjggMC0yLjQgMS42LTQuMDk2LS43MzYtMS44ODguMTYtNC4wOTZoLjY0cS4zMiAwIC44LjE2IDEuMjQ4LjM4NCAyLjc4NCAxLjQwOCAxLjk1Mi0uNTEyIDMuODQtLjUxMnQzLjg3Mi41MTJxMS4yNDgtLjgzMiAyLjMzNi0xLjI4IDEuMDI0LS4zODQgMS40NzItLjMybC4zODQuMDMycS44NjQgMi4yMDguMTYgNC4wOTYgMS42IDEuNjk2IDEuNiA0LjA5NiAwIDMuNTg0LTEuNzYgNS40MDgtLjk2IDEuMDI0LTIuNTI4IDEuNi0xLjMxMi40OC0yLjkxMi42MDggMS4zMTIuOTI4IDEuMzEyIDIuNzg0djIuNTZxNC4xMjgtMS40NzIgNi44MTYtNS4wMjQgMi42MjQtMy41MiAyLjYyNC04IDAtMi43Mi0xLjA1Ni01LjI0OC0xLjAyNC0yLjQzMi0yLjg4LTQuMjg4LTEuNzkyLTEuNzkyLTQuMjg4LTIuODQ4LTIuNTYtMS4wODgtNS4yMTYtMS4wODgtMi42MjQgMC01LjI0OCAxLjA4OC0yLjQgMS4wMjQtNC4yODggMi44NDgtMS43OTIgMS44NTYtMi44OCA0LjI4OC0xLjA1NiAyLjUyOC0xLjA1NiA1LjI0OHoiIGZpbGw9IiNmZmYiLz48L3N2Zz4="
          alt="github"
        />
      </a>

      <a href="https://www.linkedin.com/chris-r-ball" target="_blank">
        <img
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3OSA3OSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNmZmZ9PC9zdHlsZT48L2RlZnM+PHRpdGxlPkFzc2V0IDQ8L3RpdGxlPjxnIGlkPSJMYXllcl8yIiBkYXRhLW5hbWU9IkxheWVyIDIiPjxnIGlkPSJMYXllcl8zIiBkYXRhLW5hbWU9IkxheWVyIDMiPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTIyLjcgMzMuOGg3LjJ2MjIuOGgtNy4yem0yNi44LS4zYy00LjEgMC02LjcgMi4yLTcuMiAzLjh2LTMuNmgtOC4xYy4xIDEuOSAwIDIyLjggMCAyMi44aDguMVY0NC4yYTUuNTUgNS41NSAwIDAgMSAuMi0xLjkgNC4wOCA0LjA4IDAgMCAxIDMuOS0yLjhjMi44IDAgNC4xIDIuMSA0LjEgNS4ydjExLjhoOC4yVjQzLjhjLS4xLTctNC4xLTEwLjMtOS4yLTEwLjN6TTI2LjEgMjNjLTIuNyAwLTQuNCAxLjctNC40IDRzMS43IDMuOSA0LjMgMy45aC4xYzIuNyAwIDQuNC0xLjcgNC40LTRhNCA0IDAgMCAwLTQuNC0zLjl6IiBpZD0iTGlua2VkSW4iLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0zOS41IDc5QTM5LjUgMzkuNSAwIDEgMSA3OSAzOS41IDM5LjUyIDM5LjUyIDAgMCAxIDM5LjUgNzl6bTAtNzZBMzYuNSAzNi41IDAgMSAwIDc2IDM5LjUgMzYuNTggMzYuNTggMCAwIDAgMzkuNSAzeiIvPjwvZz48L2c+PC9zdmc+"
          alt="linkedin"
        />
      </a>
    </div>
  </div>
);

export default Sidebar;
