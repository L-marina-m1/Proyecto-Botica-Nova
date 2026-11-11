# Botica Nova Salud - Backend (API REST)

Node.js + Express + MySQL. Autenticación JWT.

## Estructura
```
backend/
├── sql/schema.sql          # tablas + datos de ejemplo
├── scripts/crearAdmin.js   # crea el usuario admin
├── docs/                   # DER y lista de endpoints
└── src/
    ├── config/db.js        # pool MySQL
    ├── routes/             # definición de rutas + validaciones
    ├── controllers/        # lógica de cada módulo
    ├── middlewares/        # auth JWT, validación, errores
    ├── utils/AppError.js
    ├── app.js
    └── server.js
```

## Ejecutar en local
```bash
cp .env.example .env        # edita credenciales de MySQL y JWT_SECRET
mysql -u root -p < sql/schema.sql
npm install
npm run seed:admin          # admin@botica.com / admin123
npm run dev                 # o: npm start
```
Prueba: `GET http://localhost:3000/api/health`

## Variables de entorno
`PORT, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, JWT_EXPIRES_IN, CORS_ORIGIN`
(En Docker, `DB_HOST` será el nombre del servicio de MySQL, p. ej. `db`.)

Endpoints: ver `docs/ENDPOINTS.md`.
