# users-address (Monorepo)

Repositório contendo duas aplicações:
- user-address-api — Backend Laravel (API REST)
- user-address — Frontend React + Vite

Resumo rápido:
- Backend: Laravel 10+, Sanctum, L5-Swagger, serviços de geocoding (ViaCep / OpenStreetMap).
- Frontend: React + Vite, React Router, client/server build em `build/`.

Prerequisitos
- PHP 8.1+ and Composer (para backend)
- Node 16+/18+ and pnpm/npm (para frontend)
- MySQL conforme `.env` (backend)

Estrutura
- user-address-api/ — API Laravel
- user-address/ — SPA React + Vite

Quick start (Windows PowerShell)
- Backend
  1. cd user-address-api
  2. copy .env.example .env
  3. composer install
  4. php artisan key:generate
  5. ajustar .env (DB, MAIL, SANCTUM, geocoding)
  6. php artisan migrate --seed
  7. php artisan serve --host=127.0.0.1 --port=8000

- Frontend
  1. cd user-address
  2. pnpm install  # ou npm install
  3. criar arquivo .env com VITE_API_URL=http://localhost:8000/api
  4. pnpm dev  # start dev server (Vite)

Documentação e utilitários
- API docs: `localhost:8000/api/documentation`, `user-address-api/docs/` e L5-Swagger (ver `SWAGGER_DOCUMENTATION.md`)
- Rotas: `user-address-api/API_ROUTES.md` e `API_ROUTES_DETAILED.md`
- Geocoding setup: `user-address-api/docs/GEOCODING_SETUP.md`


