let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getCognitoToken(): Promise<string> {
  // Reuse token if it's still valid (refresh 60s before expiry)
  if (cachedToken && Date.now() < tokenExpiry - 60_000) {
    return cachedToken;
  }

  const { COGNITO_TOKEN_URL, COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, COGNITO_SCOPE } = process.env;
  const credentials = Buffer.from(`${COGNITO_CLIENT_ID}:${COGNITO_CLIENT_SECRET}`).toString("base64");

  const response = await fetch(COGNITO_TOKEN_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: `grant_type=client_credentials&scope=${encodeURIComponent(COGNITO_SCOPE!)}`,
  });

  if (!response.ok) {
    throw new Error(`Cognito token fetch failed: ${response.status}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;
  return cachedToken;
}
