import api from './api'

export async function registrarVenta(items, cliente) {
  const { data } = await api.post('/ventas', {
    ...(cliente ? { cliente } : {}),
    items: items.map((i) => ({ producto_id: i.id, cantidad: i.cantidad })),
  })
  return data
}