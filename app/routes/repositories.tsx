import type { LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { NavLink } from "react-router-dom";
import { getViewerRepositories } from "~/lib/viewer";
import { getSession } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const accessToken = session.get("access_token");
  if (!accessToken) {
    return redirect("/signin");
  }
  const url = new URL(request.url);
  const endCursorParam = url.searchParams.get("endCursor") ?? undefined;
  const {
    totalCount,
    nodes,
    pageInfo: { endCursor, hasNextPage },
  } = (await getViewerRepositories(accessToken, endCursorParam)).data.viewer
    .repositories;
  return json({
    totalCount,
    nodes,
    endCursor,
    hasNextPage,
  });
};

export default function Repositories() {
  const { totalCount, nodes, endCursor, hasNextPage } = useLoaderData();
  return (
    <main>
      <h2>Repositories</h2>
      <div>
        <p>total count: {totalCount}</p>
        <div>
          {nodes.map(
            ({ name, owner }: { name: string; owner: { login: string } }) => {
              const repositoryName = `${owner.login}/${name}`;
              return (
                <div key={repositoryName} style={{ border: "1px solid black" }}>
                  <p>{repositoryName}</p>
                </div>
              );
            }
          )}
        </div>
        {hasNextPage ? (
          <div>
            <NavLink to={`?endCursor=${endCursor}`}>To next page</NavLink>
          </div>
        ) : null}
      </div>
    </main>
  );
}
