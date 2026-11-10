import api from './api'

export async function listarProductos({ todos = false } = {}) {
  const { data } = await api.get('/productos', { params: todos ? { todos: true } : {} })
  return data.data
}

export async function crearProducto(producto) {
  await api.post('/productos', producto)
}

export async function actualizarProducto(id, producto) {
  await api.put(`/productos/${id}`, producto)
}

export async function cambiarEstadoProducto(id, activo) {
  await api.patch(`/productos/${id}/estado`, { activo })
}

export async function eliminarProducto(id) {
  const { data } = await api.delete(`/productos/${id}`)
  return data.mensaje
}