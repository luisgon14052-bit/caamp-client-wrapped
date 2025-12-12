import { useMemo, useRef, useState } from 'react';

function pickConstanciaLine(d) {
  if (!d) return '';

  const a = Number(d.total_asistencias || 0);
  const w = Number(d.promedio_semanal || 0);
  const p = Number(d.percentile || 0);

  // Banco de frases (elige una según tu data)
  const elite = [
    'Esto no es motivación: es identidad. Lo tuyo fue constancia real.',
    'Tu disciplina hizo lo suyo: apareciste una y otra vez.',
    'Ser constante se ve así: entrenar aun cuando nadie está viendo.'
  ];
  const high = [
    'Tu ritmo fue serio: semana tras semana, seguiste sumando.',
    'Fuiste de los que construyen hábito con intención, no con suerte.',
    'Tu constancia no fue perfecta… fue consistente. Y eso gana.'
  ];
  const mid = [
    'No fue un “arranque”: fue un proceso. Y lo sostuviste.',
    'Cada vez que fuiste, se notó. Esa es la constancia que transforma.',
    'Lo más fuerte de este año fue que seguiste regresando.'
  ];
  const starter = [
    'Hiciste lo más importante: empezar y repetirlo.',
    'La constancia se construye: una clase, una decisión, un día.',
    'A veces constancia es solo no soltar. Y tú no soltaste.'
  ];

  // Lógica simple para que sea distinta por perfil
  let pool = starter;
  if (a >= 180 || w >= 4.0 || p >= 95) pool = elite;
  else if (a >= 120 || w >= 3.0 || p >= 85) pool = high;
  else if (a >= 60 || w >= 1.5 || p >= 60) pool = mid;

  // Variante determinística por id (para que no cambie al recargar)
  const seed = Number(d.id || a || 1);
  const idx = seed % pool.length;
  return pool[idx];
}

export default function ClientWrapped() {
  const [clientId, setClientId] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('intro'); // intro | input | results
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
      setError('No encontramos tu Wrapped. Revisa tu número o pregunta en front desk 💚');
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
  const everests = data ? ((data.total_asistencias * 85) / 8848).toFixed(2) : '0.00';

  const objetivoSemanal = 4;
  const porcentajeConstancia = data
    ? Math.min(100, Math.round((data.promedio_semanal / objetivoSemanal) * 100))
    : 0;
  const ringCommunity = data ? Math.min(100, data.percentile) : 0;

  const constanciaLine = useMemo(() => pickConstanciaLine(data), [data]);

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, Arial, sans-serif;
          background: #020617;
          color: #f9fafb;
          -webkit-font-smoothing: antialiased;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
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
        @keyframes spinRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes dotPulse {
          0% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.12); }
          100% { opacity: 0.3; transform: scale(0.9); }
        }

        @media (max-width: 640px) {
          h1 { font-size: 26px !important; }
        }
      `}</style>

      <div style={styles.page}>
        <div style={styles.animatedBgLayer} />
        <div style={styles.animatedBgNoise} />

        {loading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.loadingCard}>
              <div style={styles.loadingRingWrap}>
                <div style={styles.loadingRing}>
                  <div style={styles.loadingRingInner} />
                </div>
              </div>
              <p style={styles.loadingTitle}>Armando tu Wrapped…</p>
              <p style={styles.loadingText}>Calculando tu año en Caamp.</p>
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
                <div style={styles.introBadgeRow}>
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
                  Un resumen visual de tu año. Entrenamientos, constancia y tu lugar en la comunidad.
                </p>

                <button
                  style={styles.introButton}
                  onClick={() => {
                    setView('input');
                    setError('');
                  }}
                >
                  Ver mi año en Caamp
                </button>

                <p style={styles.introHint}>Optimizado para celular</p>
              </div>
            </section>
          )}

          {/* INPUT */}
          {view === 'input' && !data && (
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
                Ingresa tu <strong>número de cliente</strong> para ver tu resumen.
              </p>

              <form onSubmit={buscar} style={styles.form}>
                <input
                  style={styles.input}
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                  placeholder="Ingresa tu número (ID)"
                  inputMode="numeric"
                />
                <button style={styles.ctaButton} disabled={loading}>
                  {loading ? 'Cargando...' : 'Ver mi Wrapped'}
                </button>
              </form>

              {error && <p style={styles.error}>{error}</p>}

              <p style={styles.helper}>
                Si no sabes tu número, está en la app <strong>Cycling Boost</strong>. 💚
              </p>
            </section>
          )}

          {/* RESULTS */}
          {view === 'results' && data && (
            <section style={styles.results} ref={containerRef}>
              {/* HEADER */}
              <div style={styles.headerCard}>
                <div style={styles.headerTopRow}>
                  <div style={styles.logoRow}>
                    <img src="/caamp-logo.png" alt="Caamp" style={styles.logoSmall} />
                    <span style={styles.pill}>Client Wrapped · 2025</span>
                  </div>
                </div>

                <p style={styles.smallLabel}>Hola,</p>
                <h2 style={styles.clientName}>{data.name}</h2>
                <p style={styles.clientTitle}>{data.titulo}</p>

                <div style={styles.levelRow}>
                  <div style={styles.levelCard}>
                    <p style={styles.levelLabel}>Nivel de movimiento</p>
                    <p style={styles.levelValue}>{data.nivel}</p>
                    <p style={styles.levelDetail}>
                      Entrenaste más que <strong>{data.percentile}%</strong> de Caamp.
                    </p>
                  </div>
                </div>
              </div>

              {/* RINGS */}
              <div style={styles.ringsCard}>
                <p style={styles.ringsTitle}>Tu energía en círculos</p>
                <p style={styles.ringsSubtitle}>
                  Movimiento, comunidad y constancia — resumidos en 3 anillos.
                </p>

                <div style={styles.ringsWrapper}>
                  <div style={styles.ringsGraphic}>
                    <div
                      style={{
                        ...styles.ringBase,
                        ...styles.ringOuter,
                        backgroundImage: `conic-gradient(#22c55e ${progress}%, rgba(31,41,55,0.5) ${progress}% 100%)`
                      }}
                    />
                    <div
                      style={{
                        ...styles.ringBase,
                        ...styles.ringMiddle,
                        backgroundImage: `conic-gradient(#06b6d4 ${ringCommunity}%, rgba(15,23,42,0.7) ${ringCommunity}% 100%)`
                      }}
                    />
                    <div
                      style={{
                        ...styles.ringBase,
                        ...styles.ringInner,
                        backgroundImage: `conic-gradient(#eab308 ${porcentajeConstancia}%, rgba(15,23,42,0.7) ${porcentajeConstancia}% 100%)`
                      }}
                    />
                    <div style={styles.ringsCenterText}>
                      <span style={styles.ringsCenterNumber}>{data.total_asistencias}</span>
                      <span style={styles.ringsCenterLabel}>clases</span>
                    </div>
                  </div>

                  <div style={styles.ringsLegend}>
                    <LegendItem color="#22c55e" title="Movimiento total" value={`${progress}% del máximo`} />
                    <LegendItem color="#06b6d4" title="Tu lugar en la comunidad" value={`Top ${data.percentile}%`} />
                    <LegendItem color="#eab308" title="Constancia semanal" value={`${porcentajeConstancia}% del objetivo`} />
                  </div>
                </div>
              </div>

              {/* TOTAL */}
              <div style={styles.mainCard}>
                <p style={styles.cardTag}>Total de entrenamientos</p>

                <div style={styles.mainNumberRow}>
                  <span style={styles.mainNumber}>{data.total_asistencias}</span>
                  <span style={styles.mainNumberCaption}>veces que elegiste moverte</span>
                </div>

                <div style={styles.progressBlock}>
                  <div style={styles.progressTrack}>
                    <div style={{ ...styles.progressBar, width: `${progress}%` }} />
                  </div>
                  <div style={styles.progressLabels}>
                    <span style={styles.progressLabel}>Inicio</span>
                    <span style={styles.progressLabelRight}>Máximo</span>
                  </div>
                </div>

                <div style={styles.chipsRow}>
                  <span style={styles.chipPrimary}>Top {data.percentile}%</span>
                  <span style={styles.chipOutline}>
                    Lugar #{data.rank} de {data.total_clients}
                  </span>
                </div>
              </div>

              {/* CONSTANCIA (frase variable) */}
              <div style={styles.secondaryCard}>
                <p style={styles.cardTag}>Tu constancia</p>

                <div style={styles.statsRow}>
                  <div style={styles.statBlock}>
                    <p style={styles.statLabel}>Promedio al mes</p>
                    <p style={styles.statNumber}>{data.promedio_mensual}</p>
                    <p style={styles.statHint}>clases</p>
                  </div>
                  <div style={styles.statBlock}>
                    <p style={styles.statLabel}>Promedio a la semana</p>
                    <p style={styles.statNumber}>{data.promedio_semanal}</p>
                    <p style={styles.statHint}>sesiones</p>
                  </div>
                </div>

                <p style={styles.secondaryText}>{constanciaLine}</p>
              </div>

              {/* PERSPECTIVA */}
              <div style={styles.equivalenceCard}>
                <p style={styles.equivalenceTitle}>Si lo ponemos en perspectiva…</p>
                <p style={styles.equivalenceText}>
                  Si cada clase fuera una carrera de <strong>5 km</strong>, este año habrías corrido
                  alrededor de <strong>{kmEstimados.toFixed(0)} km</strong> (≈ <strong>{maratones}</strong> maratones).
                </p>
                <p style={styles.equivalenceText}>
                  Y si cada clase fueran <strong>85 m</strong> de subida, escalaste el equivalente al Everest{' '}
                  <strong>{everests}</strong> veces. 🏔️
                </p>
                <p style={styles.equivalenceNote}>(Equivalencias aproximadas.)</p>
              </div>

              {/* FOOTER */}
              <div style={styles.footerCard}>
                <p style={styles.footerTitle}>Cierre</p>
                <p style={styles.footerText}>
                  Gracias por ser parte de Caamp. Este año lo cerraste entrenando. El que sigue… lo rompemos juntos. 💚
                </p>

                <div style={styles.actionsRow}>
                  <button
                    style={styles.shareButton}
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
                    style={styles.backButton}
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
    <div style={styles.ringsLegendItem}>
      <span style={{ ...styles.ringsDot, backgroundColor: color }} />
      <div>
        <p style={styles.ringsLegendLabel}>{title}</p>
        <p style={styles.ringsLegendValue}>{value}</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 10px',
    position: 'relative',
    overflow: 'hidden'
  },
  container: {
    width: '100%',
    maxWidth: 960,
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    animation: 'fadeUp 480ms ease-out'
  },

  animatedBgLayer: { position: 'fixed', inset: 0, background: '#020617', zIndex: 0 },
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

  // Intro
  introHero: {
    position: 'relative',
    borderRadius: 28,
    padding: 16,
    overflow: 'hidden',
    boxShadow: '0 24px 70px rgba(15,23,42,1)',
    border: '1px solid rgba(148,163,184,0.4)'
  },
  introGradient: {
    position: 'absolute',
    inset: '-20%',
    backgroundImage:
      'conic-gradient(from 160deg, #22c55e, #06b6d4, #eab308, #ec4899, #22c55e)',
    backgroundSize: '200% 200%',
    animation: 'gradientMove 22s ease-in-out infinite',
    opacity: 0.9
  },
  introContent: {
    position: 'relative',
    borderRadius: 24,
    padding: 16,
    background:
      'radial-gradient(circle at top, rgba(15,23,42,0.96), rgba(15,23,42,0.98) 60%, rgba(15,23,42,1))',
    color: '#f9fafb'
  },
  introBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10
  },
  introTitle: { margin: 0, marginBottom: 8, fontSize: 26, fontWeight: 800 },
  introGradientText: {
    display: 'block',
    backgroundImage: 'linear-gradient(120deg, #22c55e, #06b6d4, #eab308)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    backgroundSize: '220% 220%',
    animation: 'gradientPulse 10s ease-in-out infinite'
  },
  introSubtitle: { margin: 0, marginBottom: 12, fontSize: 14, lineHeight: 1.5, color: '#e5e7eb' },
  introButton: {
    padding: '11px 18px',
    borderRadius: 999,
    border: 'none',
    backgroundImage: 'linear-gradient(120deg, #f97316, #eab308, #22c55e)',
    color: '#0f172a',
    fontWeight: 700,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    cursor: 'pointer',
    boxShadow: '0 12px 30px rgba(0,0,0,0.6)'
  },
  introHint: { margin: '8px 0 0', fontSize: 11, color: '#cbd5f5' },

  // Hero input
  hero: {
    background: 'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,1))',
    borderRadius: 24,
    padding: 16,
    border: '1px solid rgba(148,163,184,0.32)',
    boxShadow: '0 24px 70px rgba(15,23,42,0.95)',
    color: '#e5e7eb'
  },
  heroTopRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 },

  logoWrap: { display: 'flex', alignItems: 'center', gap: 8 },
  logo: { height: 30, width: 'auto' },
  logoSmall: { height: 28, width: 'auto' },
  brandText: { fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: '#9ca3af' },

  pill: {
    padding: '5px 10px',
    borderRadius: 999,
    border: '1px solid rgba(148,163,184,0.7)',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    color: '#e5e7eb',
    whiteSpace: 'nowrap'
  },

  title: { margin: 0, marginBottom: 6, fontSize: 26, fontWeight: 800, color: '#f9fafb' },
  gradientText: {
    backgroundImage: 'linear-gradient(120deg, #22c55e, #06b6d4, #eab308)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    backgroundSize: '220% 220%',
    animation: 'gradientPulse 10s ease-in-out infinite'
  },
  subtitle: { margin: 0, marginBottom: 14, fontSize: 14, lineHeight: 1.5, color: '#cbd5f5' },

  form: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 6 },
  input: {
    flex: 1,
    minWidth: 200,
    padding: 11,
    borderRadius: 999,
    border: '1px solid rgba(148,163,184,0.8)',
    background: 'rgba(15,23,42,0.95)',
    color: '#f9fafb',
    fontSize: 14,
    outline: 'none'
  },
  ctaButton: {
    padding: '11px 18px',
    borderRadius: 999,
    border: 'none',
    backgroundImage: 'linear-gradient(120deg, #22c55e, #22c55e, #06b6d4)',
    color: '#020617',
    fontWeight: 700,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  error: { marginTop: 4, fontSize: 12, color: '#fca5a5' },
  helper: { marginTop: 6, fontSize: 11, color: '#9ca3af' },

  // Results
  results: { display: 'flex', flexDirection: 'column', gap: 10 },

  headerCard: {
    background: 'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,1))',
    borderRadius: 24,
    padding: 16,
    border: '1px solid rgba(148,163,184,0.45)',
    boxShadow: '0 24px 70px rgba(15,23,42,0.98)'
  },
  headerTopRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  logoRow: { display: 'flex', alignItems: 'center', gap: 8 },

  smallLabel: { margin: '4px 0 0', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.3, color: '#9ca3af' },
  clientName: { margin: '4px 0 2px', fontSize: 24, fontWeight: 800, color: '#f9fafb' },
  clientTitle: { margin: 0, fontSize: 13, color: '#e5e7eb', maxWidth: 360 },

  levelRow: { marginTop: 10, display: 'flex', justifyContent: 'flex-start' },
  levelCard: {
    borderRadius: 18,
    padding: 10,
    background: 'radial-gradient(circle at top left, rgba(34,197,94,0.26), rgba(15,23,42,1))',
    border: '1px solid rgba(34,197,94,0.75)',
    color: '#f9fafb',
    animation: 'cardFloat 7s ease-in-out infinite',
    maxWidth: 260
  },
  levelLabel: { margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.4, color: '#bbf7d0' },
  levelValue: { margin: '4px 0 2px', fontSize: 15, fontWeight: 700 },
  levelDetail: { margin: 0, fontSize: 12, color: '#e5e7eb' },

  ringsCard: {
    borderRadius: 20,
    padding: 14,
    background: 'rgba(15,23,42,0.98)',
    border: '1px solid rgba(148,163,184,0.5)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  ringsTitle: { margin: 0, fontSize: 13, fontWeight: 600, color: '#f9fafb' },
  ringsSubtitle: { margin: 0, fontSize: 12, color: '#e5e7eb' },

  ringsWrapper: { marginTop: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  ringsGraphic: { position: 'relative', width: 150, height: 150, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  ringBase: { position: 'absolute', borderRadius: '50%' },
  ringOuter: { inset: 0, padding: 6 },
  ringMiddle: { inset: 16, padding: 6 },
  ringInner: { inset: 32, padding: 6 },

  ringsCenterText: {
    position: 'relative',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #020617, #020617 60%, #0b1220 100%)',
    width: 76,
    height: 76,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 0 3px rgba(15,23,42,1)'
  },
  ringsCenterNumber: { fontSize: 20, fontWeight: 700 },
  ringsCenterLabel: { fontSize: 11, color: '#9ca3af' },

  ringsLegend: { width: '100%', display: 'flex', flexDirection: 'column', gap: 6 },
  ringsLegendItem: { display: 'flex', alignItems: 'center', gap: 8 },
  ringsDot: { width: 10, height: 10, borderRadius: '50%' },
  ringsLegendLabel: { margin: 0, fontSize: 12, color: '#e5e7eb' },
  ringsLegendValue: { margin: 0, fontSize: 11, color: '#9ca3af' },

  mainCard: {
    borderRadius: 20,
    padding: 14,
    background: 'rgba(15,23,42,0.98)',
    border: '1px solid rgba(148,163,184,0.55)',
    boxShadow: '0 18px 40px rgba(15,23,42,0.9)'
  },
  cardTag: { margin: 0, marginBottom: 6, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.6, color: '#9ca3af' },

  mainNumberRow: { display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 8, marginBottom: 8 },
  mainNumber: { fontSize: 32, fontWeight: 800, color: '#f9fafb' },
  mainNumberCaption: { fontSize: 12, color: '#d1d5db' },

  progressBlock: { marginBottom: 8 },
  progressTrack: { width: '100%', height: 8, borderRadius: 999, background: 'rgba(15,23,42,1)', overflow: 'hidden', border: '1px solid rgba(51,65,85,0.85)' },
  progressBar: { height: '100%', borderRadius: 999, backgroundImage: 'linear-gradient(90deg, #22c55e, #22c55e, #06b6d4)', transition: 'width 600ms ease-out' },
  progressLabels: { display: 'flex', justifyContent: 'space-between', marginTop: 4 },
  progressLabel: { fontSize: 11, color: '#9ca3af' },
  progressLabelRight: { fontSize: 11, color: '#e5e7eb' },

  chipsRow: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  chipPrimary: { padding: '5px 9px', borderRadius: 999, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.7)', fontSize: 11, color: '#bbf7d0' },
  chipOutline: { padding: '5px 9px', borderRadius: 999, border: '1px solid rgba(148,163,184,0.8)', fontSize: 11, color: '#e5e7eb' },

  secondaryCard: { borderRadius: 20, padding: 14, background: 'rgba(15,23,42,0.96)', border: '1px solid rgba(148,163,184,0.5)' },
  statsRow: { display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 2 },
  statBlock: { flex: 1 },
  statLabel: { margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.3, color: '#94a3b8' },
  statNumber: { margin: '3px 0 2px', fontSize: 22, fontWeight: 700, color: '#f9fafb' },
  statHint: { margin: 0, fontSize: 11, color: '#cbd5f5' },
  secondaryText: { margin: '10px 0 0', fontSize: 12.5, color: '#e5e7eb' },

  equivalenceCard: { borderRadius: 20, padding: 14, background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(148,163,184,0.5)' },
  equivalenceTitle: { margin: 0, marginBottom: 4, fontSize: 13, fontWeight: 600, color: '#f9fafb' },
  equivalenceText: { margin: 0, marginBottom: 4, fontSize: 12.5, color: '#e5e7eb' },
  equivalenceNote: { margin: '6px 0 0', fontSize: 11, color: '#9ca3af' },

  footerCard: { borderRadius: 20, padding: 14, background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(148,163,184,0.5)', marginBottom: 4 },
  footerTitle: { margin: 0, marginBottom: 4, fontSize: 13, fontWeight: 600, color: '#f9fafb' },
  footerText: { margin: 0, marginBottom: 10, fontSize: 12.5, color: '#e5e7eb' },

  actionsRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
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

  // Loading
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
    background: 'radial-gradient(circle at top, rgba(34,197,94,0.3), rgba(15,23,42,1))',
    border: '1px solid rgba(34,197,94,0.8)',
    textAlign: 'center',
    boxShadow: '0 26px 60px rgba(0,0,0,0.95)'
  },
  loadingRingWrap: { display: 'flex', justifyContent: 'center', marginBottom: 10 },
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
    justifyContent: 'center'
  },
  loadingRingInner: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    backgroundImage: 'linear-gradient(135deg, #22c55e, #06b6d4, #eab308)',
    opacity: 0.92
  },
  loadingTitle: { margin: 0, marginBottom: 4, fontSize: 15, fontWeight: 700, color: '#f9fafb' },
  loadingText: { margin: 0, marginBottom: 10, fontSize: 12.5, color: '#e5e7eb' },
  loadingDots: { display: 'flex', justifyContent: 'center', gap: 6 },
  loadingDot: { width: 6, height: 6, borderRadius: '50%', background: '#bbf7d0', animation: 'dotPulse 1.1s ease-in-out infinite' }
};
