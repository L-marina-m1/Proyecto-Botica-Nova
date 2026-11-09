import api from './api'
import { descontarStockMock } from './productosService'

// true = datos de prueba | false = backend real de Josue
const USE_MOCK = true

export async function registrarVenta(items) {
  const total = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0)

  if (USE_MOCK) {
    descontarStockMock(items)
    return { total }
  }

  const { data } = await api.post('/ventas', {
    items: items.map((i) => ({
      producto_id: i.id,
      cantidad: i.cantidad,
      precio: i.precio,
    })),
  })
  return data
}