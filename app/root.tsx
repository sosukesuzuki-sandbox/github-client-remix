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
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { Header } from "~/components/Header";
import { getSession } from "./session.server";
import { SideNav } from "./components/SideNav";
import { getViewerImageUrl } from "./lib/viewer";

export const meta: MetaFunction = () => ({
  charSet: "utf-8",
  title: "GitHub client built with Remix!",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const accessToken = session.get("access_token");

  const url = new URL(request.url);
  const passthroughPathnames = new Set(["/signin", "/signin/callback"]);
  const isPassthroughPathname = passthroughPathnames.has(url.pathname);

  let viewerImageUrl;
  if (accessToken) {
    viewerImageUrl = (await getViewerImageUrl(accessToken)).data.viewer
      .avatarUrl;
  }

  return json({
    isSignedIn: Boolean(accessToken),
    isPassthroughPathname,
    viewerImageUrl,
  });
};

export default function App() {
  const { isSignedIn, isPassthroughPathname, viewerImageUrl } = useLoaderData();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Header viewerImageUrl={viewerImageUrl} />
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
