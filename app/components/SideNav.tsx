import type { FC } from "react";
import { NavLink } from "@remix-run/react";

export const SideNav: FC = () => {
  return (
    <div style={{ borderRight: "1px solid black", width: "200px" }}>
      <ul>
        <li>
          <NavLink to="repositories">Repositories</NavLink>
        </li>
      </ul>
    </div>
  );
};
