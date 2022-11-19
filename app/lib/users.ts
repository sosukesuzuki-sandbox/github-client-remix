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
