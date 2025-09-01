export interface Contact {
  id: number;
  name: string;
  cpf: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
