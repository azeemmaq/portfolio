import { useEffect, useRef, useState } from 'react'
import './HeroNetwork.css'

const sites = [
  { label: 'Airport', name: 'Zayed International Airport', detail: '16 passive SRAN/5G sites and one active 5G site, delivered with eight coordinated teams.', x: 105, y: 85, icon: 'M5 12h14M12 4v16m-6-3 6-3 6 3M5 9l7 3 7-3' },
  { label: 'Healthcare', name: 'Cleveland Clinic Abu Dhabi', detail: 'In-building network delivery in a complex healthcare environment.', x: 495, y: 85, icon: 'M9 4h6v5h5v6h-5v5H9v-5H4V9h5Z' },
  { label: 'Retail', name: 'Malls across Abu Dhabi', detail: 'Project delivery at Reem Mall, Abu Dhabi Mall, Al Wahda Mall, Marina Mall and World Trade Center Mall.', x: 105, y: 285, icon: 'M5 8h14l1 12H4L5 8Zm3 0V6a4 4 0 0 1 8 0v2' },
  { label: 'Hospitality', name: 'Four Seasons Hotel', detail: 'Telecommunications project delivery for a major hospitality destination.', x: 495, y: 285, icon: 'M5 21V3h14v18M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1m-5 6v-3h4v3' },
]

export default function HeroNetwork() {
  const [selected, setSelected] = useState(0)
  const [inView, setInView] = useState(true)
  const [tabVisible, setTabVisible] = useState(!document.hidden)
  const scene = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    if (scene.current) observer.observe(scene.current)
    const updateVisibility = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', updateVisibility) }
  }, [])

  return <div ref={scene} className="connection-scene" data-running={inView && tabVisible}>
    <div className="connection-toolbar"><span>Explore a connection</span></div>
    <div className="connection-map">
      <svg className="connection-wires" viewBox="0 0 600 370" fill="none" aria-hidden="true">
        <circle className="coverage-ring" cx="300" cy="185" r="64" />
        <circle className="coverage-ring coverage-ring-later" cx="300" cy="185" r="64" />
        {sites.map((site, i) => {
          const path = `M300 185 C${site.x} 185 300 ${site.y} ${site.x} ${site.y}`
          return <g key={site.label} className={selected === i ? 'site-link selected' : 'site-link'}>
            <path className="connection-track" d={path} />
            <path className="connection-packet" d={path} pathLength="100" style={{ animationDelay: `${i * -.8}s` }} />
            <path className="connection-packet packet-return" d={path} pathLength="100" style={{ animationDelay: `${i * -.8 - 1.5}s` }} />
          </g>
        })}
      </svg>
      <div className="connection-hub"><svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 13v22m-9 0 9-16 9 16m-14-6h10M15 12a15 15 0 0 0 0 16m18-16a15 15 0 0 1 0 16M9 7a23 23 0 0 0 0 26M39 7a23 23 0 0 1 0 26" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg><span>5G / DAS</span></div>
      <div role="group" aria-label="Explore connected project sites">{sites.map((site, i) => <button className="connection-site" key={site.label} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)} style={{ left: `${site.x / 6}%`, top: `${site.y / 3.7}%` }}><span className="site-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={site.icon} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span><span>{site.label}</span></button>)}</div>
    </div>
    <div className="connection-detail" aria-live="polite" aria-atomic="true"><strong>{sites[selected].name}</strong><p>{sites[selected].detail}</p></div>
    <p className="connection-caption">Select a site to explore Azeem’s work. Network illustration.</p>
  </div>
}
