import clients from '../../data/clients.json';

function normalizeName(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export default function handler(req, res) {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Nombre requerido' });
  }

  const allClients = Object.values(clients);
  if (!allClients.length) {
    return res.status(500).json({ error: 'No hay clientes en la base' });
  }

  // normalizar todos para búsqueda
  const normalized = normalizeName(name);
  const enriched = allClients.map(c => ({
    ...c,
    _norm: normalizeName(c.name)
  }));

  const client = enriched.find(c => c._norm === normalized);

  if (!client) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }

  const totals = allClients.map(c => c.total_asistencias);
  const totalClients = totals.length;
  const sortedTotals = [...totals].sort((a, b) => a - b);
  const maxAsistencias = Math.max(...totals);

  const clientTotal = client.total_asistencias;

  const firstIndexWithThisTotal = sortedTotals.findIndex(v => v === clientTotal);
  const rankFromBottom = firstIndexWithThisTotal;
  const rankFromTop = totalClients - rankFromBottom;
  const percentile = Math.round((rankFromTop / totalClients) * 100);

  let nivel = '';
  let titulo = '';

  if (clientTotal <= 10) {
    nivel = 'Explorando el movimiento';
    titulo = 'Cada clase fue un statement';
  } else if (clientTotal <= 30) {
    nivel = 'Construyendo disciplina';
    titulo = 'Ya no eres el mismo de enero';
  } else if (clientTotal <= 60) {
    nivel = 'Constancia real';
    titulo = 'Tu cuerpo ya sabe el camino';
  } else if (clientTotal <= 100) {
    nivel = 'Modo imparable';
    titulo = 'Parte del ADN de Caamp';
  } else {
    nivel = 'Leyenda Caamp';
    titulo = 'Tu constancia es otro nivel';
  }

  const promedioMensual = Number((clientTotal / 12).toFixed(1));
  const promedioSemanal = Number((clientTotal / 52).toFixed(1));

  res.status(200).json({
    name: client.name,
    total_asistencias: clientTotal,
    total_clients: totalClients,
    rank: rankFromTop,
    percentile,
    max_asistencias: maxAsistencias,
    nivel,
    titulo,
    promedio_mensual: promedioMensual,
    promedio_semanal: promedioSemanal
  });
}
