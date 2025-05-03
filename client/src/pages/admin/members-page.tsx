import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Download, UserPlus, Edit, Trash2, UserCheck, UserX, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminMembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["/api/users"],
    queryFn: getQueryFn(),
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: number) => {
      return await apiRequest("DELETE", `/api/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Usuário excluído",
        description: "O associado foi excluído com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o associado.",
        variant: "destructive",
      });
    },
  });

  // Filtrar os usuários
  const filteredUsers = Array.isArray(users) 
    ? users.filter((user: any) => {
        const matchesSearch = searchQuery === "" || 
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.cpf?.includes(searchQuery);
        
        const matchesStatus = statusFilter === "all" || 
          user.subscription_status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
    : [];

  // Função para exportar dados dos associados
  const exportMembersData = () => {
    if (!Array.isArray(users) || users.length === 0) {
      toast({
        title: "Sem dados para exportar",
        description: "Não há dados de associados para exportar.",
        variant: "destructive",
      });
      return;
    }

    // Criar CSV com dados
    const headers = ["Nome", "Email", "CPF", "Telefone", "Ocupação", "Status", "Data de Cadastro"];
    const csvData = [
      headers.join(','),
      ...filteredUsers.map((user: any) => [
        user.name,
        user.email,
        user.cpf,
        user.phone,
        user.occupation,
        user.subscription_status === "active" ? "Adimplente" : "Inadimplente",
        new Date(user.created_at).toLocaleDateString('pt-BR')
      ].join(','))
    ].join('\n');

    // Criar e baixar arquivo
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `associados-ubpct-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para confirmar exclusão do usuário
  const handleDeleteUser = (userId: number) => {
    if (confirm("Tem certeza que deseja excluir este associado? Esta ação não poderá ser desfeita.")) {
      deleteMutation.mutate(userId);
    }
  };

  return (
    <AdminShell title="Gestão de Associados">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
          <CardDescription>
            Pesquise e filtre os associados por nome, email, CPF ou status de pagamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nome, email ou CPF..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Adimplentes</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="gap-2" onClick={exportMembersData}>
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Novo Associado</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar novo associado</DialogTitle>
                  <DialogDescription>
                    Esta funcionalidade está em desenvolvimento. Por enquanto, associados podem ser cadastrados pela página pública de inscrição.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Associados</CardTitle>
          <CardDescription>
            Total: {filteredUsers.length} associados{" "}
            {statusFilter !== "all" && (
              <>
                ({statusFilter === "active" ? "adimplentes" : statusFilter === "pending" ? "pendentes" : "inativos"})
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Associado</TableHead>
                    <TableHead>Ocupação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.photo_url} alt={user.name} />
                            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.occupation}
                        {user.graduated && <span className="ml-1 text-xs text-muted-foreground">(Graduado)</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          user.subscription_status === "active" 
                            ? "success" 
                            : user.subscription_status === "pending" 
                              ? "default" 
                              : "destructive"
                        }>
                          {user.subscription_status === "active" 
                            ? "Adimplente" 
                            : user.subscription_status === "pending" 
                              ? "Pendente" 
                              : "Inadimplente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <span className="sr-only">Abrir menu</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editar Dados</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CreditCard className="mr-2 h-4 w-4" />
                              <span>Gerenciar Pagamento</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.subscription_status === "active" ? (
                              <DropdownMenuItem>
                                <UserX className="mr-2 h-4 w-4" />
                                <span>Marcar como Inadimplente</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <UserCheck className="mr-2 h-4 w-4" />
                                <span>Marcar como Adimplente</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive" 
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Excluir</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum associado encontrado com os filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}