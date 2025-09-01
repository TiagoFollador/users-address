import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authApi, setToken } from '../../src/lib/api';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';
import { useToast } from '../../src/hooks/use-toast';

export function meta() {
  return [
    { title: "Login - User Address" },
    { name: "description", content: "Faça login na sua conta" },
  ];
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      // API may return a 200 with success=false; handle that explicitly so users see errors
      if (response.success && response.data) {
        setToken(response.data.token);
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo, ${response.data.user.name}!`,
        });
        // Redirecionar para o dashboard
        window.location.href = '/';
        return;
      }

      // If API returned success:false, show the server message or a generic error
      console.error('Login failed (API):', response);
      toast({
        variant: 'destructive',
        title: 'Erro no login',
        description: response.message || 'Credenciais inválidas. Verifique e tente novamente.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Credenciais inválidas. Verifique seus dados e tente novamente.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Faça login na sua conta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                maxLength={100}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                maxLength={50}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Esqueci minha senha
              </a>
            </p>
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Cadastre-se aqui
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
