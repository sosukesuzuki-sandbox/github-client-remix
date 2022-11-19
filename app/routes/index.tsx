import { NavLink } from "@remix-run/react";

export default function Index() {
  return (
    <main>
      <h1>GitHub Client built with Remix!</h1>
      <NavLink to="signin">Sign In</NavLink>
    </main>
  );
}
