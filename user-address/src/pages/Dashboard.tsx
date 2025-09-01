import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contactsApi, isAuthenticated, type ContactsParams } from '../lib/api';
import type { Contact } from '../lib/types';
import { ContactList } from '../components/ContactList';
import { DynamicMap } from '../components/DynamicMap';
import { Header } from '../components/Header';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function Dashboard() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ContactsParams>({
    page: 1,
    per_page: 15,
    order_by: 'name',
    order_direction: 'asc',
  });

  // Verificar autenticação
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
  }, []);

  // Usar TanStack Query para buscar contatos
  const {
    data: contactsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['contacts', filters],
    queryFn: () => contactsApi.getAll(filters),
    enabled: isAuthenticated(), // Só executa se estiver autenticado
  });

  const contacts = contactsResponse?.data?.data || [];
  const pagination = contactsResponse?.data ? {
    currentPage: contactsResponse.data.current_page,
    lastPage: contactsResponse.data.last_page,
    perPage: contactsResponse.data.per_page,
    total: contactsResponse.data.total,
    from: contactsResponse.data.from,
    to: contactsResponse.data.to,
  } : null;

  // Selecionar primeiro contato quando a lista carrega
  useEffect(() => {
    if (contacts.length > 0 && !selectedContact) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts, selectedContact]);

  // Função para aplicar busca
  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm || undefined,
      page: 1, // Reset para primeira página ao buscar
    }));
  };

  // Função para limpar busca
  const handleClearSearch = () => {
    setSearchTerm('');
    setFilters(prev => ({
      ...prev,
      search: undefined,
      page: 1,
    }));
  };

  // Função para mudar página
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Função para mudar ordenação
  const handleSortChange = (orderBy: string) => {
    setFilters(prev => ({
      ...prev,
      order_by: orderBy as any,
      order_direction: prev.order_by === orderBy && prev.order_direction === 'asc' ? 'desc' : 'asc',
      page: 1,
    }));
  };

  if (!isAuthenticated()) {
    return null; // Ou um loading spinner
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <div className="w-[400px] flex-shrink-0 overflow-y-auto p-4 border-r">
          {/* Seção de busca */}
          <div className="mb-4 space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Buscar por nome, email, telefone ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} variant="outline" className="whitespace-nowrap">
                Buscar
              </Button>
            </div>
            {filters.search && (
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Buscando por: "{filters.search}"</span>
                <button
                  onClick={handleClearSearch}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Limpar
                </button>
              </div>
            )}
          </div>

          <ContactList
            contacts={contacts}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onSelectContact={(contact) => setSelectedContact(contact)}
            selectedContactId={selectedContact?.id}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSortChange={handleSortChange}
            currentSort={{
              field: filters.order_by || 'name',
              direction: filters.order_direction || 'asc',
            }}
          />
        </div>
        <div className="flex-1">
          <DynamicMap contact={selectedContact} />
        </div>
      </main>
    </div>
  );
}
