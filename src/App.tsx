import { useEffect, useRef, useState } from 'react'
import profile from './data/profile.json'
import './App.css'

const resumeUrl = `${import.meta.env.BASE_URL}Azeem-Maqbool-Resume.pdf`
const imageUrl = (name: string) => `${import.meta.env.BASE_URL}images/${name}`
const emailUrl = `mailto:${profile.email}?subject=${encodeURIComponent('Let’s talk about a telecom opportunity')}`
const nav = [['About', 'about'], ['Projects', 'projects'], ['Services', 'services'], ['Experience', 'experience']] as const

function Arrow({ down = false }: { down?: boolean }) {
  return <svg className="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={down ? 'M12 3v17m-7-7 7 7 7-7' : 'M5 19 19 5M5 5h14v14'} stroke="currentColor" strokeWidth="1.5" /></svg>
}

const generations = [
  { name: '3G', title: 'The foundations of coverage.', description: 'Huawei NodeB deployment, WCDMA integration, drive testing and single-site verification for du and Omantel.', tags: ['WCDMA', 'NodeB', 'Drive testing'], nodes: 4 },
  { name: '4G / LTE', title: 'Coverage, capacity, continuity.', description: 'IBS design, LTE rollouts, microwave transmission and network modernization, from site surveys through acceptance.', tags: ['LTE', 'IBS design', 'Microwave'], nodes: 6 },
  { name: '5G', title: 'Complex spaces. Connected.', description: 'Active and passive DAS, SRAN, swaps and 5G deployment at Nokia UAE, including Zayed International Airport.', tags: ['5G NR', 'SRAN', 'Active & passive DAS'], nodes: 8 },
]

function NetworkGraphic({ nodes }: { nodes: number }) {
  return <svg className="network-graphic" viewBox="0 0 560 420" fill="none" aria-hidden="true">
    <g className="network-orbits" stroke="currentColor" strokeWidth="0.7">
      {[64, 104, 144, 184].map((r) => <ellipse key={r} cx="280" cy="210" rx={r * 1.32} ry={r * 0.66} />)}
      <ellipse cx="280" cy="210" rx="100" ry="184" transform="rotate(-45 280 210)" />
      <ellipse cx="280" cy="210" rx="100" ry="184" transform="rotate(45 280 210)" />
    </g>
    <g className="network-connections" key={nodes}>{Array.from({ length: nodes }, (_, i) => {
      const angle = (i / nodes) * Math.PI * 2 - Math.PI / 2
      const x = 280 + Math.cos(angle) * 220
      const y = 210 + Math.sin(angle) * 145
      return <g key={i} style={{ animationDelay: `${i * 60}ms` }}><path d={`M280 210 Q${280 + (x - 280) * .25} ${y} ${x} ${y}`} stroke="currentColor" strokeWidth="1.2" /><circle cx={x} cy={y} r="5" fill="currentColor" /><circle cx={x} cy={y} r="12" stroke="currentColor" strokeWidth="1" /></g>
    })}</g>
    <circle cx="280" cy="210" r="30" fill="var(--accent)" />
    <g stroke="var(--paper)" strokeWidth="1.5"><path d="M280 197v26m-8 0 8-18 8 18m-12-7h8m-15-20a15 15 0 0 0 0 17m22-17a15 15 0 0 1 0 17" /></g>
  </svg>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [generation, setGeneration] = useState(2)
  const [activeSection, setActiveSection] = useState('')
  const menuButton = useRef<HTMLButtonElement>(null)
  const network = generations[generation]

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element))
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id) })
    }, { rootMargin: '-15% 0px -60% 0px' })
    document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section))
    return () => { observer.disconnect(); sectionObserver.disconnect() }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus() }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [menuOpen])

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Azeem Maqbool, home">AM<span>.</span></a>
      <button ref={menuButton} className="menu-toggle" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close' : 'Menu'}<span aria-hidden="true">{menuOpen ? '−' : '+'}</span></button>
      <nav id="primary-navigation" className={menuOpen ? 'navigation is-open' : 'navigation'} aria-label="Main navigation">
        {nav.map(([label, id]) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined} onClick={() => setMenuOpen(false)}>{label}</a>)}
        <a href={profile.linkedin} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>LinkedIn <span aria-hidden="true">↗</span></a>
        <a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>Let’s talk <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
    <main id="main">
      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="hero-role">Telecommunications Project Engineer</p>
            <h1 id="hero-title"><span className="hero-line"><span>Azeem</span></span><span className="hero-line"><span>Maqbool.</span></span></h1>
            <p className="hero-description">I bring networks to life.<br />From in-building coverage to 5G deployment.</p>
            <div className="hero-actions"><a className="button button-dark" href="#projects">Explore my work <Arrow down /></a><a className="text-link" href={resumeUrl} download>Download résumé <span aria-hidden="true">↓</span></a></div>
          </div>
          <div className="hero-network"><NetworkGraphic nodes={8} /><div className="hero-network-caption"><span>5G NR</span><span>IBS / DAS</span><span>Connected infrastructure</span></div><p>From one site to a connected network.</p></div>
        </div>
        <div className="hero-footnote"><span>15+ years of international experience</span><span>Based in Melbourne, Victoria, Australia</span></div>
      </section>
      <section className="about section-pad" id="about" aria-labelledby="about-title">
        <div className="section-side" data-reveal><h2 id="about-title">Good networks.<br />Real connections.</h2><a className="text-link" href="#contact">Get in touch <span aria-hidden="true">↗</span></a></div>
        <div className="about-copy"><p className="statement" data-reveal>I’m Azeem, a telecommunications engineer who takes complex network projects from the first site survey to the final handover.</p><div className="about-columns" data-reveal><p>Over 15 years, I’ve worked across the UAE, Oman and Pakistan, delivering the infrastructure that keeps airports, hospitals, hotels and commercial spaces connected.</p><p>Now based in Melbourne, I bring practical field experience in IBS, DAS, commissioning and 4G/5G delivery, alongside the coordination it takes to get teams over the line.</p></div><div className="about-facts" data-reveal><span>Australian permanent resident</span><span>Full work rights</span><span>Victorian full driver’s licence</span></div></div>
      </section>
      <section className="projects" id="projects" aria-labelledby="projects-title">
        <div className="section-heading section-pad"><h2 id="projects-title" data-reveal>Connections at scale.</h2><p data-reveal>Selected project delivery<br />Nokia UAE · du in-building coverage</p></div>
        <figure className="airport-image" data-reveal><img src={imageUrl('zayed-terminal.jpg')} alt="The sweeping illuminated architecture of Terminal A at Zayed International Airport" width="1280" height="960" loading="lazy" /><figcaption>Zayed International Airport, Abu Dhabi <span>Terminal A / Midfield Terminal Building</span></figcaption></figure>
        <div className="project-detail section-pad"><div data-reveal><h3>Zayed International<br />Airport</h3><p className="project-tech">5G · SRAN · Active & passive DAS</p></div><div data-reveal><p>A landmark deployment in a complex, high-traffic environment. I delivered passive SRAN/5G sites and an active 5G solution, coordinating eight teams through project completion.</p><p>From installation and integration to testing and acceptance, the work brought field teams, RF specialists, NOC and subcontractors together.</p></div></div>
        <div className="project-stats section-pad"><div data-reveal><strong>16</strong><span>Passive SRAN / 5G sites</span></div><div data-reveal><strong>100+</strong><span>pRRHs across one active 5G site</span></div><div data-reveal><strong>8</strong><span>Teams coordinated to completion</span></div></div>
        <div className="airport-diptych"><img src={imageUrl('zayed-concourse.jpg')} alt="Retail concourse beneath Terminal A’s sculpted roof" width="1280" height="960" loading="lazy" data-reveal /><img src={imageUrl('zayed-detail.jpg')} alt="Interior architecture at Zayed International Airport Terminal A" width="1280" height="960" loading="lazy" data-reveal /></div>
        <div className="project-places section-pad"><p data-reveal>Also delivered at</p><p className="places-list" data-reveal>{profile.projects.join(' · ')}</p></div>
      </section>
      <section className="expertise section-pad" aria-labelledby="expertise-title">
        <div className="expertise-top"><h2 id="expertise-title" data-reveal>From 3G to 5G.</h2><p data-reveal>Different generations.<br />The same hands-on approach.</p></div>
        <div className="expertise-grid"><div className="network-visual" data-reveal><NetworkGraphic nodes={network.nodes} /><p>Radio access & in-building networks <span>Conceptual illustration</span></p></div><div className="network-copy" data-reveal><div className="generation-select" role="group" aria-label="Explore network experience">{generations.map((item, index) => <button key={item.name} type="button" aria-pressed={generation === index} onClick={() => setGeneration(index)}>{item.name}</button>)}</div><div className="generation-description" aria-live="polite" aria-atomic="true"><h3>{network.title}</h3><p>{network.description}</p><div className="tech-tags">{network.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></div></div>
      </section>
      <section className="services section-pad" id="services" aria-labelledby="services-title"><div className="section-side" data-reveal><h2 id="services-title">How I can help.</h2><p>Practical engineering support,<br />from planning to acceptance.</p></div><div className="services-list">{profile.services.map((service) => <details key={service.title} data-reveal><summary><h3>{service.title}</h3><span className="disclosure" aria-hidden="true" /></summary><div className="details-content"><p>{service.description}</p><a className="text-link" href={`mailto:${profile.email}?subject=${encodeURIComponent(`Enquiry: ${service.title}`)}`}>Discuss your project <span aria-hidden="true">↗</span></a></div></details>)}</div></section>
      <section className="experience section-pad" id="experience" aria-labelledby="experience-title"><div className="section-heading"><h2 id="experience-title" data-reveal>Built in the field.</h2><p data-reveal>A career in network delivery.<br />UAE, Oman and Pakistan.</p></div><div className="experience-list">{profile.experience.map((job, index) => <details className="experience-row" key={`${job.company}-${job.title}`} open={index === 0 ? true : undefined} data-reveal><summary><span className="job-period">{job.period}</span><span className="job-main"><span className="job-company">{job.company}</span><span className="job-title">{job.title}</span></span><span className="job-location">{job.location}</span><span className="disclosure" aria-hidden="true" /></summary><div className="job-details"><p>{job.project}</p><ul>{job.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div></details>)}</div></section>
      <section className="credentials section-pad" aria-labelledby="credentials-title"><h2 id="credentials-title" data-reveal>Grounded in practice.</h2><div className="credentials-grid"><div data-reveal><h3>Education</h3><p className="credential-degree">Telecommunications<br />Engineering</p><p>Preston Institute of Management<br />Sciences & Technology, Pakistan</p><p>2001–2005</p><p>Engineers Australia skills assessment:<br />Telecommunication Engineer</p></div><div data-reveal><h3>Training & licences</h3><ul className="certifications">{profile.certifications.map((cert) => <li key={cert.title}><span>{cert.title}</span><span>{cert.year}</span></li>)}</ul></div></div><div className="technical-toolkit" data-reveal><h3>Technical toolkit</h3><p>{profile.equipment}</p></div></section>
      <section className="contact" id="contact" aria-labelledby="contact-title"><div className="contact-main section-pad"><div><h2 id="contact-title" data-reveal>Let’s connect.</h2><p className="contact-intro" data-reveal>Have a role or a network project in mind?<br />Let’s talk about how I can help.</p><a className="button button-dark" href={emailUrl} data-reveal>Start a conversation <Arrow /></a></div><div className="contact-details" data-reveal><a href={`mailto:${profile.email}`}>{profile.email}</a><a href={`tel:${profile.phoneInternational}`}>{profile.phoneDisplay}</a><a href={profile.linkedin} target="_blank" rel="noreferrer">Connect on LinkedIn <span aria-hidden="true">↗</span></a><a href={resumeUrl} download>Download résumé (PDF) <span aria-hidden="true">↓</span></a><p>Melbourne, Victoria<br />Australian permanent resident · Full work rights</p></div></div><div className="location-strip"><span>Based in</span><strong>Melbourne, Victoria, Australia</strong><p>International experience. Local commitment.</p></div></section>
    </main>
    <footer className="site-footer"><div className="footer-top"><a className="wordmark" href="#home" aria-label="Back to top">AM.</a><p>Engineering connections that last.</p><a href="#home">Back to top ↑</a></div><details className="credits"><summary>Photography credits</summary><p>Terminal A photographs by Vincent van Zeijst, via Wikimedia Commons, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>. Display crops; the photographs and their adaptations retain this licence. <a href="https://commons.wikimedia.org/wiki/File:Abu_Dhabi_(UAE),_Zayed_International_Airport,_Terminal_A_(01).jpg" target="_blank" rel="noreferrer">Terminal photograph</a>, <a href="https://commons.wikimedia.org/wiki/File:Abu_Dhabi_(UAE),_Zayed_International_Airport,_Terminal_A_(02).jpg" target="_blank" rel="noreferrer">concourse photograph</a> and <a href="https://commons.wikimedia.org/wiki/File:Abu_Dhabi_(UAE),_Zayed_International_Airport,_Terminal_A_(04).jpg" target="_blank" rel="noreferrer">interior photograph</a>.</p></details><div className="footer-bottom"><span>© {new Date().getFullYear()} Azeem Maqbool</span><span>Telecommunications Project Engineer</span></div></footer>
  </>
}
export default App
