# Order Delight

Vista Cliente (Frontend Web Responsive / Mobile-First):

Pantalla de inicio con listado y filtros de negocios/restaurantes aliados (logo, nombre, categoría, horario).

Vista de restaurante con su menú/carta organizado por categorías (ej. Hamburguesas, Bebidas, Adicionales).

Carrito de compras simple para agregar productos, seleccionar cantidades y agregar notas especiales.

Formulario de checkout rápido para pedir datos básicos: Nombre del cliente, Dirección exacta / Barrio, Teléfono, y Método de pago seleccionado (Efectivo o Transferencia Nequi/Daviplata).

Botón de confirmación: Al hacer clic en "Pedir", debe autogenerar un mensaje estructurado y enviarlo vía API de WhatsApp (enlace wa.me) con el detalle del pedido, dirección, total de productos y valor del domicilio fijo ($6.000 COP).

Panel de Administración (Backend Sencillo):

Módulo intuitivo para que el administrador pueda crear, editar, pausar o eliminar restaurantes.

Módulo para cargar productos por restaurante (nombre, descripción, precio, foto).

Acceso rápido sin necesidad de desarrollo complejo desde cero (priorizar stacks como Next.js + Supabase, WordPress + WooCommerce con WhatsApp checkout, o plataformas No-Code tipo Glide/FlutterFlow).

Flujo Operativo vía WhatsApp:

El pedido estructurado debe llegar a una central de despacho (o al WhatsApp del restaurante con copia al despachador).

Entregables que requiero:

Arquitectura Técnica Recomendada: Stack tecnológico más rápido y económico de implementar y mantener.

Modelo de Base de Datos: Esquema básico de tablas (Negocios, Categorías, Productos, Pedidos).

Formato del Mensaje de WhatsApp: Plantilla de texto preformateada que recibirá el despachador/restaurante.

Estructura del Proyecto y Pasos de Implementación: Guía paso a paso para desplegar la web lista para producción.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/157a557f-7560-4134-ad11-fc790b091068).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
