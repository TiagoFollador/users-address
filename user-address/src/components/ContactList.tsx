import type { Contact } from '../lib/types';

interface Props {
  contacts: Contact[];
  isLoading?: boolean;
  selectedContactId?: number | null;
  onSelectContact: (contact: Contact) => void;
}

export function ContactList({ contacts, isLoading = false, selectedContactId, onSelectContact }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-bold mb-4">Contatos</h2>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold mb-4">Contatos</h2>
      {contacts.map(contact => (
        <div
          key={contact.id}
          onClick={() => onSelectContact(contact)}
          className={`p-3 rounded-lg cursor-pointer border ${
            selectedContactId === contact.id
              ? 'bg-blue-100 border-blue-400'
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          <p className="font-semibold">{contact.name}</p>
          <p className="text-sm text-gray-600">{contact.cpf}</p>
          <p className="text-sm text-gray-500">{contact.street}, {contact.number}</p>
        </div>
      ))}
    </div>
  );
}

export default ContactList;
