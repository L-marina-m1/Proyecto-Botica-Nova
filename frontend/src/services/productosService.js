import api from './api'
import { productosIniciales } from '../data/productos'

// true = datos de prueba | false = backend real de Josue
const USE_MOCK = true

let mock = [...productosIniciales]

export async function listarProductos() {
  if (USE_MOCK) return [...mock]
  const { data } = await api.get('/productos')
  return data
}

export async function crearProducto(producto) {
  if (USE_MOCK) {
    mock.push({ ...producto, id: Date.now() })
    return
  }
  await api.post('/productos', producto)
}

export async function actualizarProducto(id, producto) {
  if (USE_MOCK) {
    mock = mock.map((p) => (p.id === id ? { ...p, ...producto } : p))
    return
  }
  await api.put(`/productos/${id}`, producto)
}

export async function eliminarProducto(id) {
  if (USE_MOCK) {
    mock = mock.filter((p) => p.id !== id)
    return
  }
  await api.delete(`/productos/${id}`)
}

export function descontarStockMock(items) {
  mock = mock.map((p) => {
    const item = items.find((i) => i.id === p.id)
    return item ? { ...p, stock: p.stock - item.cantidad } : p
  })
}