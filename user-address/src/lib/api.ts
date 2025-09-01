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
  token_type: string;
}

// Tipos para recuperação de senha
interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Tipos para CEP
interface ViaCepRequest {
  zip_code: string; // Atualizado para usar zip_code conforme API spec
}

interface ViaCepResponse {
  zip_code: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
}

// Tipos para contatos com paginação
interface ContactsParams {
  search?: string;
  city?: string;
  state?: string;
  order_by?: 'name' | 'email' | 'city' | 'created_at';
  order_direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Tipos para criação/edição de contatos
interface ContactCreateData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
}

interface ContactUpdateData extends Partial<ContactCreateData> {}

// Configuração do axios
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Corrigido para usar a URL correta
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptador de requisições para adicionar token de autenticação
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Don't force a redirect when the 401 originates from authentication endpoints
      // (login/register/forgot-password/reset-password) so the UI can show useful
      // error messages to the user instead of triggering a page reload.
      const requestUrl = (error.config as InternalAxiosRequestConfig | undefined)?.url || '';
      const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
      const isAuthRequest = authPaths.some((p) => requestUrl.includes(p));

      // For auth-related requests, just remove the token and reject so the caller handles the error
      if (isAuthRequest) {
        localStorage.removeItem('token');
        return Promise.reject(error);
      }

      // For other requests, keep the previous behavior (redirect to login)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funções de autenticação
export const authApi = {
  register: async (data: RegisterRequest): Promise<ApiResponse<LoginResponse>> => {
    const response: AxiosResponse<ApiResponse<LoginResponse>> = await apiClient.post('/register', data);
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

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await apiClient.post('/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await apiClient.post('/reset-password', data);
    return response.data;
  },

  deleteAccount: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await apiClient.delete('/account');
    return response.data;
  },
};

// Funções de contatos
export const contactsApi = {
  getAll: async (params?: ContactsParams): Promise<ApiResponse<PaginatedResponse<Contact>>> => {
    const response: AxiosResponse<ApiResponse<PaginatedResponse<Contact>>> = await apiClient.get('/contacts', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Contact>> => {
    const response: AxiosResponse<ApiResponse<Contact>> = await apiClient.get(`/contacts/${id}`);
    return response.data;
  },

  create: async (data: ContactCreateData): Promise<ApiResponse<Contact>> => {
    const response: AxiosResponse<ApiResponse<Contact>> = await apiClient.post('/contacts', data);
    return response.data;
  },

  update: async (id: number, data: ContactUpdateData): Promise<ApiResponse<Contact>> => {
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
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

// Função para obter o token
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Função para definir o token
export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
};

// Função para remover o token
export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
};

// Função legacy para manter compatibilidade (será removida após migração completa)
export const getContacts = async (): Promise<Contact[]> => {
  console.log('Using legacy getContacts - consider migrating to contactsApi.getAll()');
  const response = await contactsApi.getAll();
  return response.data?.data || [];
};

// Exportar tipos para uso em outros arquivos
export type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ViaCepRequest,
  ViaCepResponse,
  ContactsParams,
  PaginatedResponse,
  ContactCreateData,
  ContactUpdateData,
};
