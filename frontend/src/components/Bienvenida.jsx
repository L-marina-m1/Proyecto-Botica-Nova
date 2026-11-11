import { useEffect, useState } from 'react'
import { obtenerSesion } from '../services/authService'

export default function Bienvenida() {
  const [visible, setVisible] = useState(
    () => sessionStorage.getItem('novasalud_bienvenida') === '1',
  )
  const nombre = obtenerSesion()?.usuario?.nombre

  useEffect(() => {
    sessionStorage.removeItem('novasalud_bienvenida')
    if (!visible) return undefined
    const temporizador = setTimeout(() => setVisible(false), 6000)
    return () => clearTimeout(temporizador)
  }, [visible])

  if (!visible) return null

  return <p className="bienvenida">¡Bienvenido/a, {nombre}!</p>
}