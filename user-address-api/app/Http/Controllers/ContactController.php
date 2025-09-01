<?php

namespace App\Http\Controllers;

use App\Http\Requests\Contact\StoreContactRequest;
use App\Http\Requests\Contact\UpdateContactRequest;
use App\Http\Requests\Contact\ViaCepRequest;
use App\Services\ContactService;
use App\Services\ViaCepService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends ApiController
{
    public function __construct(
        private ContactService $contactService,
        private ViaCepService $viaCepService
    ) {}

    /**
     * @OA\Get(
     *     path="/api/contacts",
     *     tags={"Contacts"},
     *     summary="Listar contatos do usuário",
     *     description="Retorna todos os contatos do usuário autenticado",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de contatos retornada com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Contact"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Token inválido",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $contacts = $this->contactService->getUserContacts($request->user());

            return $this->successResponse($contacts);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * @OA\Post(
     *     path="/api/contacts",
     *     tags={"Contacts"},
     *     summary="Criar novo contato",
     *     description="Criar um novo contato para o usuário autenticado",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","phone","address","neighborhood","city","state","zip_code"},
     *             @OA\Property(property="name", type="string", example="Maria Silva"),
     *             @OA\Property(property="email", type="string", format="email", example="maria@example.com"),
     *             @OA\Property(property="phone", type="string", example="11999999999"),
     *             @OA\Property(property="address", type="string", example="Rua das Flores, 123"),
     *             @OA\Property(property="neighborhood", type="string", example="Centro"),
     *             @OA\Property(property="city", type="string", example="São Paulo"),
     *             @OA\Property(property="state", type="string", example="SP"),
     *             @OA\Property(property="zip_code", type="string", example="01234-567")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Contato criado com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Contato criado com sucesso"),
     *             @OA\Property(property="data", ref="#/components/schemas/Contact")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Erro de validação",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Erro de validação"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Token inválido",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function store(StoreContactRequest $request): JsonResponse
    {
        try {
            $contact = $this->contactService->createContact(
                $request->user(),
                $request->validated()
            );

            return $this->successResponse($contact, 'Contato criado com sucesso', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * @OA\Get(
     *     path="/api/contacts/{id}",
     *     tags={"Contacts"},
     *     summary="Buscar contato por ID",
     *     description="Retorna um contato específico do usuário autenticado",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do contato",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contato encontrado com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", ref="#/components/schemas/Contact")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Contato não encontrado",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Contato não encontrado")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Token inválido",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function show(Request $request, int $id): JsonResponse
    {
        try {
            $contact = $this->contactService->getContact($request->user(), $id);

            return $this->successResponse($contact);
        } catch (\Exception $e) {
            $statusCode = $e->getCode() ?: 500;
            
            return $this->errorResponse($e->getMessage(), $statusCode);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/contacts/{id}",
     *     tags={"Contacts"},
     *     summary="Atualizar contato",
     *     description="Atualizar dados de um contato específico",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do contato",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="Maria Silva"),
     *             @OA\Property(property="email", type="string", format="email", example="maria@example.com"),
     *             @OA\Property(property="phone", type="string", example="11999999999"),
     *             @OA\Property(property="address", type="string", example="Rua das Flores, 456"),
     *             @OA\Property(property="neighborhood", type="string", example="Jardim"),
     *             @OA\Property(property="city", type="string", example="São Paulo"),
     *             @OA\Property(property="state", type="string", example="SP"),
     *             @OA\Property(property="zip_code", type="string", example="01234-567")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contato atualizado com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Contato atualizado com sucesso"),
     *             @OA\Property(property="data", ref="#/components/schemas/Contact")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Contato não encontrado",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Contato não encontrado")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Erro de validação",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Erro de validação"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Token inválido",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function update(UpdateContactRequest $request, int $id): JsonResponse
    {
        try {
            $contact = $this->contactService->updateContact(
                $request->user(),
                $id,
                $request->validated()
            );

            return $this->successResponse($contact, 'Contato atualizado com sucesso');
        } catch (\Exception $e) {
            $statusCode = $e->getCode() ?: 500;
            
            return $this->errorResponse($e->getMessage(), $statusCode);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/contacts/{id}",
     *     tags={"Contacts"},
     *     summary="Deletar contato",
     *     description="Remover um contato específico",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do contato",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contato deletado com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Contato deletado com sucesso")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Contato não encontrado",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Contato não encontrado")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Token inválido",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $this->contactService->deleteContact($request->user(), $id);

            return $this->successResponse(null, 'Contato deletado com sucesso');
        } catch (\Exception $e) {
            $statusCode = $e->getCode() ?: 500;
            
            return $this->errorResponse($e->getMessage(), $statusCode);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/contacts/via-cep",
     *     tags={"Address"},
     *     summary="Buscar endereço por CEP",
     *     description="Consultar dados de endereço através do CEP usando a API ViaCEP",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"zip_code"},
     *             @OA\Property(property="zip_code", type="string", example="01234-567", description="CEP no formato XXXXX-XXX ou XXXXXXXX")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Endereço encontrado com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="zip_code", type="string", example="01234-567"),
     *                 @OA\Property(property="address", type="string", example="Rua das Flores"),
     *                 @OA\Property(property="neighborhood", type="string", example="Centro"),
     *                 @OA\Property(property="city", type="string", example="São Paulo"),
     *                 @OA\Property(property="state", type="string", example="SP"),
     *                 @OA\Property(property="complement", type="string", example="")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="CEP não encontrado",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="CEP não encontrado")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="CEP inválido",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="CEP inválido"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Token inválido",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function viaCep(ViaCepRequest $request): JsonResponse
    {
        try {
            $data = $this->viaCepService->getAddressByZipCode($request->zip_code);

            return $this->successResponse($data);
        } catch (\Exception $e) {
            $statusCode = $e->getCode() ?: 500;
            
            return $this->errorResponse($e->getMessage(), $statusCode);
        }
    }
}
