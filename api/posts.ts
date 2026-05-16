import type { VercelRequest, VercelResponse } from "@vercel/node";
import { proxyToApiGateway } from "./_lib/proxy.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await proxyToApiGateway(req, res, "/posts");
}
