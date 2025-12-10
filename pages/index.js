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
      }, 50);
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
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes rotateBlob {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(8deg) scale(1.05); }
          100% { transform: rotate(0deg) scale(1); }
        }
      `}</style>

      <div style={styles.bg}>
        <div style={styles.blobOne} />
        <div style={styles.blobTwo} />
        <div style={styles.blurOverlay} />

        <div style={styles.shell}>
          {!data && (
            <div style={styles.hero}>
              <div style={styles.logoRow}>
                <img src="/caamp-logo.png" alt="Caamp" style={styles.logo} />
                <span style={styles.pill}>Client Wrapped · 2025</span>
              </div>

              <h1 style={styles.title}>
                Tu <span style={styles.highlight}>año entrenando</span> en Caamp
              </h1>
              <p style={styles.subtitle}>
                Descubre cuántas veces elegiste moverte, qué tan constante fuiste
                y en qué lugar estás dentro de la comunidad.
              </p>

              <form onSubmit={buscar} style={styles.form}>
                <input
                  style={styles.input}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Escribe tu nombre como aparece en la app"
                />
                <button style={styles.button} disabled={loading}>
                  {loading ? 'Cargando...' : 'Ver mi Wrapped'}
                </button>
              </form>

              {error && <p style={styles.error}>{error}</p>}

              <p style={styles.helper}>
                Ejemplos para probar: <strong>Ana López</strong>, <strong>Carlos Rivera</strong>,{' '}
                <strong>Carla Mendoza</strong>, <strong>Mariana Ríos</strong>.
              </p>
            </div>
          )}

          {data && (
            <div style={styles.results} ref={containerRef}>
              <div style={styles.logoRowTop}>
                <img src="/caamp-logo.png" alt="Caamp" style={styles.logoSmall} />
                <span style={styles.pill}>Client Wrapped · 2025</span>
              </div>

              <div style={styles.headerBlock}>
                <div>
                  <p style={styles.hello}>Este año fuiste…</p>
                  <h2 style={styles.clientName}>{data.name}</h2>
                  <p style={styles.clientTitle}>{data.titulo}</p>
                </div>
                <div style={styles.badgeBig}>
                  <span style={styles.badgeLabel}>Nivel</span>
                  <span style={styles.badgeValue}>{data.nivel}</span>
                </div>
              </div>

              <div style={styles.mainRow}>
                <div style={styles.mainCard}>
                  <p style={styles.cardTag}>Total de entrenamientos</p>
                  <div style={styles.mainNumberRow}>
                    <span style={styles.mainNumber}>{data.total_asistencias}</span>
                    <span style={styles.mainSuffix}>veces que elegiste moverte</span>
                  </div>

                  <div style={styles.progressWrapper}>
                    <div style={styles.progressTrack}>
                      <div
                        style={{
                          ...styles.progressBar,
                          width: `${progress}%`
                        }}
                      />
                    </div>
                    <div style={styles.progressLabels}>
                      <span style={styles.progressLabelLeft}>Inicio del año</span>
                      <span style={styles.progressLabelRight}>Máximo de la comunidad</span>
                    </div>
                  </div>

                  <div style={styles.chipsRow}>
                    <span style={styles.chipAccent}>
                      Top {data.percentile}% de Caamp
                    </span>
                    <span style={styles.chipSoft}>
                      Lugar #{data.rank} de {data.total_clients} riders
                    </span>
                  </div>
                </div>

                <div style={styles.sideCard}>
                  <p style={styles.sideTitle}>Tu constancia en números</p>
                  <div style={styles.sideRow}>
                    <div>
                      <p style={styles.sideLabel}>Promedio por mes</p>
                      <p style={styles.sideNumber}>{data.promedio_mensual}</p>
                      <p style={styles.sideHint}>Clases al mes</p>
                    </div>
                    <div>
                      <p style={styles.sideLabel}>Promedio por semana</p>
                      <p style={styles.sideNumber}>{data.promedio_semanal}</p>
                      <p style={styles.sideHint}>Sesiones por semana</p>
                    </div>
                  </div>
                  <p style={styles.sideFooter}>
                    No siempre se sintió fácil, pero lo hiciste igual. Eso es constancia.
                  </p>
                </div>
              </div>

              <div style={styles.footerCard}>
                <p style={styles.footerHighlight}>
                  Entrenaste más que <strong>{data.percentile}%</strong> de la comunidad Caamp.
                </p>
                <p style={styles.footerText}>
                  Cada asistencia fue una decisión que tomaste por ti. Gracias por entrenar con
                  nosotros este año. Lo que sigue, lo construimos juntos.
                </p>

                <div style={styles.footerButtons}>
                  <button
                    style={styles.secondaryButton}
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        const url = window.location.origin + window.location.pathname;
                        navigator.clipboard
                          .writeText(url)
                          .then(() => alert('Link copiado. Pégalo en tu story o mándalo a tus amigos 💚'))
                          .catch(() =>
                            alert('No se pudo copiar automático, copia el link de la barra del navegador.')
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
                    }}
                  >
                    Ver otro cliente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  bg: {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top, #1af0c055 0, transparent 50%), radial-gradient(circle at bottom, #00b8ff55 0, #050509 60%)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: '32px 16px'
  },
  blobOne: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: '999px',
    background: 'conic-gradient(from 140deg, #00ff9c, #00b8ff, transparent)',
    top: -120,
    left: -80,
    filter: 'blur(40px)',
    opacity: 0.45,
    animation: 'rotateBlob 22s ease-in-out infinite'
  },
  blobTwo: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: '999px',
    background: 'conic-gradient(from 320deg, #ffdd55, #ff6b9c, transparent)',
    bottom: -140,
    right: -120,
    filter: 'blur(40px)',
    opacity: 0.35,
    animation: 'rotateBlob 26s ease-in-out infinite'
  },
  blurOverlay: {
    position: 'absolute',
    inset: 0,
    backdropFilter: 'blur(26px)',
    background:
      'linear-gradient(135deg, rgba(5,5,10,0.92), rgba(5,5,15,0.96), rgba(5,5,12,0.94))'
  },
  shell: {
    position: 'relative',
    width: '100%',
    maxWidth: 960,
    zIndex: 2,
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 32
  },
  hero: {
    animation: 'fadeUp 600ms ease-out forwards',
    borderRadius: 32,
    padding: 28,
    background:
      'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.7))',
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
    backdropFilter: 'blur(24px)',
    textAlign: 'left'
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18
  },
  logoRowTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18
  },
  logo: {
    height: 40,
    width: 'auto'
  },
  logoSmall: {
    height: 32,
    width: 'auto',
    opacity: 0.9
  },
  pill: {
    padding: '6px 12px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.2)',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    opacity: 0.8
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    margin: 0,
    marginBottom: 8
  },
  highlight: {
    background:
      'linear-gradient(120deg, #00ffcc, #00b8ff, #ffdd55)',
    WebkitBackgroundClip: 'text',
    color: 'transparent'
  },
  subtitle: {
    margin: 0,
    marginBottom: 20,
    fontSize: 15,
    opacity: 0.8,
    maxWidth: 460
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    flexWrap: 'wrap'
  },
  input: {
    flex: 1,
    minWidth: 220,
    padding: 14,
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(5,5,10,0.7)',
    color: '#fff',
    fontSize: 15,
    outline: 'none'
  },
  button: {
    padding: '14px 22px',
    borderRadius: 999,
    border: 'none',
    background:
      'linear-gradient(120deg, #00ffcc, #00b8ff, #00ff9c)',
    color: '#050509',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  error: {
    marginTop: 6,
    fontSize: 13,
    color: '#ff8080'
  },
  helper: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.65
  },
  results: {
    animation: 'fadeUp 600ms ease-out forwards',
    borderRadius: 32,
    padding: 24,
    background:
      'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.78))',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 32px 80px rgba(0,0,0,0.85)',
    backdropFilter: 'blur(26px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },
  headerBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 18,
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  hello: {
    margin: 0,
    fontSize: 12,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 1.4
  },
  clientName: {
    margin: '4px 0 4px',
    fontSize: 26,
    fontWeight: 800
  },
  clientTitle: {
    margin: 0,
    fontSize: 14,
    opacity: 0.85,
    maxWidth: 360
  },
  badgeBig: {
    borderRadius: 20,
    border: '1px solid rgba(0,255,156,0.5)',
    padding: '10px 14px',
    minWidth: 180,
    background:
      'radial-gradient(circle at top left, rgba(0,255,156,0.25), transparent 60%)'
  },
  badgeLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    opacity: 0.7
  },
  badgeValue: {
    display: 'block',
    fontSize: 14,
    marginTop: 2,
    fontWeight: 600
  },
  mainRow: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.2fr)',
    gap: 18
  },
  mainCard: {
    borderRadius: 24,
    padding: 18,
    background:
      'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(5,15,20,0.95))',
    border: '1px solid rgba(255,255,255,0.06)'
  },
  cardTag: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    opacity: 0.75,
    margin: 0,
    marginBottom: 6
  },
  mainNumberRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 12
  },
  mainNumber: {
    fontSize: 42,
    fontWeight: 800
  },
  mainSuffix: {
    fontSize: 13,
    opacity: 0.8
  },
  progressWrapper: {
    marginTop: 6,
    marginBottom: 12
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    background:
      'linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12))',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    borderRadius: 999,
    background:
      'linear-gradient(90deg, #00ffcc, #00b8ff, #ffdd55)',
    transition: 'width 600ms ease-out'
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 4
  },
  progressLabelLeft: {
    fontSize: 11,
    opacity: 0.6
  },
  progressLabelRight: {
    fontSize: 11,
    opacity: 0.7
  },
  chipsRow: {
    marginTop: 10,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8
  },
  chipAccent: {
    padding: '6px 10px',
    borderRadius: 999,
    background:
      'linear-gradient(120deg, rgba(0,255,204,0.16), rgba(0,184,255,0.22))',
    border: '1px solid rgba(0,255,204,0.6)',
    fontSize: 11
  },
  chipSoft: {
    padding: '6px 10px',
    borderRadius: 999,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
    fontSize: 11,
    opacity: 0.8
  },
  sideCard: {
    borderRadius: 24,
    padding: 18,
    background:
      'radial-gradient(circle at top, rgba(0,255,156,0.16), rgba(0,0,0,0.9))',
    border: '1px solid rgba(0,255,156,0.25)'
  },
  sideTitle: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    opacity: 0.75,
    margin: 0,
    marginBottom: 10
  },
  sideRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 8
  },
  sideLabel: {
    fontSize: 11,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  sideNumber: {
    fontSize: 22,
    fontWeight: 700,
    margin: '2px 0'
  },
  sideHint: {
    fontSize: 11,
    opacity: 0.7
  },
  sideFooter: {
    margin: 0,
    marginTop: 10,
    fontSize: 12,
    opacity: 0.8
  },
  footerCard: {
    marginTop: 10,
    borderRadius: 24,
    padding: 18,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)'
  },
  footerHighlight: {
    margin: 0,
    marginBottom: 6,
    fontSize: 14
  },
  footerText: {
    margin: 0,
    marginBottom: 12,
    fontSize: 13,
    opacity: 0.85
  },
  footerButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10
  },
  secondaryButton: {
    padding: '10px 16px',
    borderRadius: 999,
    border: '1px solid rgba(0,255,156,0.7)',
    background: 'transparent',
    color: '#00ffcc',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    cursor: 'pointer'
  },
  backButton: {
    padding: '10px 16px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'transparent',
    color: '#fff',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    cursor: 'pointer'
  }
};
