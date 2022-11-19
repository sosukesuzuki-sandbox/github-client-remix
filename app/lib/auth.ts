const WEBSITE_URL = "http://localhost:3000";
const GITHUB_BASE_URL = "https://github.com";

// https://docs.github.com/ja/developers/apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
export function authorize(login: string, state: string): Promise<Response> {
  const url = `${GITHUB_BASE_URL}/login/oauth/authorize`;
  const scope = "read:user, read:org";
  const params = new URLSearchParams([
    ["client_id", process.env.GITHUB_CLIENT_ID!],
    ["login", login],
    ["scope", scope],
    ["state", state],
  ]);
  return fetch(`${url}?${params}`);
}

// https://docs.github.com/ja/developers/apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github
export function getAccessToken(code: string): Promise<Response> {
  const url = `${GITHUB_BASE_URL}/login/oauth/access_token`;
  const params = new URLSearchParams([
    ["client_id", process.env.GITHUB_CLIENT_ID!],
    ["client_secret", process.env.GITHUB_CLIENT_SECRET!],
    ["code", code],
  ]);
  const headers = new Headers([["Accept", "application/json"]]);
  return fetch(`${url}?${params}`, { method: "post", headers });
}

export interface AccessTokenResponse {
  access_token: string;
  scope: string;
  token_type: "bearer";
}
export function isAccessTokenResponse(
  value: any
): value is AccessTokenResponse {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value["access_token"] === "string" &&
    typeof value["scope"] === "string" &&
    value["token_type"] === "bearer"
  );
}
