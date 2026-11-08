# Azeem Maqbool — portfolio

A single-page React + TypeScript portfolio built on the existing Vite project. No new JavaScript dependencies. Native system fonts, locally stored project photographs, CSS motion, native expandable experience and services, and an interactive 3G/LTE/5G illustration.

## Run

```sh
npm install
npm run dev
# Open http://localhost:5173/azeem-portfolio/
```

## Check and build

```sh
npm run lint
npm run build
npm run preview
```

Deploy the generated `dist/` directory to any static host. No API keys, backend, or form service is needed. Contact links open the visitor's email or telephone app.

## Update content

- `src/data/profile.json`: all nine roles, project names, services, qualifications, equipment and contact details.
- `src/App.tsx`: editorial introduction, featured airport project and page structure.
- `src/App.css` / `src/index.css`: responsive layouts, tokens, typography and motion.
- `public/Azeem-Maqbool-Resume.pdf`: the downloadable two-page résumé.

The work history follows the LinkedIn text supplied by the owner. Project achievements, technical skills, certifications and contact details use the supplied résumé. The owner explicitly chose LinkedIn dates where the sources disagree. The résumé's conflicting career-break entry and the older public Bayt chronology are not included. No current employer after July 2025, invented portfolio work, or GitHub profile is claimed.

The four service descriptions are proposed wording based on documented experience. The header uses the portrait supplied by the owner, cropped with CSS.

## Regenerate the PDF

The generator uses the same profile data as React and includes content, page-count and link assertions. Its two-page layout is tailored to the present content; the overflow assertions stop generation if longer content no longer fits.

```sh
python3 -m pip install reportlab pypdf
python3 scripts/build_resume.py
```

Python is needed only when regenerating the PDF, not to run or build the website. After editing contact details, check both the site and the regenerated PDF. The PDF uses built-in Helvetica fonts; no font downloads are required.

## Assets and credits

All images are editorial views of project locations, not Azeem's own photographs. Photography credit links are also available in the website footer.

- Zayed International Airport Terminal A images [01](https://commons.wikimedia.org/wiki/File:Abu_Dhabi_(UAE),_Zayed_International_Airport,_Terminal_A_(01).jpg), [02](https://commons.wikimedia.org/wiki/File:Abu_Dhabi_(UAE),_Zayed_International_Airport,_Terminal_A_(02).jpg), [04](https://commons.wikimedia.org/wiki/File:Abu_Dhabi_(UAE),_Zayed_International_Airport,_Terminal_A_(04).jpg): Vincent van Zeijst, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), Wikimedia Commons. Display crops; photographs and their adaptations retain the same licence.

## Verification

Production compilation and ESLint pass. Browser checks cover desktop (1440px), tablet (768px) and mobile (390px): horizontal overflow, system typography and loaded images, all nine roles, service and experience expansion, technology selection, mobile menu navigation, Escape dismissal and an actual PDF download. Both PDF pages were rendered and visually checked. CSS includes a reduced-motion override; an OS-level reduced-motion session and Safari were not tested.

## GitHub Pages

Public repository: https://github.com/azeemmaq/azeem-portfolio

Live website: https://azeemmaq.github.io/azeem-portfolio/

Pushes to `main` run `.github/workflows/deploy.yml`: install from the lockfile, lint, build and deploy to GitHub Pages. The Vite base path is `/azeem-portfolio/`. The generated PDF is committed, so GitHub’s runner does not require Python.

The current design uses a white and pale-blue foundation, vivid blue actions and native system sans-serif typography. Melbourne is a prominent text location; the hero includes a conceptual telecom network illustration with motion and reduced-motion support.

The hero is an interactive conceptual network scene: select airport, healthcare, retail or hospitality sites to explore documented projects. Animated signal packets and coverage rings continue while the scene is visible. Reduced-motion handling and automatic suspension off screen or in a hidden tab avoid unnecessary motion; no pause/play button is shown. The prominent navigation résumé button downloads the same PDF as the existing links.

## Theme

The site follows `prefers-color-scheme` on first visit and responds to system changes until a manual choice is made. The persistent sun/moon header button overrides that preference; the choice is saved locally and synchronized across tabs. Theme initialization runs before page rendering to avoid a flash of the wrong theme, with a storage fallback for restricted browsers.

Run theme behavior checks with `node --test scripts/theme.test.mjs`. The downloadable résumé keeps its print-friendly white background.
