import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Loader2, 
  Search, 
  Plus, 
  MoreHorizontal, 
  UserCog, 
  Mail, 
  CreditCard,
  BarChart3,
  FileText,
  Trash2,
  Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  graduated: boolean;
  subscription_status: "active" | "pending" | "inactive";
  role: "member" | "admin";
  created_at: string;
}

export default function AdminMembersPage() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [graduationFilter, setGraduationFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch members
  const { data: members, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/users'],
    enabled: !!user && user.role === "admin",
  });

  if (!user || user.role !== "admin") return null;

  // Filter members based on search and filters
  const filteredMembers = members?.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.occupation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      member.subscription_status === statusFilter;
    
    const matchesGraduation = 
      graduationFilter === "all" || 
      (graduationFilter === "yes" && member.graduated) ||
      (graduationFilter === "no" && !member.graduated);
    
    return matchesSearch && matchesStatus && matchesGraduation;
  });

  const exportMembers = () => {
    // In a real implementation, we would call an API to generate a CSV file
    toast({
      title: "Exportação iniciada",
      description: "A exportação dos dados dos associados foi iniciada. O download começará em breve.",
    });
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) return;
    
    try {
      await apiRequest("DELETE", `/api/users/${selectedMember.id}`);
      
      toast({
        title: "Associado excluído",
        description: `${selectedMember.name} foi excluído com sucesso.`,
      });
      
      refetch();
      setShowDeleteDialog(false);
      setSelectedMember(null);
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o associado. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Adimplente</Badge>;
      case "pending":
        return <Badge className="bg-amber-500">Pendente</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inadimplente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciamento de Associados</h1>
          <p className="text-gray-600">
            Administre todos os membros da UBPCT
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={exportMembers}
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button className="flex items-center gap-2 bg-primary">
            <Plus className="h-4 w-4" />
            Adicionar Associado
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Filtros e Busca</CardTitle>
          <CardDescription>
            Encontre associados específicos usando os filtros abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Buscar por nome, email ou ocupação..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Adimplentes</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="inactive">Inadimplentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-48">
              <Select value={graduationFilter} onValueChange={setGraduationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Graduação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="yes">Graduados</SelectItem>
                  <SelectItem value="no">Não Graduados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Lista de Associados</CardTitle>
          <CardDescription>
            {filteredMembers ? `${filteredMembers.length} associados encontrados` : 'Carregando...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">
                Ocorreu um erro ao carregar os associados. Por favor, tente novamente mais tarde.
              </p>
              <Button 
                onClick={() => refetch()} 
                variant="outline"
              >
                Tentar novamente
              </Button>
            </div>
          ) : filteredMembers && filteredMembers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ocupação</TableHead>
                    <TableHead>Graduado</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.occupation}</TableCell>
                      <TableCell>{member.graduated ? "Sim" : "Não"}</TableCell>
                      <TableCell>{getStatusBadge(member.subscription_status)}</TableCell>
                      <TableCell>{formatDate(member.created_at)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigate(`/admin/members/${member.id}/edit`)}>
                              <UserCog className="h-4 w-4 mr-2" />
                              Editar Dados
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/members/${member.id}/credentials`)}>
                              <CreditCard className="h-4 w-4 mr-2" />
                              Ver Credencial
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/members/${member.id}/payments`)}>
                              <BarChart3 className="h-4 w-4 mr-2" />
                              Histórico Financeiro
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/members/${member.id}/certificates`)}>
                              <FileText className="h-4 w-4 mr-2" />
                              Certificados
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => window.location.href = `mailto:${member.email}`}>
                              <Mail className="h-4 w-4 mr-2" />
                              Enviar Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                setSelectedMember(member);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
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
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">
                Nenhum associado encontrado com os filtros atuais.
              </p>
              {(searchTerm || statusFilter !== "all" || graduationFilter !== "all") && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setGraduationFilter("all");
                  }}
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t p-4 flex justify-between">
          <div className="text-sm text-gray-500">
            Total: {members?.length || 0} associados
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Você está prestes a excluir o associado <span className="font-semibold">{selectedMember?.name}</span>. 
              Esta ação não pode ser desfeita e excluirá todos os dados relacionados a este associado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteMember}
            >
              Excluir Associado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
