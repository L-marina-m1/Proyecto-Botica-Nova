import api from './api'

export async function listarAlertas() {
  const { data } = await api.get('/alertas/bajo-stock')
  return data.data
}