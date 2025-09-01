<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 *     title="User Address API",
 *     version="1.0.0",
 *     description="API para gerenciamento de usuários e seus contatos com endereços",
 *     @OA\Contact(
 *         email="admin@useraddress.com"
 *     )
 * )
 * 
 * @OA\Server(
 *     url=L5_SWAGGER_CONST_HOST,
 *     description="User Address API Server"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Enter token in format (Bearer <token>)"
 * )
 *
 * @OA\Tag(
 *     name="Authentication",
 *     description="Endpoints para autenticação de usuários"
 * )
 *
 * @OA\Tag(
 *     name="Contacts",
 *     description="Endpoints para gerenciamento de contatos"
 * )
 *
 * @OA\Tag(
 *     name="Address",
 *     description="Endpoints para consulta de endereços"
 * )
 *
 * @OA\Schema(
 *     schema="SuccessResponse",
 *     type="object",
 *     @OA\Property(property="success", type="boolean", example=true),
 *     @OA\Property(property="message", type="string", example="Operação realizada com sucesso"),
 *     @OA\Property(property="data", type="object")
 * )
 *
 * @OA\Schema(
 *     schema="ErrorResponse",
 *     type="object",
 *     @OA\Property(property="success", type="boolean", example=false),
 *     @OA\Property(property="message", type="string", example="Erro na operação")
 * )
 *
 * @OA\Schema(
 *     schema="ValidationErrorResponse",
 *     type="object",
 *     @OA\Property(property="success", type="boolean", example=false),
 *     @OA\Property(property="message", type="string", example="Erro de validação"),
 *     @OA\Property(property="errors", type="object")
 * )
 *
 * @OA\Schema(
 *     schema="UnauthorizedResponse",
 *     type="object",
 *     @OA\Property(property="message", type="string", example="Unauthenticated.")
 * )
 */
class SwaggerController extends Controller
{
    // This controller is just for Swagger documentation metadata
}
