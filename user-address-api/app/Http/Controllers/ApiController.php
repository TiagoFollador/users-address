<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

abstract class ApiController extends Controller
{
    /**
     * Return a success JSON response.
     */
    protected function successResponse($data = null, string $message = '', int $statusCode = 200): JsonResponse
    {
        $response = [
            'success' => true,
        ];

        if ($message) {
            $response['message'] = $message;
        }

        if ($data !== null) {
            $response['data'] = $data;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Return an error JSON response.
     */
    protected function errorResponse(string $message, int $statusCode = 500, $errors = null): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Return a validation error JSON response.
     */
    protected function validationErrorResponse($errors): JsonResponse
    {
        return $this->errorResponse('Erro de validação', 422, $errors);
    }

    /**
     * Return a not found error JSON response.
     */
    protected function notFoundResponse(string $message = 'Recurso não encontrado'): JsonResponse
    {
        return $this->errorResponse($message, 404);
    }
}
