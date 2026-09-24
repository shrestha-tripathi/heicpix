import type { APIRoute } from "astro";
import { llmsHeader, pageList } from "../lib/llms";
import { faqs } from "../data/faqs";

export const GET: APIRoute = async () => {
  const faq = faqs.map((f) => `### ${f.q}\n${f.a}`).join("\n\n");
  const body = `${llmsHeader()}
## Pages
${pageList()}

## FAQ
${faq}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
