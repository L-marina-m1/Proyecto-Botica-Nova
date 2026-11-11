# Endpoints - Botica Nova Salud API

Base URL: `http://IP_SERVIDOR:3000/api`
Todas las rutas (excepto `/health` y `/auth/login`) requieren header `Authorization: Bearer <token>`.
Respuestas de error: `{ "ok": false, "mensaje": "...", "detalles": [...] }`

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | /health | público | Verifica que la API responde |
| POST | /auth/login | público | Login → devuelve `token` y `usuario` |
| POST | /auth/registrar | admin | Crear usuario |
| GET | /auth/perfil | autenticado | Datos del token |
| GET | /categorias | autenticado | Listar categorías |
| POST | /categorias | admin | Crear categoría |
| PUT | /categorias/:id | admin | Editar categoría |
| DELETE | /categorias/:id | admin | Eliminar (si no tiene productos) |
| GET | /productos?q=&categoria_id=&bajo_stock=true | autenticado | Listar / buscar |
| GET | /productos/:id | autenticado | Detalle |
| POST | /productos | admin | Registrar producto |
| PUT | /productos/:id | admin | Editar producto |
| DELETE | /productos/:id | admin | Eliminar (o desactivar si tiene ventas) |
| POST | /ventas | autenticado | Registrar venta y descontar stock (transacción) |
| GET | /ventas | autenticado | Últimas 200 ventas |
| GET | /ventas/:id | autenticado | Venta con su detalle |
| GET | /alertas/bajo-stock | autenticado | Productos con stock <= stock_minimo |

## Ejemplos de body

**POST /auth/login**
```json
{ "email": "admin@botica.com", "password": "admin123" }
```
**POST /productos**
```json
{ "nombre": "Loratadina 10mg", "descripcion": "Caja x 10", "categoria_id": 1, "precio": 6.5, "stock": 30, "stock_minimo": 8 }
```
**POST /ventas**
```json
{ "cliente": "Juan Pérez", "items": [ { "producto_id": 1, "cantidad": 2 }, { "producto_id": 4, "cantidad": 1 } ] }
```
Respuesta `201`: `{ ok, mensaje, venta: {id,total,cliente}, alertas: [productos que quedaron en bajo stock] }`
Si no alcanza el stock → `409` y NO se guarda nada (rollback).

## Códigos
200 OK · 201 creado · 401 sin token/credenciales · 403 sin permiso · 404 no existe · 409 conflicto (stock/duplicado) · 422 validación
