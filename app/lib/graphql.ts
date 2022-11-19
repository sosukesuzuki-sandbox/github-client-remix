const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

export async function query(
  queryStr: string,
  accessToken: string,
  variables?: any
) {
  const res = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: "post",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify({
      query: queryStr,
      variables,
    }),
  });
  return res.json();
}
