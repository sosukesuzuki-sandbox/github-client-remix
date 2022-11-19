import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getRepository } from "~/lib/repositories";
import { getSession } from "~/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const accessToken = session.get("access_token");
  if (!accessToken) {
    return redirect("/signin");
  }

  const repositoryId = params.repositoryId!;
  // owner/name
  const repositoryOwnerName = decodeURIComponent(repositoryId);
  const [owner, name] = repositoryOwnerName.split("/");

  const repository = (await getRepository(accessToken, name, owner)).data
    .repository;
  return json({ repository });
};

export default function Repository() {
  const {
    repository: { owner, name, url, isPrivate, stargazerCount },
  } = useLoaderData<{
    repository: {
      owner: { login: string };
      name: string;
      url: string;
      isPrivate: boolean;
      stargazerCount: number;
    };
  }>();
  return (
    <main>
      <h2>
        {owner.login}/{name}
      </h2>
      <p>
        GitHub URL: <a href={url}>{url}</a>
      </p>
      <p>Stars: {stargazerCount}</p>
      <p>{isPrivate ? "Private" : "Public"}</p>
    </main>
  );
}
