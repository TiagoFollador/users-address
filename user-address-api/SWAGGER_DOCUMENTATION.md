# API Documentation with Swagger/OpenAPI

This project now includes comprehensive API documentation using Swagger/OpenAPI 3.0 specification through the L5-Swagger package.

## 📚 Documentation Access

### View the API Documentation
Once your Laravel server is running, you can access the interactive API documentation at:

```
http://localhost:8000/api/documentation
```

### Generate/Update Documentation
To regenerate the documentation after making changes to annotations:

```bash
php artisan l5-swagger:generate
```

## 🚀 Features Documented

### Authentication Endpoints
- **POST** `/api/register` - User registration
- **POST** `/api/login` - User authentication  
- **POST** `/api/logout` - User logout
- **DELETE** `/api/account` - Delete user account

### Contact Management Endpoints
- **GET** `/api/contacts` - List all user contacts
- **POST** `/api/contacts` - Create new contact
- **GET** `/api/contacts/{id}` - Get specific contact
- **PUT** `/api/contacts/{id}` - Update contact
- **DELETE** `/api/contacts/{id}` - Delete contact

### Address Lookup Endpoints
- **POST** `/api/contacts/via-cep` - Get address by CEP

## 📋 Documentation Features

### 🔐 Authentication
- Bearer token authentication documented
- Security schemes properly defined
- All protected endpoints marked with security requirements

### 📝 Request/Response Examples
- Complete request body examples with sample data
- Detailed response structures for success and error cases
- Proper HTTP status codes documented

### 🏗️ Schema Definitions
- **User Model**: Complete user entity structure
- **Contact Model**: Contact entity with all fields
- Reusable schema components for consistent documentation

### ✅ Validation Rules
- All validation requirements documented
- Error response formats standardized
- Field types and constraints clearly specified

## 🛠️ Implementation Details

### Swagger Annotations Structure

```php
/**
 * @OA\Post(
 *     path="/api/endpoint",
 *     tags={"Category"},
 *     summary="Brief description",
 *     description="Detailed description",
 *     security={{"sanctum":{}}}, // For protected endpoints
 *     @OA\RequestBody(...),
 *     @OA\Response(...),
 *     @OA\Response(...) // Multiple responses for different scenarios
 * )
 */
```

### Tags Organization
- **Authentication**: User auth-related endpoints
- **Contacts**: Contact management operations
- **Address**: Address lookup functionality

### Response Patterns
All API responses follow a consistent structure:

```json
{
    "success": true|false,
    "message": "Description of the result",
    "data": {...}, // Present on success
    "errors": {...} // Present on validation errors
}
```

## 📁 Files Structure

### Swagger Configuration
- `config/l5-swagger.php` - L5-Swagger configuration
- `storage/api-docs/api-docs.json` - Generated documentation

### Documentation Annotations
- `app/Http/Controllers/SwaggerController.php` - Main API info and tags
- `app/Http/Controllers/AuthController.php` - Authentication endpoints
- `app/Http/Controllers/ContactController.php` - Contact endpoints
- `app/Models/User.php` - User schema definition
- `app/Models/Contact.php` - Contact schema definition

## 🔧 Configuration

### Environment Variables
You can customize the documentation behavior with these variables in `.env`:

```env
L5_SWAGGER_USE_ABSOLUTE_PATH=true
L5_FORMAT_TO_USE_FOR_DOCS=json
```

### Custom Settings
The documentation is configured to:
- Use absolute paths for assets
- Generate JSON format documentation
- Scan the entire `app/` directory for annotations
- Serve documentation at `/api/documentation`

## 📖 Usage Examples

### Testing Authentication
1. Use the `/api/register` endpoint to create a user
2. Copy the returned token
3. Click "Authorize" in Swagger UI
4. Enter: `Bearer YOUR_TOKEN_HERE`
5. Test protected endpoints

### Sample Requests

#### Register User
```json
{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

#### Create Contact
```json
{
    "name": "Maria Silva",
    "email": "maria@example.com",
    "phone": "11999999999",
    "address": "Rua das Flores, 123",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zip_code": "01234-567"
}
```

#### CEP Lookup
```json
{
    "zip_code": "01234-567"
}
```

## 🎯 Benefits

### For Developers
- Interactive API testing without external tools
- Clear endpoint documentation with examples
- Automatic validation of request/response formats
- Easy integration testing

### For Frontend Teams
- Complete API specification for client development
- Request/response examples for implementation
- Authentication flow documentation
- Error handling guidelines

### For API Consumers
- Self-documenting API with live examples
- Try-it-out functionality for testing
- Clear parameter requirements and constraints
- Comprehensive error code documentation

## 🔄 Maintenance

### Adding New Endpoints
1. Add Swagger annotations to controller methods
2. Define request/response schemas
3. Run `php artisan l5-swagger:generate`
4. Documentation updates automatically

### Updating Documentation
- Modify annotations in controllers/models
- Regenerate documentation
- Changes reflect immediately in Swagger UI

This comprehensive documentation setup ensures your API is professional, testable, and easy to integrate with!
