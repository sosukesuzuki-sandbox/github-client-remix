import type { LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Outlet, useLoaderData, NavLink } from "@remix-run/react";
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

export default function RepositoriesIndex() {
  const { totalCount, nodes, endCursor, hasNextPage } = useLoaderData();
  return (
    <main>
      <h2>Repositories</h2>
      <div>
        <p>total count: {totalCount}</p>
        <Outlet />
        <div>
          {nodes.map(
            ({ name, owner }: { name: string; owner: { login: string } }) => {
              const repositoryName = `${owner.login}/${name}`;
              const repositoryId = encodeURIComponent(repositoryName);
              return (
                <div key={repositoryName} style={{ border: "1px solid black" }}>
                  <p>
                    <NavLink to={`/repositories/${repositoryId}`}>
                      {repositoryName}
                    </NavLink>
                  </p>
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
