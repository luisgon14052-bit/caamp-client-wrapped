import { useState, useRef } from 'react';

export default function ClientWrapped() {
  const [clientId, setClientId] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('intro'); // 'intro' | 'input' | 'results'
  const containerRef = useRef(null);

  async function buscar(e) {
    e.preventDefault();
    setError('');
    setData(null);
    setLoading(true);

    try {
      const cleanId = clientId.trim();
      if (!cleanId) throw new Error('ID vacío');

      const res = await fetch('/api/client?id=' + encodeURIComponent(cleanId));
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error');

      setData(json);
      setView('results');

      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    } catch (err) {
      setError('No encontramos tu Wrapped. Revisa tu número de cliente o pregunta en front desk 💚');
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  const progress =
    data && data.max_asistencias
      ? Math.min(100, Math.round((data.total_asistencias / data.max_asistencias) * 100))
      : 0;

  const kmEstimados = data ? data.total_asistencias * 5 : 0;
  const maratones = data ? (kmEstimados / 42.195).toFixed(1) : '0.0';
  const horasEntrenadas = data ? (data.total_asistencias * 0.75).toFixed(1) : '0.0';
  const everests = data ? ((data.total_asistencias * 85) / 8848).toFixed(2) : '0.00';

  const objetivoSemanal = 4;
  const porcentajeConstancia = data
    ? Math.min(100, Math.round((data.promedio_semanal / objetivoSemanal) * 100))
    : 0;
  const ringCommunity = data ? Math.min(100, data.percentile) : 0;

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
          background: #fbfbff;
          color: #0f172a;
          -webkit-font-smoothing: antialiased;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
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
            transform: translateY(-3px);
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
            opacity: 0.25;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
          100% {
            opacity: 0.25;
            transform: scale(0.9);
          }
        }

        @media (max-width: 520px) {
          h1 {
            font-size: 26px !important;
          }
        }
      `}</style>

      <div style={styles.page}>
        {/* FONDO CLARO ANIMADO */}
        <div style={styles.animatedBgLayer} />
        <div style={styles.animatedBgNoise} />

        {/* LOADING */}
        {loading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.loadingCard}>
              <div style={styles.loadingRingWrap}>
                <div style={styles.loadingRing}>
                  <div style={styles.loadingRingInner} />
                </div>
              </div>
              <p style={styles.loadingTitle}>Armando tu Wrapped…</p>
              <p style={styles.loadingText}>Procesando tu año en Caamp.</p>
              <div style={styles.loadingDots}>
                <span style={{ ...styles.loadingDot, animationDelay: '0s' }} />
                <span style={{ ...styles.loadingDot, animationDelay: '0.16s' }} />
                <span style={{ ...styles.loadingDot, animationDelay: '0.32s' }} />
              </div>
            </div>
          </div>
        )}

        <div style={styles.container}>
          {/* INTRO */}
          {view === 'intro' && (
            <section style={styles.introHero}>
              <div style={styles.introGradient} />
              <div style={styles.introContent}>
                <div style={styles.topRow}>
                  <div style={styles.logoWrap}>
                    <img src="/caamp-logo.png" alt="Caamp" style={styles.logo} />
                    <span style={styles.brandText}>CAAMP</span>
                  </div>
                  <span style={styles.pill}>Client Wrapped · 2025</span>
                </div>

                <h1 style={styles.introTitle}>
                  Bienvenido a tu
                  <span style={styles.introGradientText}> Caamp Wrapped</span>
                </h1>

                <p style={styles.introSubtitle}>
                  Un resumen visual (premium y limpio) de lo que construiste este año en Caamp.
                </p>

                <button
                  style={styles.primaryButton}
                  onClick={() => {
                    setView('input');
                    setError('');
                  }}
                >
                  Ver mi año
                </button>

                <p style={styles.smallHint}>Optimizado para celular ✨</p>
              </div>
            </section>
          )}

          {/* INPUT */}
          {view === 'input' && !data && (
            <section style={styles.card}>
              <div style={styles.topRow}>
                <div style={styles.logoWrap}>
                  <img src="/caamp-logo.png" alt="Caamp" style={styles.logo} />
                  <span style={styles.brandText}>CAAMP</span>
                </div>
                <span style={styles.pill}>Client Wrapped · 2025</span>
              </div>

              <h1 style={styles.title}>
                Tu <span style={styles.gradientText}>año</span> en Caamp
              </h1>

              <p style={styles.subtitle}>
                Ingresa tu número de cliente (ID) para ver tu resumen.
              </p>

              <form onSubmit={buscar} style={styles.form}>
                <input
                  style={styles.input}
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                  placeholder="Ej: 303"
                  inputMode="numeric"
                />
                <button style={styles.primaryButton} disabled={loading}>
                  {loading ? 'Cargando...' : 'Ver mi Wrapped'}
                </button>
              </form>

              {error && <p style={styles.error}>{error}</p>}

              <p style={styles.helper}>
                Si no sabes tu ID, pídelo en front desk o por WhatsApp 💚
              </p>
            </section>
          )}

          {/* RESULTS */}
          {view === 'results' && data && (
            <section style={styles.results} ref={containerRef}>
              {/* HEADER */}
              <div style={styles.card}>
                <div style={styles.topRow}>
                  <div style={styles.logoWrap}>
                    <img src="/caamp-logo.png" alt="Caamp" style={styles.logoSmall} />
                    <span style={styles.brandText}>CAAMP</span>
                  </div>
                  <span style={styles.pill}>Client Wrapped · 2025</span>
                </div>

                <p style={styles.kicker}>Hola,</p>
                <h2 style={styles.name}>{data.name}</h2>
                <p style={styles.desc}>{data.titulo}</p>

                <div style={styles.levelCard}>
                  <p style={styles.levelLabel}>Nivel</p>
                  <p style={styles.levelValue}>{data.nivel}</p>
                  <p style={styles.levelDetail}>
                    Entrenaste más que <strong>{data.percentile}%</strong> de Caamp.
                  </p>
                </div>
              </div>

              {/* RINGS */}
              <div style={styles.card}>
                <p style={styles.sectionTitle}>Tu energía en círculos</p>
                <p style={styles.sectionSub}>
                  Tres anillos, una historia: movimiento, comunidad y constancia.
                </p>

                <div style={styles.ringsWrapper}>
                  <div style={styles.ringsGraphic}>
                    <div
                      style={{
                        ...styles.ringOuter,
                        backgroundImage: `conic-gradient(#16a34a ${progress}%, rgba(15,23,42,0.08) ${progress}% 100%)`
                      }}
                    />
                    <div
                      style={{
                        ...styles.ringMiddle,
                        backgroundImage: `conic-gradient(#0284c7 ${ringCommunity}%, rgba(15,23,42,0.08) ${ringCommunity}% 100%)`
                      }}
                    />
                    <div
                      style={{
                        ...styles.ringInner,
                        backgroundImage: `conic-gradient(#f59e0b ${porcentajeConstancia}%, rgba(15,23,42,0.08) ${porcentajeConstancia}% 100%)`
                      }}
                    />
                    <div style={styles.ringsCenter}>
                      <span style={styles.centerNumber}>{data.total_asistencias}</span>
                      <span style={styles.centerLabel}>clases</span>
                    </div>
                  </div>

                  <div style={styles.legend}>
                    <LegendItem color="#16a34a" title="Movimiento total" value={`${progress}% del máximo`} />
                    <LegendItem color="#0284c7" title="Comunidad" value={`Top ${data.percentile}%`} />
                    <LegendItem color="#f59e0b" title="Constancia" value={`${porcentajeConstancia}% del objetivo`} />
                  </div>
                </div>
              </div>

              {/* TOTAL */}
              <div style={styles.card}>
                <p style={styles.sectionTitle}>Total del año</p>
                <div style={styles.bigRow}>
                  <span style={styles.bigNumber}>{data.total_asistencias}</span>
                  <span style={styles.bigCaption}>entrenamientos</span>
                </div>

                <div style={styles.progressTrack}>
                  <div style={{ ...styles.progressBar, width: `${progress}%` }} />
                </div>

                <div style={styles.chipsRow}>
                  <span style={styles.chipPrimary}>Top {data.percentile}%</span>
                  <span style={styles.chipOutline}>
                    Lugar #{data.rank} de {data.total_clients}
                  </span>
                </div>
              </div>

              {/* CONSTANCIA */}
              <div style={styles.card}>
                <p style={styles.sectionTitle}>Constancia</p>
                <div style={styles.statsRow}>
                  <Stat label="Promedio al mes" value={data.promedio_mensual} suffix="clases" />
                  <Stat label="Promedio a la semana" value={data.promedio_semanal} suffix="sesiones" />
                </div>
                <p style={styles.bodyText}>
                  No fue suerte. Fue disciplina repetida.
                </p>
              </div>

              {/* PERSPECTIVA */}
              <div style={styles.card}>
                <p style={styles.sectionTitle}>En perspectiva</p>
                <p style={styles.bodyText}>
                  Si cada clase fueran <strong>5 km</strong>, este año corriste aprox.{' '}
                  <strong>{kmEstimados.toFixed(0)} km</strong> (≈ <strong>{maratones}</strong> maratones).
                </p>
                <p style={styles.bodyText}>
                  Y si cada clase fueran <strong>85 m</strong> de subida, escalaste el equivalente al Everest{' '}
                  <strong>{everests}</strong> veces.
                </p>
                <p style={styles.noteText}>(Equivalencias aproximadas.)</p>
              </div>

              {/* FOOTER */}
              <div style={styles.card}>
                <p style={styles.sectionTitle}>Cierre</p>
                <p style={styles.bodyText}>
                  Gracias por ser parte de Caamp. Este año lo cerraste entrenando. El que sigue… lo rompemos juntos. 💚
                </p>

                <div style={styles.actionsRow}>
                  <button
                    style={styles.secondaryButton}
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        const url = window.location.origin + window.location.pathname;
                        navigator.clipboard
                          .writeText(url)
                          .then(() => alert('Link copiado 💚'))
                          .catch(() =>
                            alert('No se pudo copiar automático. Copia el link de la barra del navegador.')
                          );
                      }
                    }}
                  >
                    Copiar link
                  </button>

                  <button
                    style={styles.ghostButton}
                    onClick={() => {
                      setData(null);
                      setError('');
                      setClientId('');
                      setView('input');
                    }}
                  >
                    Ver otro
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

function LegendItem({ color, title, value }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <span style={{ width: 10, height: 10, borderRadius: 999, marginTop: 4, background: color }} />
      <div>
        <p style={{ margin: 0, fontSize: 12, color: '#0f172a', fontWeight: 700 }}>{title}</p>
        <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>{value}</p>
      </div>
    </div>
  );
}

function Stat({ label, value, suffix }) {
  return (
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.2 }}>
        {label}
      </p>
      <p style={{ margin: '6px 0 2px', fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{value}</p>
      <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>{suffix}</p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    padding: '18px 10px',
    position: 'relative',
    overflow: 'hidden'
  },
  container: {
    width: '100%',
    maxWidth: 920,
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    animation: 'fadeUp 480ms ease-out'
  },

  animatedBgLayer: {
    position: 'fixed',
    inset: 0,
    background: 'linear-gradient(180deg, #fbfbff 0%, #f6fff9 40%, #f7fbff 100%)',
    zIndex: 0
  },
  animatedBgNoise: {
    position: 'fixed',
    inset: '-35%',
    backgroundImage:
      'radial-gradient(circle at 10% 20%, rgba(34,197,94,0.22) 0, transparent 55%), radial-gradient(circle at 90% 10%, rgba(56,189,248,0.22) 0, transparent 55%), radial-gradient(circle at 30% 90%, rgba(234,179,8,0.18) 0, transparent 55%)',
    backgroundSize: '140% 140%',
    animation: 'gradientMove 26s ease-in-out infinite',
    opacity: 1,
    filter: 'blur(26px)',
    zIndex: 0,
    pointerEvents: 'none'
  },

  card: {
    background: 'rgba(255,255,255,0.72)',
    borderRadius: 24,
    padding: 16,
    border: '1px solid rgba(15,23,42,0.10)',
    boxShadow: '0 18px 50px rgba(2,6,23,0.10)',
    backdropFilter: 'blur(14px)'
  },

  introHero: {
    position: 'relative',
    borderRadius: 28,
    padding: 16,
    overflow: 'hidden',
    border: '1px solid rgba(15,23,42,0.10)',
    boxShadow: '0 18px 60px rgba(2,6,23,0.12)'
  },
  introGradient: {
    position: 'absolute',
    inset: '-20%',
    backgroundImage:
      'conic-gradient(from 160deg, rgba(34,197,94,0.45), rgba(56,189,248,0.45), rgba(34,197,94,0.45))',
    backgroundSize: '200% 200%',
    animation: 'gradientMove 18s ease-in-out infinite',
    opacity: 0.55
  },
  introContent: {
    position: 'relative',
    borderRadius: 24,
    padding: 16,
    background: 'rgba(255,255,255,0.70)',
    border: '1px solid rgba(15,23,42,0.08)',
    backdropFilter: 'blur(14px)'
  },

  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10
  },

  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  logo: { height: 30, width: 'auto' },
  logoSmall: { height: 26, width: 'auto' },
  brandText: {
    fontSize: 11,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: '#64748b'
  },
  pill: {
    padding: '6px 10px',
    borderRadius: 999,
    border: '1px solid rgba(15,23,42,0.12)',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#334155',
    background: 'rgba(255,255,255,0.55)',
    whiteSpace: 'nowrap'
  },

  introTitle: {
    margin: 0,
    marginBottom: 8,
    fontSize: 26,
    fontWeight: 900,
    color: '#0f172a'
  },
  introGradientText: {
    display: 'block',
    backgroundImage: 'linear-gradient(120deg, #16a34a, #0284c7)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    backgroundSize: '220% 220%',
    animation: 'gradientPulse 10s ease-in-out infinite'
  },
  introSubtitle: {
    margin: 0,
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 1.5,
    color: '#334155',
    maxWidth: 520
  },
  smallHint: {
    margin: '10px 0 0',
    fontSize: 11,
    color: '#64748b'
  },

  title: {
    margin: 0,
    marginBottom: 6,
    fontSize: 26,
    fontWeight: 900,
    color: '#0f172a'
  },
  gradientText: {
    backgroundImage: 'linear-gradient(120deg, #16a34a, #0284c7)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    backgroundSize: '220% 220%',
    animation: 'gradientPulse 10s ease-in-out infinite'
  },
  subtitle: {
    margin: 0,
    marginBottom: 14,
    fontSize: 14,
    lineHeight: 1.5,
    color: '#475569'
  },

  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6
  },
  input: {
    flex: 1,
    minWidth: 160,
    padding: 12,
    borderRadius: 999,
    border: '1px solid rgba(15,23,42,0.12)',
    background: 'rgba(255,255,255,0.85)',
    color: '#0f172a',
    fontSize: 14,
    outline: 'none'
  },

  primaryButton: {
    padding: '12px 18px',
    borderRadius: 999,
    border: 'none',
    backgroundImage: 'linear-gradient(120deg, #16a34a, #0284c7)',
    color: '#ffffff',
    fontWeight: 800,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    cursor: 'pointer',
    boxShadow: '0 12px 28px rgba(2,6,23,0.12)',
    whiteSpace: 'nowrap'
  },
  secondaryButton: {
    padding: '10px 14px',
    borderRadius: 999,
    border: '1px solid rgba(2,132,199,0.35)',
    background: 'rgba(2,132,199,0.10)',
    color: '#0f172a',
    fontWeight: 800,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    cursor: 'pointer'
  },
  ghostButton: {
    padding: '10px 14px',
    borderRadius: 999,
    border: '1px solid rgba(15,23,42,0.14)',
    background: 'transparent',
    color: '#0f172a',
    fontWeight: 800,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    cursor: 'pointer'
  },

  error: { marginTop: 6, fontSize: 12, color: '#dc2626' },
  helper: { marginTop: 8, fontSize: 11, color: '#64748b' },

  results: { display: 'flex', flexDirection: 'column', gap: 12 },

  kicker: {
    margin: '6px 0 0',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    color: '#64748b'
  },
  name: { margin: '4px 0 2px', fontSize: 26, fontWeight: 900, color: '#0f172a' },
  desc: { margin: 0, fontSize: 13.5, color: '#334155' },

  levelCard: {
    marginTop: 12,
    borderRadius: 18,
    padding: 12,
    background: 'linear-gradient(135deg, rgba(22,163,74,0.12), rgba(2,132,199,0.10))',
    border: '1px solid rgba(15,23,42,0.08)',
    animation: 'cardFloat 7s ease-in-out infinite'
  },
  levelLabel: {
    margin: 0,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    color: '#334155'
  },
  levelValue: { margin: '6px 0 2px', fontSize: 16, fontWeight: 900, color: '#0f172a' },
  levelDetail: { margin: 0, fontSize: 12, color: '#334155' },

  sectionTitle: { margin: 0, fontSize: 13, fontWeight: 900, color: '#0f172a' },
  sectionSub: { margin: '6px 0 0', fontSize: 12, color: '#475569' },

  ringsWrapper: { marginTop: 12, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' },
  ringsGraphic: { position: 'relative', width: 150, height: 150, borderRadius: '50%' },

  ringOuter: { position: 'absolute', inset: 0, borderRadius: '50%', padding: 6, backgroundClip: 'padding-box' },
  ringMiddle: { position: 'absolute', inset: 16, borderRadius: '50%', padding: 6, backgroundClip: 'padding-box' },
  ringInner: { position: 'absolute', inset: 32, borderRadius: '50%', padding: 6, backgroundClip: 'padding-box' },

  ringsCenter: {
    position: 'absolute',
    inset: 48,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.85)',
    border: '1px solid rgba(15,23,42,0.10)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 25px rgba(2,6,23,0.10)'
  },
  centerNumber: { fontSize: 20, fontWeight: 900, color: '#0f172a' },
  centerLabel: { fontSize: 11, color: '#64748b' },

  legend: { width: '100%', display: 'flex', flexDirection: 'column', gap: 10 },

  bigRow: { display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10 },
  bigNumber: { fontSize: 34, fontWeight: 900, color: '#0f172a' },
  bigCaption: { fontSize: 12, color: '#475569' },

  progressTrack: {
    width: '100%',
    height: 10,
    borderRadius: 999,
    background: 'rgba(15,23,42,0.06)',
    overflow: 'hidden',
    border: '1px solid rgba(15,23,42,0.08)',
    marginTop: 10
  },
  progressBar: {
    height: '100%',
    borderRadius: 999,
    backgroundImage: 'linear-gradient(90deg, #16a34a, #0284c7)',
    transition: 'width 600ms ease-out'
  },

  chipsRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chipPrimary: {
    padding: '6px 10px',
    borderRadius: 999,
    background: 'rgba(22,163,74,0.12)',
    border: '1px solid rgba(22,163,74,0.25)',
    fontSize: 11,
    color: '#0f172a',
    fontWeight: 800
  },
  chipOutline: {
    padding: '6px 10px',
    borderRadius: 999,
    border: '1px solid rgba(15,23,42,0.12)',
    fontSize: 11,
    color: '#334155',
    background: 'rgba(255,255,255,0.55)'
  },

  statsRow: { display: 'flex', gap: 12, marginTop: 12 },

  bodyText: { margin: '10px 0 0', fontSize: 12.8, color: '#334155', lineHeight: 1.55 },
  noteText: { margin: '6px 0 0', fontSize: 11, color: '#64748b' },

  actionsRow: { display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 },

  // Loading (claro)
  loadingOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    background: 'rgba(248,250,252,0.85)',
    backdropFilter: 'blur(14px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingCard: {
    borderRadius: 22,
    padding: 18,
    width: '90%',
    maxWidth: 320,
    background: 'rgba(255,255,255,0.75)',
    border: '1px solid rgba(15,23,42,0.10)',
    textAlign: 'center',
    boxShadow: '0 18px 50px rgba(2,6,23,0.12)',
    backdropFilter: 'blur(14px)'
  },
  loadingRingWrap: { display: 'flex', justifyContent: 'center', marginBottom: 10 },
  loadingRing: {
    width: 70,
    height: 70,
    borderRadius: '50%',
    border: '3px solid rgba(15,23,42,0.10)',
    borderTopColor: '#16a34a',
    borderRightColor: '#0284c7',
    animation: 'spinRing 1.1s linear infinite',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingRingInner: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    backgroundImage: 'linear-gradient(135deg, #16a34a, #0284c7)',
    opacity: 0.95
  },
  loadingTitle: { margin: 0, marginBottom: 4, fontSize: 15, fontWeight: 900, color: '#0f172a' },
  loadingText: { margin: 0, marginBottom: 10, fontSize: 12.5, color: '#334155' },
  loadingDots: { display: 'flex', justifyContent: 'center', gap: 6 },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#0f172a',
    animation: 'dotPulse 1.1s ease-in-out infinite'
  }
};
