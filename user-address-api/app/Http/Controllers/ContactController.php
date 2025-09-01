<?php

namespace App\Http\Controllers;

use App\Http\Requests\Contact\StoreContactRequest;
use App\Http\Requests\Contact\UpdateContactRequest;
use App\Http\Requests\Contact\ViaCepRequest;
use App\Services\ContactService;
use App\Services\ViaCepService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function __construct(
        private ContactService $contactService,
        private ViaCepService $viaCepService
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $contacts = $this->contactService->getUserContacts($request->user());

            return response()->json([
                'success' => true,
                'data' => $contacts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(StoreContactRequest $request): JsonResponse
    {
        try {
            $contact = $this->contactService->createContact(
                $request->user(),
                $request->validated()
            );

            return response()->json([
                'success' => true,
                'message' => 'Contato criado com sucesso',
                'data' => $contact
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request, int $id): JsonResponse
    {
        try {
            $contact = $this->contactService->getContact($request->user(), $id);

            return response()->json([
                'success' => true,
                'data' => $contact
            ]);
        } catch (\Exception $e) {
            $statusCode = $e->getCode() ?: 500;
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $statusCode);
        }
    }

    public function update(UpdateContactRequest $request, int $id): JsonResponse
    {
        try {
            $contact = $this->contactService->updateContact(
                $request->user(),
                $id,
                $request->validated()
            );

            return response()->json([
                'success' => true,
                'message' => 'Contato atualizado com sucesso',
                'data' => $contact
            ]);
        } catch (\Exception $e) {
            $statusCode = $e->getCode() ?: 500;
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $statusCode);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $this->contactService->deleteContact($request->user(), $id);

            return response()->json([
                'success' => true,
                'message' => 'Contato deletado com sucesso'
            ]);
        } catch (\Exception $e) {
            $statusCode = $e->getCode() ?: 500;
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $statusCode);
        }
    }

    public function viaCep(ViaCepRequest $request): JsonResponse
    {
        try {
            $data = $this->viaCepService->getAddressByZipCode($request->zip_code);

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            $statusCode = $e->getCode() ?: 500;
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $statusCode);
        }
    }
}
