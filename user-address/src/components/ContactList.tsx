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
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Props {
  contacts: Contact[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  selectedContactId?: number | null;
  onSelectContact: (contact: Contact) => void;
}

export function ContactList({ 
  contacts, 
  isLoading = false, 
  isError = false, 
  error, 
  selectedContactId, 
  onSelectContact 
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
      {contacts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Nenhum contato encontrado</p>
          <ContactFormDialog />
        </div>
      ) : (
        contacts.map(contact => (
          <ContactCard
            key={contact.id}
            contact={contact}
            isSelected={selectedContactId === contact.id}
            onSelect={() => onSelectContact(contact)}
          />
        ))
      )}
    </div>
  );
}

function ContactFormDialog({ contact }: { contact?: Contact }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    cpf: contact?.cpf || '',
    phone: contact?.phone || '',
    cep: contact?.cep || '',
    street: contact?.street || '',
    number: contact?.number || '',
    complement: contact?.complement || '',
    neighborhood: contact?.neighborhood || '',
    city: contact?.city || '',
    state: contact?.state || '',
    latitude: contact?.latitude || 0,
    longitude: contact?.longitude || 0,
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
        name: '', cpf: '', phone: '', cep: '', street: '', number: '',
        complement: '', neighborhood: '', city: '', state: '', latitude: 0, longitude: 0
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
    mutationFn: (data: Partial<Contact>) => contactsApi.update(contact!.id, data),
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
          street: response.data!.street,
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
    if (formData.cep.length === 10) { // Formato: 00000-000
      searchCepMutation.mutate({ cep: formData.cep });
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
              <label className="block text-sm font-medium mb-1">CPF</label>
              <Input
                value={formData.cpf}
                onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                placeholder="000.000.000-00"
                required
              />
              {errors.cpf && <p className="text-sm text-red-600">{errors.cpf[0]}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
