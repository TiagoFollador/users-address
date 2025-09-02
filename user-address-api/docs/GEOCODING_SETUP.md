# Serviço de Geocoding - OpenStreetMap

Este projeto utiliza o **OpenStreetMap Nominatim** como serviço de geocoding gratuito.

## Vantagens
- ✅ Completamente gratuito
- ✅ Não requer chave de API
- ✅ Não tem limites de cobrança
- ✅ Boa cobertura para o Brasil

## Configuração

O sistema funciona automaticamente. Para desenvolvimento local com problemas de SSL:

```bash
OPENSTREETMAP_ALLOW_INSECURE=true
```

## Como funciona

1. **Criação de contatos**: Coordenadas são obtidas automaticamente
2. **Atualização de endereços**: Novas coordenadas são calculadas 
3. **Fallback**: Se falhar, usa coordenadas padrão de São Paulo (-23.5505, -46.6333)

## Teste

```bash
php artisan tinker
```

```php
$service = new \App\Services\OpenStreetMapService();
$coords = $service->getCoordinatesFromAddress([
    'street' => 'Rua Augusta',
    'number' => '1000',
    'city' => 'São Paulo',
    'state' => 'SP'
]);
print_r($coords);
```
