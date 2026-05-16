import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getCognitoToken } from "./cognito.js";

export async function proxyToApiGateway(
  req: VercelRequest,
  res: VercelResponse,
  path: string
): Promise<void> {
  const token = await getCognitoToken();
  const url = `${process.env.API_GATEWAY_URL}${path}`;

  const hasBody = ["POST", "PUT", "PATCH"].includes(req.method ?? "");

  const response = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: hasBody ? JSON.stringify(req.body) : undefined,
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
