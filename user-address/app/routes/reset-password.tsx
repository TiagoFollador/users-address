import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../src/lib/api';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';
import { useToast } from '../../src/hooks/use-toast';

export function meta() {
  return [
    { title: "Redefinir senha - User Address" },
    { name: "description", content: "Defina uma nova senha" },
  ];
}

export default function ResetPassword() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  // Extrair token e email da URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenParam = urlParams.get('token');
      const emailParam = urlParams.get('email');
      
      if (tokenParam) setToken(tokenParam);
      if (emailParam) setEmail(emailParam);
    }
  }, []);

  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (response) => {
      if (response.success) {
        setSuccess(true);
        toast({
          title: "Senha alterada com sucesso!",
          description: "Você pode fazer login com sua nova senha.",
        });
      }
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao redefinir senha",
          description: error.response?.data?.message || "Token inválido ou expirado. Solicite uma nova recuperação.",
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!token) {
      toast({
        variant: "destructive",
        title: "Token inválido",
        description: "Link de recuperação inválido. Solicite uma nova recuperação.",
      });
      return;
    }

    resetPasswordMutation.mutate({
      token,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Senha alterada!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sua senha foi alterada com sucesso. Faça login com sua nova senha.
            </p>
            <div className="mt-6">
              <a 
                href="/login" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Ir para o login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Redefinir senha
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Digite sua nova senha
          </p>
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
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Nova senha
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua nova senha"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
              )}
            </div>
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                Confirme a nova senha
              </label>
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Confirme sua nova senha"
              />
              {errors.password_confirmation && (
                <p className="mt-1 text-sm text-red-600">{errors.password_confirmation[0]}</p>
              )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? 'Alterando senha...' : 'Alterar senha'}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Voltar para o login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
