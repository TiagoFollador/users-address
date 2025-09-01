import type { Contact } from './types';

export const MOCKED_CONTACTS: Contact[] = [
  { id: 1, name: 'Alice Rodrigues', cpf: '111.222.333-44', phone: '(41) 99999-1111', cep: '80010-010', street: 'Rua das Flores', number: '123', neighborhood: 'Centro', city: 'Curitiba', state: 'PR', latitude: -25.4284, longitude: -49.2733 },
  { id: 2, name: 'Bruno Carvalho', cpf: '222.333.444-55', phone: '(11) 98888-2222', cep: '01001-000', street: 'Praça da Sé', number: '100', neighborhood: 'Sé', city: 'São Paulo', state: 'SP', latitude: -23.5505, longitude: -46.6333 },
  { id: 3, name: 'Carla Dias', cpf: '333.444.555-66', phone: '(21) 97777-3333', cep: '20031-050', street: 'Avenida Rio Branco', number: '200', neighborhood: 'Centro', city: 'Rio de Janeiro', state: 'RJ', latitude: -22.9068, longitude: -43.1729 },
];
