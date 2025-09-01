export function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white shadow-md">
      <h1 className="text-xl font-bold">Lista de Contatos</h1>
      <nav>
        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
          Sair
        </button>
      </nav>
    </header>
  );
}

export default Header;
