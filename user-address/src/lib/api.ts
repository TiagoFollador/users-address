import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';
import type { Contact, User } from './types';

// Tipos para as respostas da API
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// Tipos para autenticação
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

// Tipos para CEP
interface ViaCepRequest {
  cep: string;
}

interface ViaCepResponse {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

// Configuração do axios
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptador de requisições para adicionar token de autenticação
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptador de respostas para tratar erros globais
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funções de autenticação
export const authApi = {
  register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await apiClient.post('/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response: AxiosResponse<ApiResponse<LoginResponse>> = await apiClient.post('/login', data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await apiClient.post('/logout');
    return response.data;
  },
};

// Funções de contatos
export const contactsApi = {
  getAll: async (): Promise<ApiResponse<Contact[]>> => {
    const response: AxiosResponse<ApiResponse<Contact[]>> = await apiClient.get('/contacts');
    return response.data;
  },

  create: async (data: Omit<Contact, 'id'>): Promise<ApiResponse<Contact>> => {
    const response: AxiosResponse<ApiResponse<Contact>> = await apiClient.post('/contacts', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Contact>): Promise<ApiResponse<Contact>> => {
    const response: AxiosResponse<ApiResponse<Contact>> = await apiClient.put(`/contacts/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await apiClient.delete(`/contacts/${id}`);
    return response.data;
  },

  searchCep: async (data: ViaCepRequest): Promise<ApiResponse<ViaCepResponse>> => {
    const response: AxiosResponse<ApiResponse<ViaCepResponse>> = await apiClient.post('/contacts/via-cep', data);
    return response.data;
  },
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Função para obter o token
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Função para definir o token
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Função para remover o token
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

// Função legacy para manter compatibilidade (será removida após migração completa)
export const getContacts = async (): Promise<Contact[]> => {
  console.log('Using legacy getContacts - consider migrating to contactsApi.getAll()');
  const response = await contactsApi.getAll();
  return response.data || [];
};
