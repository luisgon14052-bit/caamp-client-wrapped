import { useState, useRef } from 'react';

function normalizeName(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export default function ClientWrapped() {
  const [name, setName] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  async function buscar(e) {
    e.preventDefault();
    setError('');
    setData(null);
    setLoading(true);

    try {
      const clean = normalizeName(name);
      const res = await fetch('/api/client?name=' + encodeURIComponent(clean));
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error');
      setData(json);

      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
    } catch (err) {
      setError('No encontramos tu Wrapped. Revisa tu nombre o pregunta en front desk 💚');
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  const progress =
    data && data.max_asistencias
      ? Math.min(100, Math.round((data.total_asistencias / data.max_asistencias) * 100))
      : 0;

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
            "Helvetica Neue", Arial, sans-serif;
          background: radial-gradient(circle at top, #0f172a 0, #020617 50%, #000 100%);
          color: #f9fafb;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientPulse {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes cardFloat {
          0% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
          100% { transform: translateY(0); }
        }
      `}</style>

      <div style={styles.page}>
        <div style={styles.container}>
          {/* HERO / INPUT */}
          {!data && (
            <section style={styles.hero}>
              <div style={styles.heroTopRow}>
                <div style={styles.logoWrap}>
                  <img src="/caamp-logo.png" alt="Caamp" style={styles.logo} />
                  <span style={styles.brandText}>CAAMP</span>
                </div>
                <span style={styles.pill}>Client Wrapped · 2025</span>
              </div>

              <h1 style={styles.title}>
                Tu <span style={styles.gradientText}>año en Caamp</span>
              </h1>

              <p style={styles.subtitle}>
                Mira cuántas veces entrenaste, qué tan constante fuiste y qué lugar ocupas dentro
                de la comunidad. Este es tu resumen del año en movimiento.
              </p>

              <form onSubmit={buscar} style={styles.form}>
                <input
                  style={styles.input}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Escribe tu nombre como aparece en la app"
                />
                <button style={styles.ctaButton} disabled={loading}>
                  {loading ? 'Cargando...' : 'Ver mi Wrapped'}
                </button>
              </form>

              {error && <p style={styles.error}>{error}</p>}

              <p style={styles.helper}>
                Demo: prueba con <strong>Ana López</strong>, <strong>Carlos Rivera</strong>,{' '}
                <strong>Carla Mendoza</strong>, <strong>Mariana Ríos</strong>.
              </p>
            </section>
          )}

          {/* RESULTADOS */}
          {data && (
            <section style={styles.results} ref={containerRef}>
              {/* Encabezado */}
              <div style={styles.headerRow}>
                <div style={styles.headerLeft}>
                  <div style={styles.logoRow}>
                    <img src="/caamp-logo.png" alt="Caamp" style={styles.logoSmall} />
                    <span style={styles.pill}>Client Wrapped · 2025</span>
                  </div>
                  <p style={styles.smallLabel}>Este año fuiste…</p>
                  <h2 style={styles.clientName}>{data.name}</h2>
                  <p style={styles.clientTitle}>{data.titulo}</p>
                </div>

                <div style={styles.levelCard}>
                  <p style={styles.levelLabel}>Nivel de movimiento</p>
                  <p style={styles.levelValue}>{data.nivel}</p>
                  <p style={styles.levelDetail}>
                    Entrenaste más que <strong>{data.percentile}%</strong> de Caamp.
                  </p>
                </div>
              </div>

              {/* Fila principal */}
              <div style={styles.mainGrid}>
                {/* Card total asistencias */}
                <div style={styles.mainCard}>
                  <p style={styles.cardTag}>Total de entrenamientos</p>

                  <div style={styles.mainNumberRow}>
                    <span style={styles.mainNumber}>{data.total_asistencias}</span>
                    <span style={styles.mainNumberCaption}>veces que elegiste moverte</span>
                  </div>

                  <div style={styles.progressBlock}>
                    <div style={styles.progressTrack}>
                      <div
                        style={{
                          ...styles.progressBar,
                          width: `${progress}%`
                        }}
                      />
                    </div>
                    <div style={styles.progressLabels}>
                      <span style={styles.progressLabel}>Inicio del año</span>
                      <span style={styles.progressLabelRight}>Máximo de la comunidad</span>
                    </div>
                  </div>

                  <div style={styles.chipsRow}>
                    <span style={styles.chipPrimary}>
                      Top {data.percentile}% de la comunidad
                    </span>
                    <span style={styles.chipOutline}>
                      Lugar #{data.rank} de {data.total_clients} personas
                    </span>
                  </div>
                </div>

                {/* Card constancia */}
                <div style={styles.secondaryCard}>
                  <p style={styles.cardTag}>Tu constancia</p>

                  <div style={styles.statsRow}>
                    <div style={styles.statBlock}>
                      <p style={styles.statLabel}>Promedio al mes</p>
                      <p style={styles.statNumber}>{data.promedio_mensual}</p>
                      <p style={styles.statHint}>clases / mes</p>
                    </div>
                    <div style={styles.statBlock}>
                      <p style={styles.statLabel}>Promedio a la semana</p>
                      <p style={styles.statNumber}>{data.promedio_semanal}</p>
                      <p style={styles.statHint}>sesiones / semana</p>
                    </div>
                  </div>

                  <p style={styles.secondaryText}>
                    No es perfección, es repetir: clase tras clase fuiste construyendo la versión
                    de ti que hoy se siente más fuerte.
                  </p>
                </div>
              </div>

              {/* Card final / mensaje */}
              <div style={styles.footerCard}>
                <p style={styles.footerTitle}>Lo que lograste este año</p>
                <p style={styles.footerText}>
                  Cada vez que agendaste, llegaste y entrenaste sumó a este número. No es solo
                  fitness: son todas las veces que elegiste moverte, aunque el día no se sintiera
                  perfecto.
                </p>

                <p style={styles.footerHighlight}>
                  Gracias por ser parte de Caamp. Lo que viene, lo seguimos construyendo juntos. 💚
                </p>

                <div style={styles.actionsRow}>
                  <button
                    style={styles.shareButton}
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        const url = window.location.origin + window.location.pathname;
                        navigator.clipboard
                          .writeText(url)
                          .then(() =>
                            alert(
                              'Link copiado. Pega tu Wrapped en stories o compártelo con quien entrenó contigo 💚'
                            )
                          )
                          .catch(() =>
                            alert(
                              'No se pudo copiar automático, copia el link directamente de la barra del navegador.'
                            )
                          );
                      }
                    }}
                  >
                    Copiar link del Wrapped
                  </button>

                  <button
                    style={styles.backButton}
                    onClick={() => {
                      setData(null);
                      setError('');
                      setName('');
                    }}
                  >
                    Ver otro cliente
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    padding: '32px 16px'
  },
  container: {
    width: '100%',
    maxWidth: 960,
    animation: 'fadeUp 480ms ease-out'
  },

  // HERO
  hero: {
    background:
      'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.98), rgba(2,6,23,1))',
    borderRadius: 28,
    padding: 24,
    border: '1px solid rgba(148,163,184,0.28)',
    boxShadow: '0 28px 70px rgba(15,23,42,0.8)',
    color: '#e5e7eb'
  },
  heroTopRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  logo: {
    height: 34,
    width: 'auto'
  },
  brandText: {
    fontSize: 13,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: '#9ca3af'
  },
  pill: {
    padding: '6px 12px',
    borderRadius: 999,
    border: '1px solid rgba(148,163,184,0.6)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#e5e7eb',
    whiteSpace: 'nowrap'
  },
  title: {
    margin: 0,
    marginBottom: 8,
    fontSize: 32,
    fontWeight: 800,
    color: '#f9fafb'
  },
  gradientText: {
    backgroundImage:
      'linear-gradient(120deg, #22c55e, #06b6d4, #eab308)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    backgroundSize: '200% 200%',
    animation: 'gradientPulse 10s ease-in-out infinite'
  },
  subtitle: {
    margin: 0,
    marginBottom: 18,
    fontSize: 15,
    lineHeight: 1.6,
    color: '#cbd5f5',
    maxWidth: 540
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8
  },
  input: {
    flex: 1,
    minWidth: 220,
    padding: 14,
    borderRadius: 999,
    border: '1px solid rgba(148,163,184,0.7)',
    background: 'rgba(15,23,42,0.9)',
    color: '#f9fafb',
    fontSize: 14,
    outline: 'none'
  },
  ctaButton: {
    padding: '14px 22px',
    borderRadius: 999,
    border: 'none',
    backgroundImage:
      'linear-gradient(120deg, #22c55e, #22c55e, #06b6d4)',
    color: '#020617',
    fontWeight: 700,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  error: {
    marginTop: 6,
    fontSize: 13,
    color: '#fca5a5'
  },
  helper: {
    marginTop: 8,
    fontSize: 12,
    color: '#9ca3af'
  },

  // RESULTADOS
  results: {
    background:
      'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,1))',
    borderRadius: 28,
    padding: 22,
    border: '1px solid rgba(148,163,184,0.4)',
    boxShadow: '0 28px 70px rgba(15,23,42,0.95)',
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 18
  },
  headerRow: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 18
  },
  headerLeft: {
    flex: 1,
    minWidth: 220
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8
  },
  logoSmall: {
    height: 30,
    width: 'auto'
  },
  smallLabel: {
    margin: 0,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    color: '#9ca3af'
  },
  clientName: {
    margin: '4px 0 4px',
    fontSize: 26,
    fontWeight: 800,
    color: '#f9fafb'
  },
  clientTitle: {
    margin: 0,
    fontSize: 14,
    color: '#e5e7eb',
    maxWidth: 360
  },
  levelCard: {
    minWidth: 220,
    borderRadius: 20,
    padding: 14,
    background:
      'radial-gradient(circle at top left, rgba(34,197,94,0.22), rgba(15,23,42,1))',
    border: '1px solid rgba(34,197,94,0.65)',
    color: '#f9fafb',
    animation: 'cardFloat 6s ease-in-out infinite'
  },
  levelLabel: {
    margin: 0,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    color: '#bbf7d0'
  },
  levelValue: {
    margin: '6px 0 4px',
    fontSize: 15,
    fontWeight: 700
  },
  levelDetail: {
    margin: 0,
    fontSize: 13,
    color: '#e5e7eb'
  },

  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1.2fr)',
    gap: 16
  },
  mainCard: {
    borderRadius: 20,
    padding: 16,
    background: 'rgba(15,23,42,0.98)',
    border: '1px solid rgba(148,163,184,0.5)'
  },
  cardTag: {
    margin: 0,
    marginBottom: 8,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    color: '#9ca3af'
  },
  mainNumberRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 10
  },
  mainNumber: {
    fontSize: 40,
    fontWeight: 800,
    color: '#f9fafb'
  },
  mainNumberCaption: {
    fontSize: 13,
    color: '#d1d5db'
  },
  progressBlock: {
    marginBottom: 10
  },
  progressTrack: {
    width: '100%',
    height: 10,
    borderRadius: 999,
    background: 'rgba(15,23,42,1)',
    overflow: 'hidden',
    border: '1px solid rgba(51,65,85,0.8)'
  },
  progressBar: {
    height: '100%',
    borderRadius: 999,
    backgroundImage:
      'linear-gradient(90deg, #22c55e, #22c55e, #06b6d4)',
    transition: 'width 600ms ease-out'
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 4
  },
  progressLabel: {
    fontSize: 11,
    color: '#9ca3af'
  },
  progressLabelRight: {
    fontSize: 11,
    color: '#e5e7eb'
  },
  chipsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6
  },
  chipPrimary: {
    padding: '6px 10px',
    borderRadius: 999,
    background: 'rgba(34,197,94,0.12)',
    border: '1px solid rgba(34,197,94,0.7)',
    fontSize: 11,
    color: '#bbf7d0'
  },
  chipOutline: {
    padding: '6px 10px',
    borderRadius: 999,
    border: '1px solid rgba(148,163,184,0.7)',
    fontSize: 11,
    color: '#e5e7eb'
  },

  secondaryCard: {
    borderRadius: 20,
    padding: 16,
    background: 'rgba(15,23,42,0.96)',
    border: '1px solid rgba(148,163,184,0.45)'
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 8,
    marginTop: 4
  },
  statBlock: {
    flex: 1
  },
  statLabel: {
    margin: 0,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    color: '#94a3b8'
  },
  statNumber: {
    margin: '4px 0 2px',
    fontSize: 24,
    fontWeight: 700,
    color: '#f9fafb'
  },
  statHint: {
    margin: 0,
    fontSize: 12,
    color: '#cbd5f5'
  },
  secondaryText: {
    margin: 0,
    marginTop: 8,
    fontSize: 13,
    color: '#e5e7eb'
  },

  footerCard: {
    borderRadius: 20,
    padding: 18,
    background: 'rgba(15,23,42,0.98)',
    border: '1px solid rgba(148,163,184,0.45)',
    marginTop: 4
  },
  footerTitle: {
    margin: 0,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 600,
    color: '#f9fafb'
  },
  footerText: {
    margin: 0,
    marginBottom: 8,
    fontSize: 13,
    color: '#e5e7eb'
  },
  footerHighlight: {
    margin: 0,
    marginBottom: 12,
    fontSize: 13,
    color: '#bbf7d0'
  },
  actionsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10
  },
  shareButton: {
    padding: '10px 18px',
    borderRadius: 999,
    border: '1px solid rgba(34,197,94,0.8)',
    background: 'rgba(22,163,74,0.12)',
    color: '#bbf7d0',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    cursor: 'pointer'
  },
  backButton: {
    padding: '10px 18px',
    borderRadius: 999,
    border: '1px solid rgba(148,163,184,0.8)',
    background: 'transparent',
    color: '#e5e7eb',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    cursor: 'pointer'
  }
};
