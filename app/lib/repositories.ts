import { query } from "./graphql";

export async function getRepository(
  accessToken: string,
  name: string,
  owner: string
) {
  return query(
    /* GraphQL */ `
      query ($name: String!, $owner: String!) {
        repository(name: $name, owner: $owner) {
          owner {
            login
          }
          name
          url
          isPrivate
          stargazerCount
        }
      }
    `,
    accessToken,
    { name, owner }
  );
}
