import { useEffect, useState } from 'react';
import { getContacts } from '../lib/api';
import type { Contact } from '../lib/types';
import { ContactList } from '../components/ContactList';
import { Map } from '../components/Map';
import { Header } from '../components/Header';

export function Dashboard() {
  // ESTADO TEMPORÁRIO - Será substituído pelo useQuery
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    // Lógica que o useQuery fará automaticamente
    setIsLoading(true);
    getContacts()
      .then(data => {
        setContacts(data);
        if (data.length > 0) {
          setSelectedContact(data[0]); // Seleciona o primeiro contato por padrão
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Quando usar o TanStack Query, ficará assim:
  /*
  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
  });
  */

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <div className="w-1/3 overflow-y-auto p-4 border-r">
          <h2 className="text-2xl font-bold mb-4">Contatos</h2>
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            <ContactList
              contacts={contacts}
              onSelectContact={handleSelectContact}
              selectedContactId={selectedContact?.id}
            />
          )}
        </div>
        <div className="w-2/3">
          <Map contact={selectedContact} />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
