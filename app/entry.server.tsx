import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import type { EntryContext } from "remix";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  // This redirects users from HTTP to HTTPS
  const proto = request.headers.get("X-Forwarded-Proto");
  if (proto === "http") {
    const u = new URL(request.url);
    u.protocol = "https";
    const response = new Response("", {
      status: 302,
      headers: { Location: u.toString() },
    });

    return response;
  }

  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
