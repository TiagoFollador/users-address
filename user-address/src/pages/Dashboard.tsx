import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contactsApi, isAuthenticated } from '../lib/api';
import type { Contact } from '../lib/types';
import { ContactList } from '../components/ContactList';
import { DynamicMap } from '../components/DynamicMap';
import { Header } from '../components/Header';

export default function Dashboard() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

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
  } = useQuery({
    queryKey: ['contacts'],
    queryFn: contactsApi.getAll,
    enabled: isAuthenticated(), // Só executa se estiver autenticado
  });

  const contacts = contactsResponse?.data || [];

  // Selecionar primeiro contato quando a lista carrega
  useEffect(() => {
    if (contacts.length > 0 && !selectedContact) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts, selectedContact]);

  if (!isAuthenticated()) {
    return null; // Ou um loading spinner
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <div className="w-[400px] flex-shrink-0 overflow-y-auto p-4 border-r">
          <ContactList
            contacts={contacts}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onSelectContact={(contact) => setSelectedContact(contact)}
            selectedContactId={selectedContact?.id}
          />
        </div>
        <div className="flex-1">
          <DynamicMap contact={selectedContact} />
        </div>
      </main>
    </div>
  );
}
