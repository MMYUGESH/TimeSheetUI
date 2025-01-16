import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "backend/src/trpc/router";

export const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    return "/trpc";
  }

  if (import.meta.env.PROD && import.meta.env.VITE_PUBLIC_API_URL) {
    return `${import.meta.env.VITE_PUBLIC_API_URL}/trpc`;
  }

  return "/trpc";
};

export const getIsLoggerEnabled = () => () => {
  if (import.meta.env.PROD) {
    return false;
  }

  return true;
};

export const trpc = createTRPCReact<AppRouter>();
