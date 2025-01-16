import type { Route } from "@frontend/+types/root";
import stylesheet from "@frontend/index.css?url";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import icon from "/vite.svg?url";
import { Toaster } from "@frontend/ui/toaster"
import { ThemeProvider, ThemeContext } from "@frontend/hooks/theme-mode-context"


export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: icon },
  { rel: "stylesheet", href: stylesheet },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export const Root = () => {
  const [queryClient] = React.useState(() => new QueryClient());
  const themeValue = ThemeProvider();


  return (

    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={themeValue}>
        <Outlet />
      </ThemeContext.Provider>
      <Toaster />
    </QueryClientProvider>

  );
};

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
};

export default Root;
