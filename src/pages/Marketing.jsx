import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sun, Activity, Leaf, Zap, Server, LayoutDashboard, Cpu, Radio, Database, BatteryCharging, RotateCw } from 'lucide-react';
import '../styles/marketing.css';

function SunTrackerScene() {
  const sceneRef = useRef(null);

  useEffect(() => {
    const section = sceneRef.current;
    if (!section) return undefined;
    let frame = 0;
    const updateScene = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = section.getBoundingClientRect();
        const travel = Math.max(1, section.offsetHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -bounds.top / travel));
        const sunX = 9 + progress * 82;
        const sunY = 19 + Math.sin(progress * Math.PI) * -12;
        const panelAngle = -34 + progress * 68;
        section.style.setProperty('--day-progress', progress.toFixed(4));
        section.style.setProperty('--sun-x', `${sunX}%`);
        section.style.setProperty('--sun-y', `${sunY}%`);
        section.style.setProperty('--panel-angle', `${panelAngle}deg`);
        section.dataset.phase = progress < 0.34 ? 'morning' : progress < 0.68 ? 'midday' : 'evening';
      });
    };
    updateScene();
    window.addEventListener('scroll', updateScene, { passive: true });
    window.addEventListener('resize', updateScene);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateScene);
      window.removeEventListener('resize', updateScene);
    };
  }, []);

  return <section className="sun-tracker" ref={sceneRef} aria-label="Solar panel following the sun through the day">
    <div className="sun-track-scene">
      <div className="day-copy"><span className="eyebrow">SUNLIGHT, PUT TO WORK</span><h2>Following the sun.<br />Making every ray count.</h2><p>As the day moves, your panels move with it. Autolar keeps you close to the light your system is catching.</p></div>
      <div className="sun-path" aria-hidden="true"><span className="sun-path-line"/><span className="sun-orb"/><span className="path-marker morning">7 AM</span><span className="path-marker midday">12 PM</span><span className="path-marker evening">6 PM</span></div>
      <div className="tracker-ground" aria-hidden="true"><div className="tracker-hill hill-one"/><div className="tracker-hill hill-two"/><div className="solar-tracker-rig"><div className="tracker-post"/><div className="tracker-panel"><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/></div><div className="tracker-base"/></div></div>
      <div className="tracking-caption">DUAL-AXIS TRACKER <b>ESP32 CONTROL</b><span className="tracking-separator"/> <span className="tracking-phase">LIGHT SENSORS · PAN · TILT</span></div>
    </div>
  </section>;
}

function SystemArchitectureScene() {
  const sceneRef = useRef(null);
  useEffect(() => {
    const section = sceneRef.current;
    if (!section) return undefined;
    let frame = 0;
    const updateScene = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = section.getBoundingClientRect();
        const travel = Math.max(1, section.offsetHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -bounds.top / travel));
        section.style.setProperty('--architecture-progress', progress.toFixed(4));
        section.style.setProperty('--architecture-sun-x', `${13 + progress * 72}%`);
        section.style.setProperty('--architecture-pan', `${-23 + progress * 46}deg`);
        section.style.setProperty('--architecture-tilt', `${18 - progress * 35}deg`);
        section.dataset.stage = progress < .34 ? 'sense' : progress < .68 ? 'decide' : 'track';
      });
    };
    updateScene();
    window.addEventListener('scroll', updateScene, { passive: true });
    window.addEventListener('resize', updateScene);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateScene);
      window.removeEventListener('resize', updateScene);
    };
  }, []);

  return <section className="architecture-scroll" ref={sceneRef} aria-label="Solar tracker system architecture">
    <div className="architecture-stage">
      <div className="architecture-heading"><span className="eyebrow">A TRACKER THAT THINKS</span><h2>Light in.<br/>More energy out.</h2><p>Four light sensors find the brightest direction. The ESP32 moves the panel, while the power monitor keeps an eye on every watt.</p><div className="architecture-step"><span className="step-index">01</span><div><b>{'{sense}'}</b><small>Light sensors read the sky</small></div><div><b>{'{decide}'}</b><small>ESP32 finds the best angle</small></div><div><b>{'{track}'}</b><small>Servos turn the panel</small></div></div></div>
      <div className="architecture-board" aria-hidden="true">
        <div className="architecture-sky"><span className="architecture-sun"/><span className="architecture-horizon"/></div>
        <div className="component-label label-solar"><i/>SOLAR PANEL<small>DUAL AXIS TRACKING</small></div>
        <div className="solar-assembly"><div className="assembly-shadow"/><div className="moving-panel"><div className="panel-glass"><i/><i/><i/><i/><i/><i/></div><div className="panel-frame"/><span className="panel-glint"/></div><div className="tilt-bracket"/><div className="tilt-servo"><span/><i/></div><div className="pan-arm"/><div className="pan-servo"><span/><i/></div><div className="mast"/><div className="mast-foot"/></div>
        <div className="component-label label-ldr"><i/>LDR ARRAY<small>LIGHT INTENSITY</small></div><div className="ldr-module"><span/><span/><span/><span/><i/></div>
        <div className="component-label label-esp"><i/>ESP32<small>CONTROL + LOGGING</small></div><div className="esp-module"><div className="esp-chip">ESP32<small>WiFi + BLE</small></div><div className="esp-pins"/><div className="esp-usb"/></div>
        <div className="component-label label-ina"><i/>INA219<small>VOLTAGE · CURRENT · POWER</small></div><div className="ina-module"><i/><i/><i/><span/></div>
        <div className="component-label label-battery"><i/>BATTERY<small>2 × 1200 mAh</small></div><div className="battery-module"><span/><span/><i/></div>
        <div className="component-label label-charge"><i/>CHARGER<small>PROTECTED SUPPLY</small></div><div className="charge-module"><i/><span/></div>
        <svg className="circuit-lines" viewBox="0 0 1000 620" preserveAspectRatio="none">
          <defs><marker id="arrow-green" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#4a9a79"/></marker><marker id="arrow-amber" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#dfa749"/></marker><marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#6798b0"/></marker></defs>
          <path className="data-wire wire-ldr" d="M335 178H425V255H500" markerEnd="url(#arrow-green)"/><path className="data-wire wire-servo" d="M505 317H425V420H260" markerEnd="url(#arrow-amber)"/><path className="data-wire wire-meter" d="M735 286H665" markerEnd="url(#arrow-blue)"/><path className="data-wire wire-power" d="M622 500V438" markerEnd="url(#arrow-amber)"/><path className="data-wire wire-charge" d="M785 504H714" markerEnd="url(#arrow-amber)"/>
        </svg>
        <span className="wire-caption caption-signal">SENSOR DATA</span><span className="wire-caption caption-servo">PAN / TILT</span><span className="wire-caption caption-i2c">I²C</span><span className="wire-caption caption-power">POWER</span>
        <div className="architecture-vignette"/>
      </div>
      <div className="architecture-footer"><span>TRACKER OVERVIEW</span><span className="architecture-current-step"><b className="stage-sense">READING LIGHT LEVELS</b><b className="stage-decide">PROCESSING SENSOR DATA</b><b className="stage-track">TRACKING SUNLIGHT</b></span><span>ESP32 · INA219 · 2 AXIS</span></div>
    </div>
  </section>;
}

const flowSteps = [
  { icon: Cpu, number: '01', title: 'Measure and move', detail: 'ESP32 tracker', note: 'Sensor readings and mode commands', tone: 'violet' },
  { icon: Server, number: '02', title: 'Serve device data', detail: 'Spring Boot REST API', note: 'Latest, history, recommendation, mode', tone: 'blue' },
  { icon: Database, number: '03', title: 'Store telemetry', detail: 'JDBC + AWS RDS', note: 'Backend database connection', tone: 'green' },
  { icon: LayoutDashboard, number: '04', title: 'Explore readings', detail: 'React dashboard', note: 'Metrics, trends, weather, guidance', tone: 'mint' },
];

function DataFlowScene() {
  return <section className="data-flow-section" aria-labelledby="data-flow-title">
    <div className="flow-heading"><span className="eyebrow">FROM DEVICE TO DASHBOARD</span><h2 id="data-flow-title">Every reading has a destination.</h2><p>The ESP32 sends readings to the Spring Boot API. The backend stores telemetry in RDS and serves the React dashboard.</p></div>
    <div className="hardware-flow-card">
      <div className="hardware-flow-title"><span>EDGE HARDWARE</span><b>Sense · Measure · Move</b></div>
      <div className="hardware-parts">
        <div><span className="part-icon panel-part"><Sun size={20}/></span><b>Solar panel</b><small>Dual-axis tracker</small></div>
        <div><span className="part-icon sensor-part"><Sun size={20}/></span><b>LDR sensors ×4</b><small>Find brightest light</small></div>
        <div><span className="part-icon meter-part"><Activity size={20}/></span><b>INA219</b><small>Voltage + current</small></div>
        <div><span className="part-icon esp-part"><Cpu size={20}/></span><b>ESP32</b><small>Control + Wi-Fi</small></div>
        <div><span className="part-icon battery-part"><BatteryCharging size={20}/></span><b>Battery + charger</b><small>Protected power</small></div>
        <div><span className="part-icon servo-part"><RotateCw size={20}/></span><b>Dual-axis servos</b><small>Turn toward the sun</small></div>
      </div>
      <div className="hardware-output"><i/> ESP32 packages sensor + power readings</div>
    </div>
    <div className="flow-transition"><span/> Telemetry travels to the cloud and back <span/></div>
    <div className="flow-rail" aria-label="System data flow">
      {flowSteps.map(({ icon: Icon, number, title, detail, note, tone }, index) => <React.Fragment key={number}>
        <article className={`flow-node ${tone}`}><span className="flow-node-icon"><Icon size={21} strokeWidth={1.8}/></span><span className="flow-number">{number}</span><h3>{title}</h3><b>{detail}</b><p>{note}</p></article>
        {index < flowSteps.length - 1 && <span className="flow-connector" aria-hidden="true"><i/></span>}
      </React.Fragment>)}
    </div>
    <div className="flow-footer"><span><Radio size={17}/> Device telemetry</span><span><Database size={17}/> Historical readings</span><span><Activity size={17}/> API refreshes every 5 seconds</span></div>
  </section>;
}

export default function Marketing({ page = 'home' }) {
  const about = page === 'about';
  return <div className="marketing">
    <main>
      <section className="landscape-hero" aria-label="Autolar solar monitoring">
        <header className="marketing-nav">
          <Link className="marketing-brand" to="/"><span className="brand-mark"><img className="autolar-logo-mark" src="/autolar-logo-mark.svg" alt="" /></span> autolar</Link>
          <nav aria-label="Main navigation"><a href="#features">Features</a><Link to="/about">About</Link><a href="#impact">Our impact</a></nav>
          <div className="nav-actions"><Link className="nav-signin" to="/login">Sign in</Link><Link className="marketing-cta small" to="/signup">Get started</Link></div>
        </header>

        <div className="hero-copy">
          <span className="eyebrow"><span className="live-dot" /> A brighter way to go solar</span>
          <h1>{about ? <>A clearer view of<br />every sunny day.</> : <>Make more of the<br className="desktop-break" /> energy you make.</>}</h1>
          <p>{about ? 'Autolar helps solar owners understand their production, care for their system, and make every sunny day count.' : 'See what your panels are making, how your system is doing, and the difference it makes, all in one calm place.'}</p>
          <div className="hero-actions">
            <Link className="marketing-cta" to="/signup">Start for free <ArrowRight size={16} /></Link>
            <a className="dark-cta" href="#features">Explore Autolar</a>
          </div>
        </div>

        <div className="solar-preview api-preview" aria-label="Data shown after cloud API connection">
          <div className="preview-head"><span className="preview-logo"><img className="autolar-logo-mark" src="/autolar-logo-mark.svg" alt="" /></span><span className="preview-breadcrumb">Autolar <span>/</span> API-backed dashboard</span><span className="preview-online">API fields</span></div>
          <div className="preview-content">
            <div className="preview-heading"><div><span className="preview-kicker">FROM YOUR DEVICE AND CLOUD API</span><h2>Only your reported data.</h2></div></div>
            <div className="preview-stats">
              <div className="preview-stat lime"><span>TELEMETRY</span><strong>Power</strong><em>Voltage ? current ? LDR ? pan ? tilt</em></div>
              <div className="preview-stat dark"><span>HISTORY</span><strong>Readings</strong><em>Timestamped telemetry</em></div>
              <div className="preview-stat mint"><span>RECOMMENDATION</span><strong>Weather + mode</strong><em>Cloud conditions ? confidence ? reason</em></div>
            </div>
            <div className="preview-chart api-preview-note">Connect your API address and device ID to load the dashboard.</div>
          </div>
        </div>

        <div className="customer-proof"><span>MADE FOR A BRIGHTER EVERYDAY</span><div><b>Home</b><b><Sun size={15}/> Solar</b><b>Energy</b><b><Leaf size={15}/> Earth</b></div></div>
        <div className="hill hill-back" /><div className="hill hill-mid" /><div className="hill hill-front" />
      </section>

      <SunTrackerScene />

      <SystemArchitectureScene />

      <DataFlowScene />

      <section className="feature-section" id="features"><div className="section-intro"><span className="eyebrow">A LITTLE MORE CLARITY</span><h2>{about ? 'Solar that makes sense.' : 'Your solar story, in full view.'}</h2><p>Explore readings and recommendations returned by your device API.</p></div><div className="feature-grid"><article><span className="feature-icon green"><Activity size={20}/></span><h3>Read the live telemetry</h3><p>See measured power, panel voltage and current, sensor levels, and tracker position.</p></article><article><span className="feature-icon gold"><Zap size={20}/></span><h3>Review the history</h3><p>Compare timestamped device readings and follow power, voltage, and current trends.</p></article><article id="impact"><span className="feature-icon blue"><RotateCw size={20}/></span><h3>Control tracker mode</h3><p>Send a Tracking or Static mode command through the backend API.</p></article></div></section>
      <section className="closing-cta"><div><span className="eyebrow">YOUR SUNSHINE, MADE VISIBLE</span><h2>Let the good energy in.</h2><p>Bring your solar system into clearer view with Autolar.</p></div><Link className="marketing-cta" to="/signup">Get started <ArrowRight size={16}/></Link></section>
    </main>
    <footer className="marketing-footer"><Link className="marketing-brand" to="/"><span className="brand-mark"><img className="autolar-logo-mark" src="/autolar-logo-mark.svg" alt="" /></span> autolar</Link><span>Solar, made clearer.</span><span>© 2026 Autolar</span></footer>
  </div>;
}
