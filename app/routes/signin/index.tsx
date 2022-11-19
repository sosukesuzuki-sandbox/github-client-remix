import { Form } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { authorize } from "~/lib/auth";
import { getRandomString } from "~/lib/random";
import { commitSession, getSession } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const username = body.get("username");
  if (!username) {
    throw new Error("missing username");
  }

  const session = await getSession(request.headers.get("Cookie"));
  const state = getRandomString(16);
  session.set("state", state);

  const res = await authorize(username.toString(), state);
  if (res.status !== 200) {
    throw new Error(`Something wrong while authorization (${res.status})`);
  }

  return redirect(res.url, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Signin() {
  return (
    <main>
      <h1>GitHub Client built with Remix!</h1>
      <h2>
        Sign in to <a href="https://github.com">GitHub</a>
      </h2>
      <Form method="post">
        <p>
          <label htmlFor="username">user name</label>
          <input type="text" name="username" />
        </p>
        <input type="submit" value="Sign In" />
      </Form>
    </main>
  );
}
