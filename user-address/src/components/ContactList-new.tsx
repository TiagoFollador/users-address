import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Contact } from '../lib/types';
import { contactsApi } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from './ui/dialog';
import { useToast } from '../hooks/use-toast';
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number;
  to: number;
}

interface SortInfo {
  field: string;
  direction: 'asc' | 'desc';
}

interface Props {
  contacts: Contact[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  selectedContactId?: number | null;
  onSelectContact: (contact: Contact) => void;
  pagination?: PaginationInfo | null;
  onPageChange?: (page: number) => void;
  onSortChange?: (field: string) => void;
  currentSort?: SortInfo;
}

export function ContactList({ 
  contacts, 
  isLoading = false, 
  isError = false, 
  error, 
  selectedContactId, 
  onSelectContact,
  pagination,
  onPageChange,
  onSortChange,
  currentSort,
}: Props) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-bold mb-4">Contatos</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-bold mb-4">Contatos</h2>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">
            Erro ao carregar contatos: {error?.message || 'Erro desconhecido'}
          </p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Contatos</h2>
        <ContactFormDialog />
      </div>

      {/* Sorting controls */}
      {onSortChange && (
        <div className="flex gap-2 mb-4 text-sm">
          <span className="text-gray-600">Ordenar por:</span>
          {['name', 'email', 'city', 'created_at'].map((field) => (
            <button
              key={field}
              onClick={() => onSortChange(field)}
              className={`flex items-center gap-1 px-2 py-1 rounded ${
                currentSort?.field === field 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {field === 'name' && 'Nome'}
              {field === 'email' && 'Email'}
              {field === 'city' && 'Cidade'}
              {field === 'created_at' && 'Data'}
              {currentSort?.field === field && (
                currentSort.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Pagination info */}
      {pagination && (
        <div className="text-sm text-gray-600 mb-4">
          Mostrando {pagination.from} a {pagination.to} de {pagination.total} contatos
        </div>
      )}

      {contacts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Nenhum contato encontrado</p>
          <ContactFormDialog />
        </div>
      ) : (
        <div className="space-y-2">
          {contacts.map(contact => (
            <ContactCard
              key={contact.id}
              contact={contact}
              isSelected={selectedContactId === contact.id}
              onSelect={() => onSelectContact(contact)}
            />
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {pagination && onPageChange && pagination.lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, pagination.lastPage) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={pagination.currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            {pagination.lastPage > 5 && (
              <>
                <span className="px-2 py-1">...</span>
                <Button
                  variant={pagination.currentPage === pagination.lastPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pagination.lastPage)}
                >
                  {pagination.lastPage}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.lastPage}
          >
            Próxima
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function ContactFormDialog({ contact }: { contact?: Contact }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    cpf: contact?.cpf || '',
    phone: contact?.phone || '',
    cep: contact?.cep || '',
    street: contact?.street || '',
    number: contact?.number || '',
    complement: contact?.complement || '',
    neighborhood: contact?.neighborhood || '',
    city: contact?.city || '',
    state: contact?.state || '',
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: contactsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setOpen(false);
      setFormData({
        name: '', email: '', cpf: '', phone: '', cep: '', street: '', number: '',
        complement: '', neighborhood: '', city: '', state: ''
      });
      toast({
        title: "Contato criado com sucesso!",
        description: "O novo contato foi adicionado à lista.",
      });
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao criar contato",
          description: "Ocorreu um erro ao salvar o contato.",
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => contactsApi.update(contact!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setOpen(false);
      toast({
        title: "Contato atualizado com sucesso!",
        description: "As alterações foram salvas.",
      });
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar contato",
          description: "Ocorreu um erro ao salvar as alterações.",
        });
      }
    },
  });

  const searchCepMutation = useMutation({
    mutationFn: contactsApi.searchCep,
    onSuccess: (response) => {
      if (response.success && response.data) {
        setFormData(prev => ({
          ...prev,
          street: response.data!.address,
          neighborhood: response.data!.neighborhood,
          city: response.data!.city,
          state: response.data!.state,
        }));
        toast({
          title: "CEP encontrado!",
          description: "Endereço preenchido automaticamente.",
        });
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "CEP não encontrado",
        description: "Verifique o CEP e tente novamente.",
      });
    },
  });

  const handleCepBlur = () => {
    if (formData.cep.length >= 8) {
      searchCepMutation.mutate({ zip_code: formData.cep });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (contact) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {contact ? (
          <Button variant="ghost" size="icon">
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Contato
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {contact ? 'Editar Contato' : 'Novo Contato'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome completo"
                required
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
                required
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email[0]}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">CPF</label>
              <Input
                value={formData.cpf}
                onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                placeholder="000.000.000-00"
                required
              />
              {errors.cpf && <p className="text-sm text-red-600">{errors.cpf[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(00) 00000-0000"
                required
              />
              {errors.phone && <p className="text-sm text-red-600">{errors.phone[0]}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">CEP</label>
            <Input
              value={formData.cep}
              onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
              onBlur={handleCepBlur}
              placeholder="00000-000"
              required
            />
            {searchCepMutation.isPending && <p className="text-sm text-blue-600">Buscando CEP...</p>}
            {errors.cep && <p className="text-sm text-red-600">{errors.cep[0]}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Rua</label>
              <Input
                value={formData.street}
                onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                placeholder="Nome da rua"
                required
              />
              {errors.street && <p className="text-sm text-red-600">{errors.street[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Número</label>
              <Input
                value={formData.number}
                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                placeholder="123"
                required
              />
              {errors.number && <p className="text-sm text-red-600">{errors.number[0]}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Complemento</label>
            <Input
              value={formData.complement}
              onChange={(e) => setFormData(prev => ({ ...prev, complement: e.target.value }))}
              placeholder="Apartamento, sala, etc. (opcional)"
            />
            {errors.complement && <p className="text-sm text-red-600">{errors.complement[0]}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bairro</label>
              <Input
                value={formData.neighborhood}
                onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                placeholder="Bairro"
                required
              />
              {errors.neighborhood && <p className="text-sm text-red-600">{errors.neighborhood[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cidade</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Cidade"
                required
              />
              {errors.city && <p className="text-sm text-red-600">{errors.city[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                placeholder="UF"
                required
              />
              {errors.state && <p className="text-sm text-red-600">{errors.state[0]}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : contact ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ContactCard({ contact, isSelected, onSelect }: {
  contact: Contact;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => contactsApi.delete(contact.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({
        title: "Contato excluído",
        description: "O contato foi removido da lista.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir contato",
        description: "Ocorreu um erro ao remover o contato.",
      });
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir este contato?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded-lg cursor-pointer border transition-colors ${
        isSelected
          ? 'bg-blue-100 border-blue-400'
          : 'bg-white hover:bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-semibold">{contact.name}</p>
          <p className="text-sm text-gray-600">{contact.email}</p>
          <p className="text-sm text-gray-600">{contact.cpf}</p>
          <p className="text-sm text-gray-500">{contact.street}, {contact.number}</p>
          <p className="text-sm text-gray-500">{contact.city} - {contact.state}</p>
        </div>
        <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
          <ContactFormDialog contact={contact} />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}
