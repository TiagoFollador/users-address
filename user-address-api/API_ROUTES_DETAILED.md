API Routes - Detailed Examples

Este documento fornece exemplos de request/response para cada rota principal, pronto para uso pelo frontend.

1) Registro
- Endpoint: POST /api/register
- Body JSON:
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senhaForte123",
  "password_confirmation": "senhaForte123"
}
- Success (201):
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "user": { "id": 12, "name": "João Silva", "email": "joao@example.com" },
    "token": "1|abc123def...",
    "token_type": "Bearer"
  }
}

2) Login
- Endpoint: POST /api/login
- Body JSON:
{
  "email": "joao@example.com",
  "password": "senhaForte123"
}
- Success (200):
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": { "id":12, "name":"João Silva", "email":"joao@example.com" },
    "token": "1|abc123def...",
    "token_type": "Bearer"
  }
}

3) Forgot Password
- Endpoint: POST /api/forgot-password
- Body JSON: { "email": "joao@example.com" }
- Success (200): { "success": true, "message": "Email de recuperação enviado com sucesso" }
- Notes: email contains a reset link to FRONTEND_URL/reset-password?token=...&email=...

4) Reset Password
- Endpoint: POST /api/reset-password
- Body JSON:
{
  "token": "the-token-from-email",
  "email": "joao@example.com",
  "password": "novaSenha123",
  "password_confirmation": "novaSenha123"
}
- Success (200): { "success": true, "message": "Senha alterada com sucesso" }

5) Get Authenticated User
- Endpoint: GET /api/user
- Headers: Authorization: Bearer <token>
- Success (200): user object

6) Logout
- Endpoint: POST /api/logout
- Headers: Authorization: Bearer <token>
- Success (200): { "success": true, "message": "Logout realizado com sucesso" }

7) Contacts - List
- Endpoint: GET /api/contacts
- Query params: search, city, state, order_by, order_direction, page, per_page
- Success (200):
{
  "success": true,
  "data": {
    "data": [ { /* contact objects */ } ],
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 68,
    "from": 1,
    "to": 15
  }
}

8) Contacts - Create
- Endpoint: POST /api/contacts
- Body JSON:
{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "phone": "11999999999",
  "cpf": "123.456.789-09",
  "cep": "01234-567",
  "street": "Rua das Flores",
  "number": "123",
  "complement": "Apto 101",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP"
}
- Success (201): { "success": true, "message": "Contato criado com sucesso", "data": { /* contact */ } }
- Notes: lat/lng will be filled by Google Maps if `GOOGLE_MAPS_API_KEY` is configured; otherwise fallback coords used.

9) Contacts - Get
- Endpoint: GET /api/contacts/{id}
- Headers: Authorization
- Success (200): { "success": true, "data": { /* contact */ } }

10) Contacts - Update
- Endpoint: PUT /api/contacts/{id}
- Body: partial fields allowed (same shape as Create)
- Success (200): { "success": true, "message": "Contato atualizado com sucesso", "data": { /* contact */ } }

11) Contacts - Delete
- Endpoint: DELETE /api/contacts/{id}
- Success (200): { "success": true, "message": "Contato removido com sucesso" }

12) ViaCEP lookup
- Endpoint: POST /api/contacts/via-cep
- Body: { "zip_code": "01234-567" }
- Success (200): { "success": true, "data": { "zip_code":..., "address":..., "neighborhood":..., "city":..., "state":..., "complement":... } }

---

Se quiser, exporto este documento em JSON ou adiciono exemplos para erros 422/401/404 também.
