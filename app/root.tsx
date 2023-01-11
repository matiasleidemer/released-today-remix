import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";

export function links() {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Released.today",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en" data-theme="forest">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
