// Run before the page renders so the saved or system theme appears immediately.
(() => {
  const root = document.documentElement
  const system = window.matchMedia('(prefers-color-scheme: dark)')
  const key = 'azeem-portfolio-theme'
  let preference
  try { preference = localStorage.getItem(key) } catch { /* Storage can be unavailable in private browsing. */ }
  if (preference !== 'light' && preference !== 'dark') preference = null

  function apply() {
    const theme = preference || (system.matches ? 'dark' : 'light')
    root.dataset.theme = theme
    root.style.colorScheme = theme
    const color = document.querySelector('meta[name="theme-color"]')
    if (color) color.content = theme === 'dark' ? '#0b1422' : '#ffffff'
    document.dispatchEvent(new Event('portfolio-theme-change'))
  }

  document.addEventListener('portfolio-theme-toggle', () => {
    preference = root.dataset.theme === 'dark' ? 'light' : 'dark'
    try { localStorage.setItem(key, preference) } catch { /* Keep the toggle usable without persistence. */ }
    apply()
  })
  system.addEventListener('change', () => { if (!preference) apply() })
  window.addEventListener('storage', (event) => {
    if (event.key !== key && event.key !== null) return
    preference = event.newValue === 'dark' || event.newValue === 'light' ? event.newValue : null
    apply()
  })
  apply()
})()
