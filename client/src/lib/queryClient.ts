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
      
      // Configurar opções da requisição para garantir que os cookies de sessão sejam enviados
      const requestOptions: RequestInit = {
        credentials: 'include', // Isso garante que os cookies sejam enviados com a requisição
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      };
      
      // Prosseguir com a requisição principal
      const res = await fetch(url, requestOptions);

      if (res.status === 401) {
        console.warn(`Acesso não autenticado para ${url}`);
        if (options.on401 === "returnNull") {
          return null;
        } else {
          // Se a URL for /api/user, não vamos redirecionar para auth
          if (url === '/api/user') {
            return null;
          }
          
          // Redirecionar para página de login
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
            console.log('Redirecionando para /auth devido a erro 401');
            // window.location.href = '/auth';
          }
          throw new Error("Usuário não autenticado. Por favor, faça login para continuar.");
        }
      }

      if (res.status === 503) {
        throw new Error("Servidor temporariamente indisponível. Por favor, tente novamente em alguns instantes.");
      }

      if (!res.ok) {
        throw new Error(`Erro ao acessar ${url}: ${res.statusText}`);
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