import { query } from "./graphql";

export async function getViewerImageUrl(accessToken: string) {
  return query(
    /* GraphQL */ `
      query {
        viewer {
          avatarUrl
        }
      }
    `,
    accessToken
  );
}

export async function getViewerRepositories(
  accessToken: string,
  endCursor?: string
) {
  return query(
    /* GraphQL */ `
      query ($endCursor: String) {
        viewer {
          repositories(
            first: 100
            affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]
            after: $endCursor
          ) {
            totalCount
            pageInfo {
              endCursor
              hasNextPage
            }
            nodes {
              name
              owner {
                login
              }
            }
          }
        }
      }
    `,
    accessToken,
    { endCursor }
  );
}
