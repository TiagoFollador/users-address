# API Routes - User Address API

Este documento descreve as rotas expostas pela API para consumo do frontend.

Formato: [METHOD] /endpoint - Autenticação - Descrição

---

## Autenticação (públicas)

- [POST] /api/register - Public - Registrar usuário
  - Body: { name, email, password, password_confirmation }
  - Resposta 201: { success, message, data: { user, token, token_type } }

- [POST] /api/login - Public - Gerar token de acesso
  - Body: { email, password }
  - Resposta 200: { success, message, data: { user, token, token_type } }

- [POST] /api/forgot-password - Public - Solicitar email de recuperação
  - Body: { email }
  - Resposta 200: { success, message }

- [POST] /api/reset-password - Public - Redefinir senha com token
  - Body: { token, email, password, password_confirmation }
  - Resposta 200: { success, message }

---

## Autenticadas (Sanctum)

For endpoints abaixo inclua header: Authorization: Bearer <token>

- [POST] /api/logout - Auth - Revogar token atual
  - Resposta 200: { success, message }

- [GET] /api/user - Auth - Retornar dados do usuário autenticado
  - Resposta 200: { id, name, email, ... }

- [DELETE] /api/account - Auth - Deletar conta do usuário (cascade de contatos)
  - Resposta 200: { success, message }

---

## Contatos (CRUD)

- [GET] /api/contacts - Auth - Listar contatos (com filtros, ordenação e paginação)
  - Query params:
    - search (string) - busca por nome, email, telefone, cpf, rua, cidade
    - city (string)
    - state (string)
    - order_by (one of: name, email, city, created_at)
    - order_direction (asc|desc)
    - page (int)
    - per_page (int, máximo 100)
  - Resposta 200: { success: true, data: { data: [Contact], current_page, last_page, per_page, total, from, to } }

- [POST] /api/contacts - Auth - Criar contato
  - Body: { name, email, phone, cpf, cep, street, number, complement?, neighborhood, city, state }
  - Observações: o backend tentará obter latitude/longitude via Google Maps se `GOOGLE_MAPS_API_KEY` estiver configurado.
  - Resposta 201: { success, message, data: Contact }

- [GET] /api/contacts/{id} - Auth - Obter contato
  - Resposta 200: { success, data: Contact }

- [PUT] /api/contacts/{id} - Auth - Atualizar contato
  - Body: (mesmos campos do POST) - campos parciais permitidos
  - Se campos de endereço mudarem, as coordenadas serão recalculadas
  - Resposta 200: { success, message, data: Contact }

- [DELETE] /api/contacts/{id} - Auth - Remover contato
  - Resposta 200: { success, message }

- [POST] /api/contacts/via-cep - Auth - Buscar endereço por CEP (ViaCEP)
  - Body: { zip_code }
  - Resposta 200: { success, data: { zip_code, address, neighborhood, city, state, complement } }

---

## Observações

- CPF: validado com algoritmo (regra `ValidCpf`) e único por usuário (constraint `user_id + cpf`).
- Reset de senha: token expira em 60 minutos.
- Google Maps: configure `GOOGLE_MAPS_API_KEY` no `.env` para obter geocoding real; caso contrário lat/lng default serão usados.
- Emails: configure variáveis de mail (`MAIL_*`) no `.env` (Mailtrap sugerido para desenvolvimento).

---

Se quiser posso também gerar um arquivo JSON OpenAPI (ou atualizar o swagger) com essas descrições em formato aberto para que o frontend importe automaticamente.
