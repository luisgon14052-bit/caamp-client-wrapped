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
      }, 120);
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
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text',
            'Helvetica Neue', Arial, sans-serif;
          background: #020617;
          color: #f9fafb;
          -webkit-font-smoothing: antialiased;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradientMove {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
        @keyframes gradientPulse {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes cardFloat {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes spinRing {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes dotPulse {
          0% {
            opacity: 0.3;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1.12);
          }
          100% {
            opacity: 0.3;
            transform: scale(0.9);
          }
        }

        @media (max-width: 640px) {
          h1 {
            font-size: 26px !important;
          }
        }
      `}</style>

      <div style={styles.page}>
        {/* CAPA DE FONDO ANIMADA */}
        <div style={styles.animatedBgLayer} />
        <div style={styles.animatedBgNoise} />

        {/* OVERLAY DE LOADING */}
        {loading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.loadingCard}>
              <div style={styles.loadingRingWrap}>
                <div style={styles.loadingRing}>
                  <div style={styles.loadingRingInner} />
                </div>
              </div>
              <p style={styles.loadingTitle}>Armando tu Wrapped…</p>
              <p style={styles.loadingText}>
                Calculando tu lugar dentro de la comunidad y tu año en movimiento.
              </p>
              <div style={styles.loadingDots}>
                <span style={{ ...styles.loadingDot, animationDelay: '0s' }} />
                <span style={{ ...styles.loadingDot, animationDelay: '0.16s' }} />
                <span style={{ ...styles.loadingDot, animationDelay: '0.32s' }} />
              </div>
            </div>
          </div>
        )}

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
                Ve cuántas veces entrenaste, qué tan constante fuiste y qué tan arriba estás dentro
                de la comunidad. Es tu resumen oficial de movimiento este año.
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
              {/* Cabecera */}
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
                {/* Total asistencias */}
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

                {/* Constancia */}
                <div style={styles.secondaryCard}>
                  <p style={styles.cardTag}>Tu constancia</p>

                  <div style={styles.statsRow}>
                    <div style={styles.statBlock}>
                      <p style={styles.statLabel}>Promedio al mes</p>
                      <p style={styles.statNumber}>{data.promedio_mensual}</p>
                      <p style={styles.statHint}>clases por mes</p>
                    </div>
                    <div style={styles.statBlock}>
                      <p style={styles.statLabel}>Promedio a la semana</p>
                      <p style={styles.statNumber}>{data.promedio_semanal}</p>
                      <p style={styles.statHint}>sesiones por semana</p>
                    </div>
                  </div>

                  <p style={styles.secondaryText}>
                    No fue suerte. Fueron todas esas veces que llegaste, te moviste y saliste mejor
                    de lo que entraste.
                  </p>
                </div>
              </div>

              {/* Mensaje final */}
              <div style={styles.footerCard}>
                <p style={styles.footerTitle}>Lo que construiste este año</p>
                <p style={styles.footerText}>
                  Cada asistencia suma a algo más grande que un número: energía, confianza,
                  disciplina. Tu cuerpo se acuerda de todas esas veces que estuviste aquí.
                </p>

                <p style={styles.footerHighlight}>
                  Gracias por ser parte de Caamp. Este año lo cerraste entrenando. El que sigue, lo
                  volvemos a romper juntos. 💚
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
    padding: '24px 12px',
    position: 'relative',
    overflow: 'hidden'
  },
  container: {
    width: '100%',
    maxWidth: 960,
    animation: 'fadeUp 480ms ease-out',
    position: 'relative',
    zIndex: 2
  },

  // Fondo animado
  animatedBgLayer: {
    position: 'fixed',
    inset: 0,
    background:
      'linear-gradient(130deg,#020617,#020617,#020617)',
    zIndex: 0
  },
  animatedBgNoise: {
    position: 'fixed',
    inset: '-40%',
    backgroundImage:
      'radial-gradient(circle at 0% 0%, rgba(34,197,94,0.45) 0, transparent 55%), radial-gradient(circle at 100% 100%, rgba(56,189,248,0.4) 0, transparent 55%), radial-gradient(circle at 0% 100%, rgba(234,179,8,0.32) 0, transparent 55%)',
    backgroundSize: '140% 140%',
    animation: 'gradientMove 28s ease-in-out infinite',
    opacity: 0.6,
    filter: 'blur(28px)',
    zIndex: 0,
    pointerEvents: 'none'
  },

  // HERO
  hero: {
    background:
      'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,1), rgba(15,23,42,0.96))',
    borderRadius: 24,
    padding: 20,
    border: '1px solid rgba(148,163,184,0.32)',
    boxShadow: '0 28px 80px rgba(15,23,42,0.95)',
    color: '#e5e7eb'
  },
  heroTopRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 14
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  logo: {
    height: 32,
    width: 'auto'
  },
  brandText: {
    fontSize: 12,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: '#9ca3af'
  },
  pill: {
    padding: '5px 10px',
    borderRadius: 999,
    border: '1px solid rgba(148,163,184,0.7)',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#e5e7eb',
    whiteSpace: 'nowrap'
  },
  title: {
    margin: 0,
    marginBottom: 6,
    fontSize: 28,
    fontWeight: 800,
    color: '#f9fafb'
  },
  gradientText: {
    backgroundImage:
      'linear-gradient(120deg, #22c55e, #06b6d4, #eab308)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    backgroundSize: '220% 220%',
    animation: 'gradientPulse 10s ease-in-out infinite'
  },
  subtitle: {
    margin: 0,
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 1.6,
    color: '#cbd5f5',
    maxWidth: 520
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6
  },
  input: {
    flex: 1,
    minWidth: 200,
    padding: 12,
    borderRadius: 999,
    border: '1px solid rgba(148,163,184,0.8)',
    background: 'rgba(15,23,42,0.95)',
    color: '#f9fafb',
    fontSize: 14,
    outline: 'none'
  },
  ctaButton: {
    padding: '12px 18px',
    borderRadius: 999,
    border: 'none',
    backgroundImage:
      'linear-gradient(120deg, #22c55e, #22c55e, #06b6d4)',
    color: '#020617',
    fontWeight: 700,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: '#fca5a5'
  },
  helper: {
    marginTop: 6,
    fontSize: 11,
    color: '#9ca3af'
  },

  // RESULTADOS
  results: {
    background:
      'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,1))',
    borderRadius: 24,
    padding: 18,
    border: '1px solid rgba(148,163,184,0.45)',
    boxShadow: '0 28px 80px rgba(15,23,42,0.98)',
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  headerRow: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14
  },
  headerLeft: {
    flex: 1,
    minWidth: 220
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  logoSmall: {
    height: 28,
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
    margin: '4px 0 2px',
    fontSize: 24,
    fontWeight: 800,
    color: '#f9fafb'
  },
  clientTitle: {
    margin: 0,
    fontSize: 13,
    color: '#e5e7eb',
    maxWidth: 360
  },
  levelCard: {
    minWidth: 210,
    borderRadius: 18,
    padding: 12,
    background:
      'radial-gradient(circle at top left, rgba(34,197,94,0.26), rgba(15,23,42,1))',
    border: '1px solid rgba(34,197,94,0.75)',
    color: '#f9fafb',
    animation: 'cardFloat 7s ease-in-out infinite'
  },
  levelLabel: {
    margin: 0,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    color: '#bbf7d0'
  },
  levelValue: {
    margin: '4px 0 2px',
    fontSize: 15,
    fontWeight: 700
  },
  levelDetail: {
    margin: 0,
    fontSize: 12,
    color: '#e5e7eb'
  },

  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1.2fr)',
    gap: 14
  },
  mainCard: {
    borderRadius: 18,
    padding: 14,
    background: 'rgba(15,23,42,0.98)',
    border: '1px solid rgba(148,163,184,0.55)',
    boxShadow: '0 18px 40px rgba(15,23,42,0.9)'
  },
  cardTag: {
    margin: 0,
    marginBottom: 6,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    color: '#9ca3af'
  },
  mainNumberRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 8
  },
  mainNumber: {
    fontSize: 34,
    fontWeight: 800,
    color: '#f9fafb'
  },
  mainNumberCaption: {
    fontSize: 12,
    color: '#d1d5db'
  },
  progressBlock: {
    marginBottom: 8
  },
  progressTrack: {
    width: '100%',
    height: 9,
    borderRadius: 999,
    background: 'rgba(15,23,42,1)',
    overflow: 'hidden',
    border: '1px solid rgba(51,65,85,0.85)'
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
    gap: 6,
    marginTop: 4
  },
  chipPrimary: {
    padding: '5px 9px',
    borderRadius: 999,
    background: 'rgba(34,197,94,0.15)',
    border: '1px solid rgba(34,197,94,0.7)',
    fontSize: 11,
    color: '#bbf7d0'
  },
  chipOutline: {
    padding: '5px 9px',
    borderRadius: 999,
    border: '1px solid rgba(148,163,184,0.8)',
    fontSize: 11,
    color: '#e5e7eb'
  },

  secondaryCard: {
    borderRadius: 18,
    padding: 14,
    background: 'rgba(15,23,42,0.96)',
    border: '1px solid rgba(148,163,184,0.5)'
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 6,
    marginTop: 2
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
    margin: '3px 0 2px',
    fontSize: 22,
    fontWeight: 700,
    color: '#f9fafb'
  },
  statHint: {
    margin: 0,
    fontSize: 11,
    color: '#cbd5f5'
  },
  secondaryText: {
    margin: 0,
    marginTop: 6,
    fontSize: 12.5,
    color: '#e5e7eb'
  },

  footerCard: {
    borderRadius: 18,
    padding: 14,
    background: 'rgba(15,23,42,0.98)',
    border: '1px solid rgba(148,163,184,0.5)',
    marginTop: 4
  },
  footerTitle: {
    margin: 0,
    marginBottom: 4,
    fontSize: 13,
    fontWeight: 600,
    color: '#f9fafb'
  },
  footerText: {
    margin: 0,
    marginBottom: 6,
    fontSize: 12.5,
    color: '#e5e7eb'
  },
  footerHighlight: {
    margin: 0,
    marginBottom: 10,
    fontSize: 12.5,
    color: '#bbf7d0'
  },
  actionsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8
  },
  shareButton: {
    padding: '9px 14px',
    borderRadius: 999,
    border: '1px solid rgba(34,197,94,0.9)',
    background: 'rgba(22,163,74,0.16)',
    color: '#bbf7d0',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    cursor: 'pointer'
  },
  backButton: {
    padding: '9px 14px',
    borderRadius: 999,
    border: '1px solid rgba(148,163,184,0.9)',
    background: 'transparent',
    color: '#e5e7eb',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    cursor: 'pointer'
  },

  // LOADING OVERLAY
  loadingOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    background: 'rgba(2,6,23,0.94)',
    backdropFilter: 'blur(16px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingCard: {
    borderRadius: 22,
    padding: 18,
    width: '90%',
    maxWidth: 320,
    background:
      'radial-gradient(circle at top, rgba(34,197,94,0.3), rgba(15,23,42,1))',
    border: '1px solid rgba(34,197,94,0.8)',
    textAlign: 'center',
    boxShadow: '0 26px 60px rgba(0,0,0,0.95)'
  },
  loadingRingWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 10
  },
  loadingRing: {
    width: 70,
    height: 70,
    borderRadius: '50%',
    border: '3px solid rgba(15,23,42,1)',
    borderTopColor: '#22c55e',
    borderRightColor: '#06b6d4',
    animation: 'spinRing 1.1s linear infinite',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      'radial-gradient(circle, rgba(15,23,42,1), rgba(15,23,42,0.7))'
  },
  loadingRingInner: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    backgroundImage:
      'linear-gradient(135deg, #22c55e, #06b6d4, #eab308)',
    opacity: 0.92
  },
  loadingTitle: {
    margin: 0,
    marginBottom: 4,
    fontSize: 15,
    fontWeight: 700,
    color: '#f9fafb'
  },
  loadingText: {
    margin: 0,
    marginBottom: 10,
    fontSize: 12.5,
    color: '#e5e7eb'
  },
  loadingDots: {
    display: 'flex',
    justifyContent: 'center',
    gap: 6
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#bbf7d0',
    animation: 'dotPulse 1.1s ease-in-out infinite'
  }
};
