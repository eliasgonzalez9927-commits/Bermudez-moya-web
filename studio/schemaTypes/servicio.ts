export default {
  name: 'servicio',
  title: 'Servicios',
  type: 'document',
  fields: [
    { name: 'titulo', title: 'Título', type: 'string' },
    { name: 'descripcion', title: 'Descripción', type: 'text' },
    { name: 'icono', title: 'Ícono', type: 'string' },
    { name: 'order', title: 'Orden', type: 'number' }
  ]
}
