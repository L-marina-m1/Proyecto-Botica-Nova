import api from './api'

export async function registrarVenta(items, cliente) {
  const { data } = await api.post('/ventas', {
    ...(cliente ? { cliente } : {}),
    items: items.map((i) => ({ producto_id: i.id, cantidad: i.cantidad })),
  })
  return data
}

export async function listarVentas() {
  const { data } = await api.get('/ventas')
  return data.data
}

export async function obtenerVenta(id) {
  const { data } = await api.get(`/ventas/${id}`)
  return data.data
}