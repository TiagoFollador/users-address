import { useEffect, useState } from 'react';
import { getContacts } from '../lib/api';
import type { Contact } from '../lib/types';
import { ContactList } from '../components/ContactList';
import { DynamicMap } from '../components/DynamicMap';
import { Header } from '../components/Header';

export default function Dashboard() {
  // Estado que será substituído pelo TanStack Query
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    // Simula o fetch de dados que o useQuery fará
    setIsLoading(true);
    getContacts().then(data => {
      setContacts(data);
      if (data.length > 0) {
        setSelectedContact(data[0]); // Seleciona o primeiro por padrão
      }
    }).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <div className="w-[400px] flex-shrink-0 overflow-y-auto p-4 border-r">
          <ContactList
            contacts={contacts}
            isLoading={isLoading}
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
