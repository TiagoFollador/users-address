# SSL Configuration

## Problem
Corporate proxies or self-signed certificates cause SSL errors when calling external APIs.

## Solutions

### 1. CA Bundle (Recommended)
```bash
# Download CA bundle
curl -o storage/cacert.pem https://curl.se/ca/cacert.pem
```

### 2. Development Bypass
For local development only:
```bash
VIA_CEP_ALLOW_INSECURE=true
OPENSTREETMAP_ALLOW_INSECURE=true
```

## Notes
- Never disable SSL verification in production
- CA bundle is in `.gitignore`
