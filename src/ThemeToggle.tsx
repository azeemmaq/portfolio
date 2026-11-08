import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(document.documentElement.dataset.theme === 'dark')
  useEffect(() => {
    const sync = () => setDark(document.documentElement.dataset.theme === 'dark')
    document.addEventListener('portfolio-theme-change', sync)
    return () => document.removeEventListener('portfolio-theme-change', sync)
  }, [])

  return <button className="theme-toggle" type="button" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => document.dispatchEvent(new Event('portfolio-theme-toggle'))}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{dark ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></> : <path d="M20.5 13.4A8.8 8.8 0 0 1 10.6 3.5 8.8 8.8 0 1 0 20.5 13.4Z" />}</svg>
  </button>
}
