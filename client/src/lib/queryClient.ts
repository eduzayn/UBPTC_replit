import { QueryClient } from "@tanstack/react-query";

interface GetQueryFnOptions {
  on401?: "throw" | "returnNull";
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

export function getQueryFn(options: GetQueryFnOptions = {}) {
  return async ({ queryKey }: { queryKey: any }) => {
    const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;
    const res = await fetch(url);

    if (res.status === 401) {
      if (options.on401 === "returnNull") {
        return null;
      } else {
        throw new Error("Unauthorized");
      }
    }

    if (!res.ok) {
      throw new Error(`Error fetching ${url}: ${res.statusText}`);
    }

    return res.json();
  };
}

export async function apiRequest(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  body?: any
) {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(url, options);
}