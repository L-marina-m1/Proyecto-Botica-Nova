import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

// Colores corporativos de Nova Salud
const COLORES = {
  azul: [24, 65, 105],
  verde: [39, 153, 117],
  gris: [95, 105, 115],
  claro: [239, 245, 248],
}

// Cargar el logo desde la carpeta public
async function cargarLogo() {
  try {
    const respuesta = await fetch('/logo.png')

    if (!respuesta.ok) {
      throw new Error('No se pudo cargar el logo')
    }

    const blob = await respuesta.blob()

    return await new Promise((resolve, reject) => {
      const lector = new FileReader()
      lector.onload = () => resolve(lector.result)
      lector.onerror = reject
      lector.readAsDataURL(blob)
    })
  } catch (error) {
    console.warn('No se pudo cargar el logo:', error)
    return null
  }
}

// Formato de moneda peruana
function moneda(valor) {
  return `S/ ${Number(valor || 0).toFixed(2)}`
}

// Fecha de emisión
function formatearFecha(fecha) {
  if (!fecha) return 'No disponible'

  const fechaVenta = new Date(fecha)

  return fechaVenta.toLocaleString('es-PE', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

// Crear el documento PDF
export async function generarBoletaPDF(venta) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5',
  })

  const ancho = doc.internal.pageSize.getWidth()
  const margen = 12

  const logo = await cargarLogo()

  // Encabezado corporativo
  doc.setFillColor(...COLORES.azul)
  doc.rect(0, 0, ancho, 39, 'F')

  // Logo
  if (logo) {
    try {
      doc.addImage(logo, 'PNG', margen, 6, 25, 25, undefined, 'FAST')
    } catch (error) {
      console.warn('No se pudo insertar el logo:', error)
    }
  }

  // Nombre de la empresa
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(19)
  doc.text('NOVA SALUD', logo ? 43 : margen, 17)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text('SALUD Y BIENESTAR PARA TODOS', logo ? 43 : margen, 23)

  doc.setFontSize(9)
  doc.text('RUC: 123456789012', logo ? 43 : margen, 30)

  // Título
  doc.setTextColor(...COLORES.azul)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text('BOLETA DE VENTA', ancho / 2, 49, { align: 'center' })

  doc.setDrawColor(...COLORES.verde)
  doc.setLineWidth(0.8)
  doc.line(margen, 53, ancho - margen, 53)

  // Información de la venta
  let y = 62

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORES.azul)

  doc.text(`N° DE VENTA: ${venta.id}`, margen, y)

  y += 7

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...COLORES.gris)

  doc.text(`Fecha: ${formatearFecha(venta.fecha)}`, margen, y)

  y += 6
  doc.text(`Cliente: ${venta.cliente || 'Cliente general'}`, margen, y)

  y += 6
  doc.text(`Vendedor: ${venta.vendedor || 'No especificado'}`, margen, y)

  // Tabla de productos
  const detalle = venta.detalle || []

  autoTable(doc, {
    startY: y + 5,
    margin: { left: margen, right: margen },
    head: [['Producto', 'Cant.', 'P. Unit.', 'Subtotal']],
    body: detalle.map((item) => [
      item.nombre,
      String(item.cantidad),
      moneda(item.precio_unitario),
      moneda(item.subtotal),
    ]),
    theme: 'striped',
    styles: {
      font: 'helvetica',
      fontSize: 7,
      cellPadding: 2.5,
      textColor: [65, 75, 85],
      lineColor: [225, 230, 235],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: COLORES.azul,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 57 },
      1: { halign: 'center', cellWidth: 13 },
      2: { halign: 'right', cellWidth: 25 },
      3: { halign: 'right', cellWidth: 27 },
    },
    didDrawPage: () => {
      // Mantener los márgenes y el diseño de la tabla.
    },
  })

  // Total de la venta
  let finalY = doc.lastAutoTable.finalY + 12

  if (finalY > 175) {
    doc.addPage()
    finalY = 25
  }

  doc.setFillColor(...COLORES.claro)
  doc.roundedRect(margen, finalY - 7, ancho - margen * 2, 17, 2, 2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...COLORES.azul)

  doc.text('TOTAL A PAGAR:', margen + 5, finalY + 3)

  doc.setTextColor(...COLORES.verde)
  doc.text(
    moneda(venta.total),
    ancho - margen - 5,
    finalY + 3,
    { align: 'right' },
  )

  // Pie de página
  const alto = doc.internal.pageSize.getHeight()

  doc.setDrawColor(...COLORES.verde)
  doc.setLineWidth(0.5)
  doc.line(margen, alto - 20, ancho - margen, alto - 20)

  doc.setTextColor(...COLORES.gris)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)

  doc.text(
    '¡Gracias por confiar en Nova Salud!',
    ancho / 2,
    alto - 14,
    { align: 'center' },
  )

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)

  doc.text(
    'Documento interno de registro de venta.',
    ancho / 2,
    alto - 9,
    { align: 'center' },
  )

  // Devolver el PDF como URL para abrirlo en el navegador
  const archivo = doc.output('blob')

  return URL.createObjectURL(archivo)
}

// Abrir el PDF en la pestaña previamente preparada
export function abrirBoletaPDF(ventana, url) {
  if (ventana && !ventana.closed) {
    ventana.location.href = url
  } else {
    window.open(url, '_blank')
  }

  // Liberar memoria después de un tiempo
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}
