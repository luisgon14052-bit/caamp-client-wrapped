import clients from '../../data/clients-data.json';

export default function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Falta el parámetro id' });
  }

  // Asegurarnos de tratar el ID como string tal cual viene en el JSON
  const key = String(id).trim();

  const client = clients[key];

  if (!client) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }

  return res.status(200).json(client);
}
