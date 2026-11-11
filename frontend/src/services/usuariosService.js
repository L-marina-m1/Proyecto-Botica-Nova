import api from './api'

export async function listarUsuarios() {
  const { data } = await api.get('/usuarios')
  return data.data
}

export async function crearUsuario(usuario) {
  await api.post('/usuarios', usuario)
}

export async function actualizarUsuario(id, cambios) {
  await api.put(`/usuarios/${id}`, cambios)
}