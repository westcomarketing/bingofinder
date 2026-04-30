import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = () => {
  const body =
    `User-agent: *\nAllow: /\n\nSitemap: https://bingofinder.com/sitemap.xml\n`;
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
};
