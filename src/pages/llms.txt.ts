import type { APIRoute } from "astro";
import { llmsHeader, pageList } from "../lib/llms";
import { site } from "../site.config";

export const GET: APIRoute = async () => {
  const body = `${llmsHeader()}
## Pages
${pageList()}

## Optional
- [Full text with FAQ answers](${site.url}/llms-full.txt)
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
