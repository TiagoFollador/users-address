import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../src/lib/api';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';
import { useToast } from '../../src/hooks/use-toast';

export function meta() {
  return [
    { title: "Esqueci minha senha - User Address" },
    { name: "description", content: "Recupere sua senha" },
  ];
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (response) => {
      if (response.success) {
        setSuccess(true);
        toast({
          title: "Email enviado!",
          description: "Verifique sua caixa de entrada para instruções de recuperação de senha.",
        });
      }
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao enviar email",
        description: error.response?.data?.message || "Ocorreu um erro. Tente novamente.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate({ email });
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
              Email enviado!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
            <div className="mt-6">
              <a 
                href="/login" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Voltar para o login
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
            Esqueci minha senha
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Digite seu email para receber instruções de recuperação
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending ? 'Enviando...' : 'Enviar instruções'}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Lembrou da senha?{' '}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Faça login aqui
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
