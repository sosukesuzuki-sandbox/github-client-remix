import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { Header } from "~/components/Header";
import { getSession } from "./session.server";
import { SideNav } from "./components/SideNav";

export const meta: MetaFunction = () => ({
  charSet: "utf-8",
  title: "GitHub client built with Remix!",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const url = new URL(request.url);
  const passthroughPathnames = new Set(["/signin", "/signin/callback"]);
  return json({
    isSignedIn: Boolean(session.get("access_token")),
    isPassthroughPathname: passthroughPathnames.has(url.pathname),
  });
};

export default function App() {
  const { isSignedIn, isPassthroughPathname } = useLoaderData();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        {(() => {
          if (isPassthroughPathname) {
            return <Outlet />;
          }
          if (isSignedIn) {
            return (
              <div style={{ display: "flex" }}>
                <SideNav />
                <Outlet />
              </div>
            );
          }
          return <NavLink to="signin">Sign In</NavLink>;
        })()}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
