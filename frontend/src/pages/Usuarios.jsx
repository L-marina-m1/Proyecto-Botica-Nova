import { useEffect, useState } from 'react'
import { listarUsuarios, crearUsuario, actualizarUsuario } from '../services/usuariosService'
import { obtenerSesion, etiquetaRol } from '../services/authService'
import { mensajeError } from '../services/api'

const vacio = { nombre: '', email: '', password: '', rol: 'vendedor' }

export default function Usuarios() {
  const miId = obtenerSesion()?.usuario?.id
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState(vacio)
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const recargar = async () => setUsuarios(await listarUsuarios())

  useEffect(() => {
    listarUsuarios()
      .then(setUsuarios)
      .catch((err) => setError(mensajeError(err, 'No se pudieron cargar los usuarios')))
  }, [])

  const manejarCambio = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const limpiar = () => {
    setForm(vacio)
    setEditandoId(null)
  }

  const guardar = async (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')
    try {
      if (editandoId) {
        const cambios = { nombre: form.nombre.trim(), email: form.email.trim(), rol: form.rol }
        if (form.password) cambios.password = form.password
        await actualizarUsuario(editandoId, cambios)
        setMensaje('Usuario actualizado correctamente')
      } else {
        await crearUsuario({
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          password: form.password,
          rol: form.rol,
        })
        setMensaje('Usuario creado correctamente')
      }
      limpiar()
      await recargar()
    } catch (err) {
      setError(mensajeError(err, 'No se pudo guardar el usuario'))
    }
  }

  const editar = (u) => {
    setEditandoId(u.id)
    setMensaje('')
    setError('')
    setForm({ nombre: u.nombre, email: u.email, password: '', rol: u.rol })
  }

  const alternarEstado = async (u) => {
    const accion = u.activo ? 'deshabilitar' : 'habilitar'
    if (!window.confirm(`¿Quieres ${accion} a "${u.nombre}"?`)) return
    setError('')
    setMensaje('')
    try {
      await actualizarUsuario(u.id, { activo: !u.activo })
      setMensaje(u.activo ? `"${u.nombre}" fue deshabilitado` : `"${u.nombre}" fue habilitado`)
      await recargar()
    } catch (err) {
      setError(mensajeError(err, 'No se pudo cambiar el estado del usuario'))
    }
  }

  return (
    <div>
      <h1>Usuarios</h1>

      {mensaje && <p className="exito">{mensaje}</p>}
      {error && <p className="error">{error}</p>}

      <form className="card form-grid" onSubmit={guardar}>
        <input name="nombre" placeholder="Nombre completo" value={form.nombre} onChange={manejarCambio} required maxLength={100} />
        <input name="email" type="email" placeholder="Correo electrónico" value={form.email} onChange={manejarCambio} required />
        <input
          name="password"
          type="password"
          placeholder={editandoId ? 'Nueva contraseña (opcional)' : 'Contraseña (mínimo 8)'}
          value={form.password}
          onChange={manejarCambio}
          required={!editandoId}
          minLength={editandoId && !form.password ? undefined : 8}
          autoComplete="new-password"
        />
        <select name="rol" value={form.rol} onChange={manejarCambio} disabled={editandoId === miId}>
          <option value="vendedor">Trabajador</option>
          <option value="admin">Administrador</option>
        </select>
        <div className="acciones">
          <button type="submit" className="btn primario">
            {editandoId ? 'Guardar cambios' : 'Crear usuario'}
          </button>
          {editandoId && (
            <button type="button" className="btn" onClick={limpiar}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <table className="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className={u.activo ? '' : 'fila-inactiva'}>
              <td>{u.nombre}{u.id === miId ? ' (tú)' : ''}</td>
              <td>{u.email}</td>
              <td>
                <span className={u.rol === 'admin' ? 'badge rol-admin' : 'badge rol-trabajador'}>
                  {etiquetaRol(u.rol)}
                </span>
              </td>
              <td>
                <span className={u.activo ? 'badge ok' : 'badge inactivo'}>
                  {u.activo ? 'Habilitado' : 'Deshabilitado'}
                </span>
              </td>
              <td className="acciones">
                <button className="btn" onClick={() => editar(u)}>Editar</button>
                {u.id !== miId && (
                  <button className="btn" onClick={() => alternarEstado(u)}>
                    {u.activo ? 'Deshabilitar' : 'Habilitar'}
                  </button>
                )}
              </td>
            </tr>
          ))}
          {usuarios.length === 0 && (
            <tr>
              <td colSpan="5">No hay usuarios registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}