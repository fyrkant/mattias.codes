import {
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "remix";
import type { MetaFunction } from "remix";
import stylesUrl from "~/styles/root.css";
import { getCssText } from "./stitches.config";

export const meta: MetaFunction = () => {
  return {
    title: "mattias.codes",
    description: "This is my blog. I am Mattias. I write the codes.",
  };
};

export const links: LinksFunction = () => {
  console.log(stylesUrl);
  return [
    {
      rel: "stylesheet",
      href: stylesUrl,
    },
    { rel: "stylesheet", href: "styles.css" },
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        {process.env.NODE_ENV === "development" && <LiveReload />}
        <Scripts />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>
          {caught.status} {caught.statusText}
        </h1>
        <Scripts />
      </body>
    </html>
  );
}
