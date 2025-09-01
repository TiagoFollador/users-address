import { MOCKED_CONTACTS } from './mock-data';
import type { Contact } from './types';

// Simula uma chamada de API para buscar contatos
export const getContacts = async (): Promise<Contact[]> => {
  console.log('Buscando contatos (MOCK)...');
  // Simula a latência da rede
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCKED_CONTACTS;
};

// Quando o backend estiver pronto, você substituirá pelo código real:
/*
import axios from 'axios';
const apiClient = axios.create({ baseURL: 'http://localhost:8000/api' });

export const getContacts = async (): Promise<Contact[]> => {
  const response = await apiClient.get('/contacts');
  return response.data;
}
*/
