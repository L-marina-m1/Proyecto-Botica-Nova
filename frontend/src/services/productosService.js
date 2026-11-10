import api from './api'

export async function listarProductos() {
  const { data } = await api.get('/productos')
  return data.data
}

export async function crearProducto(producto) {
  await api.post('/productos', producto)
}

export async function actualizarProducto(id, producto) {
  await api.put(`/productos/${id}`, producto)
}

export async function eliminarProducto(id) {
  const { data } = await api.delete(`/productos/${id}`)
  return data.mensaje
}