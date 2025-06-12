# Configuración SSL para APIDICAPI

## Certificados SSL

### Opción 1: Certificado autofirmado (Desarrollo)
```bash
# Generar certificado autofirmado
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

### Opción 2: Certificado Let's Encrypt (Producción)
```bash
# Instalar certbot
# Generar certificado
certbot certonly --standalone -d tu-dominio.com
```

## Archivos necesarios:
- `cert.pem` - Certificado público
- `key.pem` - Clave privada
- `ca.pem` - Certificado de autoridad (opcional)

## Configuración en la aplicación:
Los certificados se cargan automáticamente desde esta carpeta. 