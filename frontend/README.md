# Nova Salud: Frontend

Interfaz web del sistema de gestión de inventario y ventas de la botica **Nova Salud**. Está hecha con React y consume la API REST del backend (Node.js + Express).

El sistema es de uso interno: lo utiliza el personal de la botica para gestionar productos, registrar ventas y revisar alertas de reposición.

## Tecnologías

- React con Vite
- React Router (navegación entre pantallas)
- Axios (comunicación con la API REST)
- Docker + Nginx (despliegue)

## Funcionalidades

- **Login** con protección de rutas: sin sesión iniciada solo se accede a la pantalla de acceso.
- **Panel principal:** indicadores de productos, unidades, valor del inventario y productos con bajo stock.
- **Productos:** listado, búsqueda, registro, edición y eliminación.
- **Ventas:** búsqueda de medicamentos, carrito, cálculo del total y confirmación. Al confirmar se actualiza el stock.
- **Alertas de stock:** productos cuyo stock es menor o igual a su stock mínimo.
- **Diseño responsivo:** funciona en PC, tablet y celular.

## Requisitos

- Node.js 20.19 o superior (se recomienda Node 22 LTS)
- npm

## Ejecución en desarrollo

```bash
cd frontend
npm install
npm run dev
```

La aplicación se abre en `http://localhost:5173/` (si el puerto está ocupado, Vite usa otro y lo indica en la terminal).

Para abrirla desde otro dispositivo de la misma red (por ejemplo, un celular):

```bash
npm run dev -- --host
```

Luego se escribe en el navegador del otro dispositivo la dirección que aparece en la línea `Network`.

## Compilar para producción

```bash
npm run build
```

Genera la carpeta `dist/` con los archivos listos para servir.

## Conexión con el backend

La dirección de la API se define en `src/services/api.js`:

1. Si existe la variable de entorno `VITE_API_URL`, se usa esa dirección (por ejemplo `/api`).
2. Si no existe, se usa la misma dirección con la que se abrió la aplicación, en el puerto 3000: `http://<host>:3000/api`.

Así la aplicación funciona sin cambios en `localhost`, en la red local o detrás de Nginx.

Rutas de la API que consume el frontend:

| Método | Ruta | Uso |
|---|---|---|
| POST | `/auth/login` | Iniciar sesión (devuelve un token) |
| GET | `/productos` | Listar productos |
| POST | `/productos` | Registrar producto |
| PUT | `/productos/:id` | Actualizar producto |
| DELETE | `/productos/:id` | Eliminar producto |
| POST | `/ventas` | Registrar una venta |

El token recibido al iniciar sesión se guarda en el navegador y se envía en cada petición en la cabecera `Authorization: Bearer <token>`.

### Modo de datos de prueba

Mientras el backend no está conectado, cada servicio de `src/services/` tiene una constante:

```js
const USE_MOCK = true
```

- `true`: usa datos de prueba en memoria (productos de ejemplo; usuario `admin`, contraseña `admin123`).
- `false`: usa el backend real mediante la API REST.

Para trabajar con el backend hay que poner `USE_MOCK = false` en `authService.js`, `productosService.js` y `ventasService.js`.

## Estructura del proyecto

```text
frontend/
├── src/
│   ├── assets/        Logo
│   ├── components/    Layout (menú) y RutaProtegida
│   ├── data/          Datos de prueba
│   ├── pages/         Login, Dashboard, Productos, Ventas, Alertas
│   ├── services/      Comunicación con la API (axios)
│   ├── App.jsx        Definición de rutas
│   ├── main.jsx       Punto de entrada
│   └── index.css      Estilos
├── Dockerfile
├── nginx.conf
└── .dockerignore
```

## Docker

El `Dockerfile` trabaja en dos etapas:

1. Compila la aplicación con Node.
2. Sirve los archivos compilados con Nginx en el puerto 80.

La variable `VITE_API_URL` se recibe al construir la imagen y por defecto vale `/api`. El archivo `nginx.conf` redirige las peticiones que comienzan con `/api/` al servicio `backend` en el puerto 3000, y devuelve `index.html` para las demás rutas de React.

El frontend está pensado para ejecutarse junto con el backend y la base de datos mediante `docker compose`. Por separado, Nginx no arranca si no encuentra el servicio `backend`.