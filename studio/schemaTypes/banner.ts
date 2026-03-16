export default {
  name: 'banner',
  title: 'Banners',
  type: 'document',
  fields: [
    { name: 'titulo', title: 'Título', type: 'string' },
    { name: 'subtitulo', title: 'Subtítulo', type: 'string' },
    { name: 'imagen', title: 'Imagen', type: 'image' },
    { name: 'ctaTexto', title: 'Texto del botón', type: 'string' },
    { name: 'ctaAccion', title: 'Acción', type: 'string' },
    { name: 'order', title: 'Orden', type: 'number' }
  ]
}
