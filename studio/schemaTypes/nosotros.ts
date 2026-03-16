export default {
  name: 'nosotros',
  title: 'Nosotros',
  type: 'document',
  fields: [
    { name: 'titulo', title: 'Título', type: 'string' },
    { name: 'historia', title: 'Historia', type: 'text' },
    { name: 'equipo', title: 'Equipo', type: 'array', of: [{ type: 'object', fields: [{ name: 'nombre', title: 'Nombre', type: 'string' }, { name: 'cargo', title: 'Cargo', type: 'string' }, { name: 'foto', title: 'Foto', type: 'image' }]}]}
  ]
}
