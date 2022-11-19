import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import { getSession } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return json({
    isSignedIn: Boolean(session.get("access_token")),
  });
};

export default function Index() {
  const { isSignedIn } = useLoaderData();
  return (
    <main>{isSignedIn ? null : <NavLink to="signin">Sign In</NavLink>}</main>
  );
}
