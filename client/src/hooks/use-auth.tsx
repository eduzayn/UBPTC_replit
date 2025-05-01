import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "email" | "password"> & {
  isAdmin?: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo de volta, ${user.name}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Falha no login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", userData);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Sua conta foi criada com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Falha no cadastro",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Falha no logout",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    // Create mock mutations for components outside of AuthProvider
    // This allows components like SignupSection to be rendered without errors
    const { toast } = useToast();
    
    const registerMutation = useMutation({
      mutationFn: async (userData: InsertUser) => {
        const res = await apiRequest("POST", "/api/register", userData);
        return await res.json();
      },
      onSuccess: (user: User) => {
        queryClient.setQueryData(["/api/user"], user);
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Sua conta foi criada com sucesso!",
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Falha no cadastro",
          description: error.message || "Tente novamente mais tarde.",
          variant: "destructive",
        });
      },
    });

    const loginMutation = useMutation({
      mutationFn: async (credentials: LoginData) => {
        const res = await apiRequest("POST", "/api/login", credentials);
        return await res.json();
      },
      onSuccess: (user: User) => {
        queryClient.setQueryData(["/api/user"], user);
      },
      onError: (error: Error) => {
        console.error("Login error:", error);
      },
    });

    const logoutMutation = useMutation({
      mutationFn: async () => {
        await apiRequest("POST", "/api/logout");
      },
      onSuccess: () => {
        queryClient.setQueryData(["/api/user"], null);
      },
      onError: (error: Error) => {
        console.error("Logout error:", error);
      },
    });

    return {
      user: null,
      isLoading: false,
      error: null,
      loginMutation,
      logoutMutation,
      registerMutation,
    };
  }
  
  return context;
}
