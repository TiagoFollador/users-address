import { useMutation } from '@tanstack/react-query';
import { authApi, removeToken } from '../lib/api';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

export function Header() {
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      // Remove token independente do resultado
      removeToken();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      window.location.href = '/login';
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white shadow-md">
      <h1 className="text-xl font-bold">Lista de Contatos</h1>
      <nav className="flex items-center space-x-4">
        <Button 
          onClick={handleLogout}
          variant="destructive"
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? 'Saindo...' : 'Sair'}
        </Button>
      </nav>
    </header>
  );
}

export default Header;
