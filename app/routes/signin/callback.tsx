import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getAccessToken, isAccessTokenResponse } from "~/lib/auth";
import { getSession, commitSession } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  if (!code) {
    throw new Error("missing code");
  }

  const state = url.searchParams.get("state");
  if (session.get("state") !== state) {
    throw new Error("invalid state params");
  }

  const res = await getAccessToken(code);
  if (res.status !== 200) {
    throw new Error(
      `Something wrong while getting access token (${res.status})`
    );
  }

  const resJson = await res.json();
  if (!isAccessTokenResponse(resJson)) {
    throw new Error(
      `Invalid access token response (${JSON.stringify(resJson)})`
    );
  }

  session.set("access_token", resJson.access_token);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function SigninCallback() {
  return (
    <main>
      <h2>Callback...</h2>
    </main>
  );
}
