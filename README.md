# Proyecto Botica Nova Salud

## Descripción

Desarrollo de una aplicación web para la gestión de una botica, que permite administrar productos farmacéuticos, controlar el inventario, registrar ventas y facilitar la consulta de información.

## Objetivo

Desarrollar un sistema web aplicando tecnologías frontend y backend, utilizando una API REST para la comunicación entre ambos componentes y una base de datos para almacenar la información del sistema.

## Tecnologías

- **Control de versiones:** Git y GitHub.
- **Backend:** Node.js y Express (API REST).
- **Frontend:** React, Vite, HTML, CSS y JavaScript.
- **Comunicación con la API:** Axios.
- **Base de datos:** MySQL.

## Integrantes

- Integrante 1: JOSUE HUARSAYA CHOQUEHUAYTA.
- Integrante 2: WALTER CESAR MOLINA ZAPATA.
- Integrante 3: LUZ MARINA CALIZAYA CHOQUEHUANCA.

## Organización del proyecto

- `backend/`: desarrollo de la API REST, lógica del servidor y conexión con la base de datos.
- `frontend/`: desarrollo de la interfaz de usuario y comunicación con el backend.
- `README.md`: documentación general del proyecto e instrucciones de instalación y ejecución.

## Instalación y ejecución

### Requisitos previos

- Node.js y npm.
- MySQL.
- Git.

### 1. Clonar el repositorio

```bash
git clone https://github.com/L-marina-m1/Proyecto-Botica-Nova.git
cd Proyecto-Botica-Nova
```

### 2. Configurar la base de datos

Crear la base de datos `botica_nova_salud` en MySQL e importar el archivo SQL del proyecto que contiene la estructura necesaria para su funcionamiento.

### 3. Instalar y configurar el backend

Ingresar a la carpeta del backend e instalar las dependencias:

```bash
cd backend
npm install
```

Crear el archivo `.env` a partir de `.env.example`:

```powershell
Copy-Item .env.example .env
```

Configurar en el archivo `.env` los datos de conexión a MySQL y las variables necesarias para la autenticación, incluyendo `ADMIN_EMAIL` y `ADMIN_PASSWORD`.

### 4. Configurar el administrador

Ejecutar el siguiente comando desde la carpeta `backend`:

```bash
npm run seed:admin
```

Este comando configura el usuario administrador utilizando los datos establecidos en el archivo `.env`.

### 5. Iniciar el backend

```bash
npm run dev
```

El servidor estará disponible en:

`http://localhost:3000`

### 6. Instalar e iniciar el frontend

Abrir una nueva terminal desde la carpeta principal del proyecto y ejecutar:

```bash
cd frontend
npm install
npm run dev
```

Para permitir el acceso desde otros dispositivos conectados a la misma red local:

```bash
npm run dev -- --host 0.0.0.0
```

El frontend estará disponible en:

`http://localhost:5173`

## Ejecución del sistema

Para utilizar correctamente la aplicación, se deben mantener en funcionamiento MySQL, el servidor backend y el servidor frontend.

El acceso al sistema se realiza mediante el navegador web, utilizando las credenciales del administrador configuradas durante la instalación.

## Proyecto académico

Trabajo final del curso, orientado al desarrollo de una aplicación web para la gestión de una botica, aplicando conocimientos de desarrollo frontend, backend, bases de datos, API REST y control de versiones.

## Repositorio

[Proyecto Botica Nova Salud en GitHub](https://github.com/L-marina-m1/Proyecto-Botica-Nova)