import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import assert from 'node:assert/strict'
import { test } from 'node:test'

const script = readFileSync(new URL('../public/theme.js', import.meta.url), 'utf8')
function setup({ dark = false, stored = null, blocked = false } = {}) {
  const document = new EventTarget()
  document.documentElement = { dataset: {}, style: {} }
  const meta = { content: '' }
  document.querySelector = () => meta
  const system = new EventTarget()
  system.matches = dark
  const window = new EventTarget()
  window.matchMedia = () => system
  const storage = { value: stored }
  const localStorage = {
    getItem() { if (blocked) throw Error('Storage blocked'); return storage.value },
    setItem(key, value) { if (blocked) throw Error('Storage blocked'); storage.value = value },
  }
  runInNewContext(script, { document, window, localStorage, Event })
  return {
    root: document.documentElement, meta, storage,
    toggle() { document.dispatchEvent(new Event('portfolio-theme-toggle')) },
    system(dark) { system.matches = dark; system.dispatchEvent(new Event('change')) },
    remote(value) { const event = new Event('storage'); event.key = 'azeem-portfolio-theme'; event.newValue = value; window.dispatchEvent(event) },
  }
}

test('first visit follows the system and responds to changes', () => {
  const page = setup({ dark: true })
  assert.equal(page.root.dataset.theme, 'dark')
  assert.equal(page.root.style.colorScheme, 'dark')
  assert.equal(page.meta.content, '#0b1422')
  page.system(false)
  assert.equal(page.root.dataset.theme, 'light')
})
test('manual preference persists and overrides system changes', () => {
  const page = setup()
  page.toggle()
  assert.equal(page.root.dataset.theme, 'dark')
  assert.equal(page.storage.value, 'dark')
  page.system(false)
  assert.equal(page.root.dataset.theme, 'dark')
  assert.equal(setup({ stored: page.storage.value }).root.dataset.theme, 'dark')
  page.toggle()
  assert.equal(page.storage.value, 'light')
})
test('a saved light preference overrides a dark system', () => {
  assert.equal(setup({ dark: true, stored: 'light' }).root.dataset.theme, 'light')
})
test('invalid saved values fall back to the system', () => {
  assert.equal(setup({ dark: true, stored: 'invalid' }).root.dataset.theme, 'dark')
})
test('blocked storage does not break detection or the toggle', () => {
  const page = setup({ dark: true, blocked: true })
  page.toggle()
  assert.equal(page.root.dataset.theme, 'light')
})
test('other tabs synchronize; removing the preference restores automatic mode', () => {
  const page = setup({ dark: true })
  page.remote('light')
  assert.equal(page.root.dataset.theme, 'light')
  page.remote(null)
  assert.equal(page.root.dataset.theme, 'dark')
})
