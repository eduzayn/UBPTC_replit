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
    try {
      const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;
      
      // Primeiro, tentamos verificar a saúde do servidor
      const healthCheck = await fetch("/api/health");
      
      // Se o servidor não estiver disponível, retornamos um erro claro
      if (healthCheck.status === 503) {
        throw new Error("Servidor temporariamente indisponível. Por favor, tente novamente em alguns instantes.");
      }
      
      // Prosseguir com a requisição principal
      const res = await fetch(url);

      if (res.status === 401) {
        if (options.on401 === "returnNull") {
          return null;
        } else {
          throw new Error("Unauthorized");
        }
      }

      if (res.status === 503) {
        throw new Error("Servidor temporariamente indisponível. Por favor, tente novamente em alguns instantes.");
      }

      if (!res.ok) {
        throw new Error(`Error fetching ${url}: ${res.statusText}`);
      }

      return res.json();
    } catch (error) {
      console.error("Query error:", error);
      throw error;
    }
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