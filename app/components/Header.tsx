import type { FC } from "react";
import { NavLink } from "@remix-run/react";

type Props = {
  viewerImageUrl?: string;
};

export const Header: FC<Props> = ({ viewerImageUrl }) => {
  return (
    <nav style={{ borderBottom: "1px solid black", display: "flex" }}>
      <h1>
        <NavLink to="/">GitHub client built with Remix!!</NavLink>
      </h1>
      {viewerImageUrl ? (
        <img src={viewerImageUrl} width="50" height="50" alt="" />
      ) : null}
    </nav>
  );
};
