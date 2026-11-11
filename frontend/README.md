# BOTICA NOVA SALUD
## Sistema de gestión de inventario y ventas

Botica Nova Salud es un sistema de uso interno desarrollado para gestionar los productos, el inventario y las ventas de una botica. Permite al personal administrar medicamentos, registrar operaciones de venta, consultar indicadores y recibir alertas de reposición de productos.

El proyecto está compuesto por una interfaz web desarrollada con React y Vite, un backend desarrollado con Node.js y Express, y una base de datos MySQL.

---

# 1. Tecnologías utilizadas

## Backend
- Node.js: entorno de ejecución de JavaScript.
- Express: framework para desarrollar la API REST.
- MySQL: sistema de gestión de bases de datos.
- Axios: comunicación entre el frontend y los servicios.
- JWT: autenticación mediante tokens.
- bcrypt: protección de contraseñas.

## Frontend
- React: biblioteca para construir interfaces de usuario.
- Vite: herramienta de desarrollo y compilación.
- React Router: navegación entre pantallas.
- Axios: comunicación con la API REST.
- Docker y Nginx: herramientas contempladas para el despliegue.

---

# 2. Funcionalidades principales

El sistema cuenta con las siguientes funcionalidades:

- **Inicio de sesión:** autenticación de usuarios y protección de rutas.
- **Panel principal:** indicadores de productos, unidades, valor del inventario y productos con bajo stock.
- **Gestión de productos:** listado, búsqueda, registro, edición y eliminación.
- **Gestión de ventas:** búsqueda de medicamentos, carrito de compras, cálculo del total y confirmación de ventas. Al confirmar una venta, se actualiza el stock.
- **Historial de ventas:** consulta de las ventas registradas.
- **Alertas de stock:** identificación de productos cuyo stock es menor o igual a su stock mínimo.
- **Gestión de usuarios:** administración de usuarios y roles.
- **Diseño responsivo:** interfaz adaptable a computadoras, tablets y celulares.

El sistema está destinado al uso interno del personal de la botica.

---

# 3. Requisitos previos

Antes de instalar el proyecto, se deben tener los siguientes programas:

- **Node.js:** versión 20.19 o superior para el frontend. Se recomienda Node.js 22 LTS.
- **npm:** administrador de paquetes de Node.js.
- **MySQL Server:** motor de base de datos.
- **Git:** sistema de control de versiones.
- **Visual Studio Code:** editor de código.

---

# 4. Clonar el repositorio

Abrir una terminal de PowerShell y ejecutar:

```powershell
git clone -b develop https://github.com/L-marina-m1/Proyecto-Botica-Nova.git
```

Ingresar a la carpeta del proyecto:

```powershell
cd Proyecto-Botica-Nova
```

La estructura principal del proyecto es:

```text
Proyecto-Botica-Nova/
│
├── backend/
│   ├── docs/
│   ├── scripts/
│   ├── sql/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── README.md
│
└── README.md
```

---

# 5. Configuración de la base de datos MySQL

Antes de iniciar el backend, es necesario preparar la base de datos.

1. Instalar e iniciar el servicio de MySQL.
2. Crear una base de datos denominada `botica_nova_salud`.
3. Importar los archivos SQL necesarios que se encuentran en la carpeta `backend/sql`.
4. Verificar que se hayan creado las tablas necesarias para el funcionamiento del sistema.

**Importante:** clonar el repositorio no descarga automáticamente la base de datos ni sus registros. Es necesario realizar su inicialización en cada computadora.

---

#6. Instalación y configuración del backend

El backend requiere la instalación de sus dependencias y la configuración de las variables de entorno para establecer la conexión con la base de datos y los servicios de autenticación.

##6.1. Para Windows (PowerShell)

Abrir una terminal de PowerShell desde la carpeta principal del proyecto.

Ingresar a la carpeta del backend:

powershell
cd backend


Instalar las dependencias:

powershell
npm install


Crear el archivo de configuración local:

powershell
Copy-Item .env.example .env


Abrir el archivo .env:

powershell
code .env

6.2. Para Ubuntu Linux (Terminal)

Abrir una terminal desde la carpeta principal del proyecto.

Ingresar a la carpeta del backend:

bash
cd backend


Instalar las dependencias:

bash
npm install


Crear el archivo de configuración local:

bash
cp .env.example .env


Abrir el archivo .env:

bash
code .env

##6.3. Configuración de las variables de entorno

En ambos sistemas operativos, configurar el archivo .env con los datos correspondientes a la computadora donde se ejecutará el proyecto:

env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=botica_nova_salud

JWT_SECRET=COLOCAR_UNA_CLAVE_ALEATORIA_SEGURA
JWT_EXPIRES_IN=8h

CORS_ORIGIN=*

ADMIN_EMAIL=admin@botica.com
ADMIN_PASSWORD=COLOCAR_UNA_CONTRASENA_SEGURA


Guardar los cambios realizados en el archivo .env.

Consideraciones:

Generar una clave JWT aleatoria, larga y privada.
Configurar una contraseña segura para el administrador.
No publicar el archivo .env en GitHub.
Mantener .env.example sin credenciales reales.
Verificar que los datos de conexión a MySQL correspondan a la configuración de cada computadora.

### Descripción de las variables

| Variable | Descripción |
|---|---|
| PORT | Puerto de ejecución del backend. |
| DB_HOST | Dirección del servidor MySQL. |
| DB_PORT | Puerto de conexión de MySQL. |
| DB_USER | Usuario de MySQL. |
| DB_PASSWORD | Contraseña del usuario de MySQL. |
| DB_NAME | Nombre de la base de datos. |
| JWT_SECRET | Clave secreta para firmar los tokens de autenticación. |
| JWT_EXPIRES_IN | Tiempo de validez del token. |
| CORS_ORIGIN | Origen o política de acceso permitida para las solicitudes del frontend. |
| ADMIN_EMAIL | Correo del administrador inicial. |
| ADMIN_PASSWORD | Contraseña inicial del administrador. |

**Consideraciones de seguridad:**

- Generar una clave JWT aleatoria, larga y privada.
- Configurar una contraseña segura para el administrador.
- No publicar el archivo `.env` en GitHub.
- Mantener `.env.example` sin credenciales reales.

## 6.1. Crear el usuario administrador

Una vez configurado el archivo `.env` y preparada la base de datos, ejecutar:

```powershell
npm run seed:admin
```

Este comando ejecuta el siguiente script:

```text
backend/scripts/crearAdmin.js
```

Su función es configurar el usuario administrador utilizando las variables `ADMIN_EMAIL` y `ADMIN_PASSWORD`.

Si el proceso termina correctamente, aparecerá un mensaje similar a:

```text
-----------------------------------
 BOTICA NOVA SALUD
-----------------------------------
✔ Administrador configurado
✔ Correo: admin@botica.com
✔ Contraseña protegida mediante bcrypt
-----------------------------------
```

Este procedimiento debe realizarse durante la configuración inicial de la instalación. No es necesario ejecutarlo cada vez que se inicia el servidor.

## 6.2. Iniciar el servidor backend

Desde la carpeta `backend`, ejecutar:

```powershell
npm run dev
```

Si todo está correctamente configurado, aparecerá:

```text
-----------------------------------
 BOTICA NOVA SALUD
-----------------------------------
✔ Conectado correctamente a MySQL
✔ Base de datos: botica_nova_salud
-----------------------------------
✔ Servidor iniciado en puerto 3000
✔ API: http://localhost:3000
✔ Health: http://localhost:3000/api/health
-----------------------------------
```

**Mantener esta terminal abierta** mientras se utilice el sistema.

---

# 7. Instalación y ejecución del frontend

Abrir una segunda terminal de PowerShell, manteniendo activa la terminal del backend.

Desde la carpeta principal del proyecto, ingresar al frontend:

```powershell
cd frontend
```

Instalar las dependencias:

```powershell
npm install
```

## 7.1. Iniciar el frontend

Para ejecutar el proyecto y permitir conexiones desde otros dispositivos de la misma red, utilizar:

```powershell
npm run dev -- --host 0.0.0.0
```

Se mostrará una salida similar a:

```text
VITE v8.3.6 ready

➜ Local:   http://localhost:5173/
➜ Network: http://192.168.X.X:5173/
```

La dirección de red dependerá de la dirección IPv4 asignada a la computadora.

**Mantener también esta terminal abierta** mientras se utilice el sistema.

## 7.2. Acceso desde la misma computadora

Una vez iniciados ambos servidores, se puede acceder desde el navegador:

| Servicio | Dirección |
|---|---|
| Frontend | http://localhost:5173/ |
| Backend API | http://localhost:3000 |
| Health API | http://localhost:3000/api/health |

---

# 8. Acceso desde otros dispositivos de la misma red Wi-Fi

Para acceder desde otro equipo o teléfono:

1. Conectar ambos dispositivos a la misma red Wi-Fi.
2. En la computadora donde se ejecuta el proyecto, abrir PowerShell.
3. Ejecutar:

```powershell
ipconfig
```

4. Buscar el apartado correspondiente al adaptador Wi-Fi.
5. Identificar la dirección IPv4 de la computadora.
6. Utilizar la dirección IP obtenida para acceder desde el otro dispositivo.

Por ejemplo, durante las pruebas se utilizaron estas direcciones:

| Servicio | Dirección de prueba |
|---|---|
| Frontend | http://192.168.68.59:5173/ |
| Backend API | http://192.168.68.59:3000 |
| Health API | http://192.168.68.59:3000/api/health |

La dirección IP puede cambiar cuando se conecta nuevamente a la red Wi-Fi. Por eso, siempre se debe comprobar la dirección IPv4 actual.

### Consideraciones para la conexión por Wi-Fi

- El frontend debe iniciarse utilizando `--host 0.0.0.0`.
- El backend debe escuchar en `0.0.0.0` para aceptar conexiones de otros dispositivos.
- Windows Firewall debe permitir las conexiones entrantes a los puertos 5173 y 3000 en la red privada.
- El router no debe tener activado el aislamiento de dispositivos que impida la comunicación entre equipos.

Estas instrucciones corresponden al entorno de desarrollo local. No se debe exponer el servidor directamente a Internet sin configurar HTTPS y las medidas de seguridad necesarias.

---

# 9. Conexión del frontend con el backend

La dirección de la API se define en:

```text
frontend/src/services/api.js
```

La aplicación utiliza el siguiente mecanismo:

1. Si existe la variable de entorno `VITE_API_URL`, se utiliza esa dirección.
2. Si no existe, se utiliza la misma dirección con la que se abrió la aplicación, pero utilizando el puerto 3000 y la ruta `/api`.

Por ejemplo:

```text
http://localhost:3000/api
```

O desde otro dispositivo de la red local:

```text
http://192.168.68.59:3000/api
```

Esto permite trabajar en `localhost`, en la red local o detrás de un servidor Nginx configurado como proxy inverso.

## 9.1. Rutas de la API consumidas por el frontend

| Método | Ruta | Uso |
|---|---|---|
| POST | `/auth/login` | Iniciar sesión y obtener un token. |
| GET | `/productos` | Listar productos. |
| POST | `/productos` | Registrar un producto. |
| PUT | `/productos/:id` | Actualizar un producto. |
| DELETE | `/productos/:id` | Eliminar un producto. |
| POST | `/ventas` | Registrar una venta. |

El token recibido al iniciar sesión se guarda en el navegador y se envía en cada petición mediante la cabecera:

```text
Authorization: Bearer <token>
```

La aplicación utiliza Axios para gestionar las solicitudes HTTP y comunicarse con la API REST.

## 9.2. Modo de datos de prueba

El frontend dispone de servicios que permiten trabajar con datos de prueba cuando el backend no está conectado.

En los archivos de servicios correspondientes se encuentra la constante:

```javascript
const USE_MOCK = true
```

Su funcionamiento es el siguiente:

- `true`: utiliza datos de prueba en memoria.
- `false`: utiliza el backend real mediante la API REST.

Para trabajar con el backend real, configurar:

```javascript
const USE_MOCK = false
```

En los siguientes archivos:

```text
frontend/src/services/authService.js
frontend/src/services/productosService.js
frontend/src/services/ventasService.js
```

Cuando se utiliza el backend real, el inicio de sesión debe realizarse con las credenciales del administrador configuradas durante la instalación.

---

# 10. Compilación del frontend para producción

Para generar los archivos optimizados de la aplicación, ingresar a la carpeta `frontend` y ejecutar:

```powershell
npm run build
```

Este proceso genera la carpeta:

```text
frontend/dist/
```

En ella se encuentran los archivos compilados y preparados para ser servidos mediante un servidor web como Nginx.

---

# 11. Estructura del frontend

La organización principal del frontend es la siguiente:

```text
frontend/
│
├── public/
│
├── src/
│   ├── assets/          Logo y recursos gráficos
│   ├── components/      Layout y RutaProtegida
│   ├── data/            Datos de prueba
│   ├── pages/           Pantallas del sistema
│   ├── services/        Comunicación con la API mediante Axios
│   ├── App.jsx          Definición de rutas
│   ├── main.jsx         Punto de entrada
│   └── index.css        Estilos generales
│
├── Dockerfile
├── nginx.conf
├── .dockerignore
├── package.json
└── vite.config.js
```

---

# 12. Despliegue mediante Docker y Nginx

El frontend incorpora un `Dockerfile` que trabaja en dos etapas:

1. **Compilación:** utiliza Node.js para instalar dependencias y compilar la aplicación.
2. **Servidor web:** utiliza Nginx para servir los archivos generados en la carpeta `dist`.

La variable `VITE_API_URL` se recibe durante la construcción de la imagen y tiene como valor predeterminado `/api`.

El archivo `nginx.conf` establece el comportamiento del servidor:

- Redirige las solicitudes que comienzan con `/api/` al servicio `backend` mediante el puerto 3000.
- Devuelve `index.html` para las demás rutas de React, permitiendo la navegación de la aplicación.

El frontend está preparado para ejecutarse junto con el backend y la base de datos mediante Docker Compose, siempre que se configure el servicio correspondiente con el nombre y los puertos esperados por Nginx.

**Importante:** el contenedor del frontend necesita que el servicio `backend` esté disponible en la red de Docker para que funcione la comunicación con la API.

---

# 13. Credenciales de acceso inicial

El usuario administrador se configura mediante las variables de entorno del backend.

| Campo | Valor de ejemplo |
|---|---|
| Correo electrónico | admin@botica.com |
| Contraseña | La configurada en `ADMIN_PASSWORD` |
| Rol | Administrador |

Las credenciales definitivas deben establecerse durante la instalación y mantenerse privadas.

---

# 14. Orden correcto de ejecución

Una vez completada la instalación inicial, para iniciar Botica Nova Salud se deben seguir estos pasos:

### Primera terminal: Backend

Desde la carpeta principal:

```powershell
cd backend
npm run dev
```

### Segunda terminal: Frontend

Desde la carpeta principal, abrir otra terminal:

```powershell
cd frontend
npm run dev -- --host 0.0.0.0
```

No es necesario volver a ejecutar `npm install` ni `npm run seed:admin` cada vez que se inicia el proyecto.

Ambas terminales deben permanecer abiertas mientras se utilice el sistema.

## 14.1. Detener los servidores

Para detener cualquiera de los servidores, utilizar la combinación:

```text
Ctrl + C
```

Se debe realizar en la terminal correspondiente al backend o frontend.

---

# 15. Repositorio del proyecto

**Nombre:** Botica Nova Salud

**Repositorio:** https://github.com/L-marina-m1/Proyecto-Botica-Nova

**Rama de desarrollo:** `develop`

**Tecnologías principales:** React, Vite, Node.js, Express y MySQL.

**Entorno de despliegue contemplado:** Docker y Nginx.
