import api from './api'

export async function listarCategorias() {
  const { data } = await api.get('/categorias')
  return data.data
}