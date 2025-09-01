Development SSL guidance

Problem
- Some environments (corporate proxies, self-signed certs) cause cURL `SSL certificate problem: self-signed certificate in certificate chain` when calling external APIs (ViaCEP).

Solutions
1) Preferred: provide a CA bundle
- Download cacert.pem from https://curl.se/ca/cacert.pem
- Place the file at `storage/cacert.pem` in the project root.
- Ensure the web server user can read it.

2) Quick dev fallback (not recommended for production)
- The app will automatically fall back to an unverified request if `storage/cacert.pem` is missing. This is controlled in `app/Services/ViaCepService.php` and logs a warning.
 - The app will **not** fall back to an unverified request by default. It will require `storage/cacert.pem` to exist and will fail with a clear error message.
 - For local development, you can set `VIA_CEP_ALLOW_INSECURE=true` in your `.env` to allow an insecure request (not recommended for production).

Additional recommendations
- Add `/storage/cacert.pem` to `.gitignore` so the CA bundle is not committed.
- Use `VIA_CEP_ALLOW_INSECURE=true` only in local development environments behind trusted proxies.

Notes
- Never disable SSL verification in production.
- If you prefer to set a global CA bundle, set the environment variable `CURL_CA_BUNDLE` to point to a valid PEM file.
