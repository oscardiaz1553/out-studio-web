# Imagen de grupo de WhatsApp por proyecto

Formato oficial de Out para la foto de perfil del grupo de WhatsApp de cada
proyecto: fondo azul Klein con la trama suave de corchetes y llaves, "Out ×",
el logo del cliente y Mango trabajando en su portátil. 1080 × 1080, todo dentro
del círculo que recorta WhatsApp.

## Cómo hacer una nueva

1. Guarda aquí el logo del cliente (PNG con fondo transparente, que se vea bien
   sobre azul; si es oscuro, pide su versión en negativo).
2. Desde la raíz del repositorio:

   ```
   NODE_PATH=$(npm root -g) node design-src/whatsapp/grupo.cjs design-src/whatsapp/<logo>.png design-src/whatsapp/grupo-<cliente>.png
   ```

Ejemplo: `grupo-diario-deportes.png`.
