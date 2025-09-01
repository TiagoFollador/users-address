import type { Contact } from './types';

export const MOCKED_CONTACTS: Contact[] = [
  {
    id: 1,
    name: 'Fulano de Tal',
    cpf: '111.222.333-44',
    phone: '(41) 99999-8888',
    cep: '80010-010',
    street: 'Rua das Flores',
    number: '123',
    neighborhood: 'Centro',
    city: 'Curitiba',
    state: 'PR',
    latitude: -25.4284,
    longitude: -49.2733,
  },
  {
    id: 2,
    name: 'Ciclana da Silva',
    cpf: '555.666.777-88',
    phone: '(11) 98765-4321',
    cep: '01001-000',
    street: 'Praça da Sé',
    number: '100',
    neighborhood: 'Sé',
    city: 'São Paulo',
    state: 'SP',
    latitude: -23.5505,
    longitude: -46.6333,
  },
];
