# 🚀 Plan SEO Completo — Prod. Mvxii

> Documento de acción. Acompaña a [`SEO-KEYWORDS.md`](./SEO-KEYWORDS.md) (investigación de keywords).
> Estado base auditado: 2026-06-29. Dominio **EN VIVO**: https://prodmvxii.com (Cloudflare Pages / OpenNext).

---

## ✅ IMPLEMENTADO (Fase 0 + Fase 1 + GEO base)

Hecho en código y verificado con `next build` + inspección del HTML pre-renderizado:

- **`src/lib/seo.ts`** — config central: URL canónica, identidad del negocio, sets de keywords, builders de JSON-LD, taxonomía de géneros.
- **`metadataBase` + canonical por página** (`/`, `/beats`, `/terminos`) + título/description transaccionales + **keywords ampliadas** (de 6 → ~35) + OG con `locale es_CL` + **Twitter `summary_large_image`** + `robots: index,follow,max-image-preview:large`.
- **`robots.ts`** → `/robots.txt` que **permite explícitamente crawlers de IA** (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot…) + `Host` + `Sitemap`. **(GEO)**
- **`sitemap.ts`** → `/sitemap.xml` con las 3 rutas vivas.
- **`manifest.ts`** → PWA (`/manifest.webmanifest`).
- **`opengraph-image.tsx`** → imagen social 1200×630 generada con `next/og` (antes los shares salían sin preview).
- **JSON-LD** (en HTML, server-rendered): `MusicGroup` (entidad del productor) + `WebSite` global; `Product`+`AggregateOffer` (licencias) + `FAQPage` en el home.
- **`FaqSection.tsx`** → FAQ visible (`<details>`, sin JS) **renderizada eager** para que esté en el HTML → rich results + citación por IA. Cubre intención de compra, licencias, geo (Chile/Latam) y type beats de artistas.
- **Hero** → subtítulo keyword-rich en el DOM (TRAP · REGGAETÓN · DRILL · AFROBEAT + copy descriptivo).

> ⚠️ **Hallazgo nuevo:** `LazySection` hace `{visible ? children : null}` con `visible=false` inicial → **todo el contenido below-fold (Licencias, redes, Footer) NO está en el HTML inicial**, es invisible para crawlers sin JS. El FAQ se sacó de ese patrón; el resto debería migrarse (ver Fase 2).

### ✅ Ronda 2 — pulido empresarial + Analytics

- **Contenido crawlable:** se sacó **Licencias** y **Footer** del `LazySection` → ahora su texto, precios e **internal links** van en el HTML server-rendered (antes invisibles). El FAQ ya estaba eager.
- **Breadcrumbs** (`BreadcrumbList` JSON-LD) en `/beats` y `/terminos`.
- **`ContactPoint`** añadido al `MusicGroup` (WhatsApp, email, idiomas es/en, área servida).
- **Alt text con keywords** en el logo (Navigation + Footer).
- **Google Analytics 4** cableado: `src/components/GoogleAnalytics.tsx` (carga diferida + tracking de navegación SPA por ruta), montado en `layout.tsx`, **gated por `NEXT_PUBLIC_GA_ID`** (no-op si no está). CSP de `public/_headers` actualizada para permitir `googletagmanager.com` + `google-analytics.com`.

### 🟢 CONECTAR GA (pasos finales, requiere tu Measurement ID `G-XXXXXXXXXX`)

1. Crea/abre la propiedad **GA4** en analytics.google.com → Admin → Flujos de datos → Web (`https://prodmvxii.com`) → copia el **Measurement ID** (`G-XXXXXXXXXX`).
2. Añádelo como variable de entorno **`NEXT_PUBLIC_GA_ID`**:
   - **Local:** en `.env.local` → `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
   - **Cloudflare Pages:** Settings → Environment variables → `NEXT_PUBLIC_GA_ID` (Production + Preview) → redeploy.
3. (Recomendado) Enlaza GA4 con **Google Search Console** para cruzar queries orgánicas con comportamiento.

### 🚀 DESPLEGADO — v1 empresarial en vivo (2026-06-30)

Desplegado a Cloudflare (worker `prodmvxi`) y verificado en vivo: todas las rutas 200, GA activo (`G-LH197LBY45`), JSON-LD (MusicGroup/FAQPage/AggregateOffer), canonical, OG image, FAQ y Footer en el HTML, y `/robots.txt` + `/sitemap.xml` sirviéndose.

> ⚠️ **Lecciones de build (CRÍTICAS para futuros deploys):**
> 1. El build **DEBE usar webpack**, no Turbopack (`"build": "next build --webpack"`). Turbopack genera chunks de servidor que OpenNext/Workers no puede cargar → `ChunkLoadError` y **500 en todo el sitio**.
> 2. **No usar `runtime = "edge"`** en route handlers — OpenNext no lo soporta inline (rompe el build). Usa el runtime nodejs por defecto.
> 3. **No usar `next/og`** (opengraph-image dinámica) — su wasm no bundlea bajo OpenNext en Windows. La OG image es estática (el logo).
> 4. Tras cada `npm run deploy`, **verifica en vivo** (curl). Si algo falla: `npx wrangler rollback <version-id-anterior>`.

### 🔴 ACCIONES MANUALES PENDIENTES

1. ✅ **robots.txt** — RESUELTO: el worker sirve nuestro `/robots.txt` (tiene precedencia sobre el de Cloudflare). No requiere acción.
2. **Bloqueo de bots de IA (Cloudflare):** revisa el dashboard → dominio `prodmvxii.com` → **AI Crawl Control** (antes "AI Audit") o **Security → Bots**. Si "Block AI Scrapers and Crawlers" está activo, **bloquea el GEO** a nivel de red (independiente del robots.txt). Para aparecer en ChatGPT/Perplexity/Google AI, **permite** los bots de *AI search / RAG*.
3. **Google Search Console:** verifica `prodmvxii.com` y sube `https://prodmvxii.com/sitemap.xml`. Pega el token en `verification.google` de `layout.tsx`.
4. **Bing Webmaster Tools:** igual que GSC (alimenta también a ChatGPT/Copilot).
5. **GA Realtime:** abre GA4 → Informes → Tiempo real y navega el sitio para confirmar que llegan eventos.
6. **🔐 SEGURIDAD:** el remote de git tiene un **token de GitHub (PAT) embebido en la URL** — rótalo en GitHub → Settings → Developer settings → Tokens, y reconfigura el remote con `git remote set-url`.

---

## 📊 Resumen del estado actual (auditoría)

**Lo que YA está bien:**
- `<html lang="es">` correcto.
- Jerarquía de headings semántica (h1/h2/h3/h4 reales, no divs).
- Metadata por página en `/beats` y `/terminos`.
- `aria-label`s en botones de reproductor y redes.
- Taxonomía riquísima ya construida: **9 géneros, 9 estilos, 21 artistas type-beat, rangos de BPM** (derivada de los 330 beats reales de BeatStars).

**Los 6 huecos críticos (en orden de impacto):**

| # | Problema | Impacto | Esfuerzo |
|---|---|---|---|
| 1 | **Beats renderizados client-side** (`useEffect` + `fetch`). El catálogo, géneros, artistas y BPM **no están en el HTML**. Google ve secciones vacías. No hay páginas por beat ni por artista. | 🔴 CRÍTICO | Alto |
| 2 | **Sin sitemap, robots, favicon, manifest, OG image, JSON-LD** | 🔴 Alto | Bajo |
| 3 | **`<h1>` del home = "PROD. MVXII"** (solo marca, 0 keywords). Sin `metadataBase`, canonical ni Twitter card. OG sin imagen. | 🟠 Medio-Alto | Bajo |
| 4 | **Keywords pobres** en metadata (solo 6 términos) y home sin metadata propia | 🟠 Medio | Bajo |
| 5 | **Alt text genérico** ("Prod. Mvxii" en logo; artwork solo con nombre) | 🟡 Medio | Bajo |
| 6 | `<img>` crudo en BeatCard/AudioPlayer en vez de `next/image` (afecta LCP→SEO) | 🟡 Bajo | Medio |

---

## FASE 0 — Quick wins técnicos (1-2 h, hacer YA tras fijar dominio)

> Requieren saber el dominio final. Placeholder: `https://prodmvxii.com`.

- [ ] **`metadataBase`** en `layout.tsx` → `new URL("https://DOMINIO")`. Sin esto, OG y canonical no resuelven URLs absolutas.
- [ ] **`src/app/robots.ts`** → permitir todo + apuntar al sitemap. Bloquear `/setup`.
- [ ] **`src/app/sitemap.ts`** → rutas `/`, `/beats`, `/terminos` + (futuro) páginas de género y artista generadas dinámicamente desde la API de beats.
- [ ] **Favicon + icons** → `src/app/icon.png`, `apple-icon.png` (derivar de `Logo_Maxi.jpeg`). `favicon.ico` en `app/`.
- [ ] **OG image** → `src/app/opengraph-image.tsx` (generada con `next/og`, marca + "Beats Profesionales") o estática 1200×630. Hoy los shares salen sin preview.
- [ ] **`manifest.ts`** (PWA) → nombre, theme color `#8B5CF6`, bg `#050508`, icons.
- [ ] **Twitter card** en metadata → `card: "summary_large_image"`, title, description, images.
- [ ] **JSON-LD estructurado** (lo más rentable del nicho):
  - `MusicGroup` / `Person` (el productor Maxi) en el home.
  - `Product` + `Offer` por cada tier de licencia (Basic $21.99 / Standard $32.99 / Premium $49.99 / Exclusiva).
  - `BreadcrumbList` en `/beats` y `/terminos`.
  - `WebSite` + `SearchAction` (sitelinks searchbox).
- [ ] **Google Search Console** → verificar dominio (meta tag o DNS) y subir sitemap.

---

## FASE 1 — On-page & keywords (2-3 h)

Mapea las keywords de `SEO-KEYWORDS.md` al contenido real.

- [ ] **Reescribir `<title>` y `description`** del home con intención transaccional + género + región:
  - Title sugerido: `Comprar Beats Online | Trap, Reggaetón, Drill — Prod. Mvxii`
  - Desc: incluir "instrumentales", "type beat", "licencias", "Chile/Latam".
- [ ] **Enriquecer `keywords`** (de 6 → set completo del nicho: comprar beats, instrumentales trap, bases de rap, pistas reggaeton, type beat, licencia exclusiva, beats sin tag…).
- [ ] **Aprovechar el `<h1>` del home**: hoy es solo "PROD. MVXII". Añadir un subtítulo keyword-rich **en el DOM** (no solo CSS), ej. cambiar el subtítulo actual "BEATS EXCLUSIVOS | CALIDAD PROFESIONAL" por algo como `Beats e instrumentales de Trap, Reggaetón y Drill — listos para grabar`. Mantener el branding visual, sumar las keywords reales.
- [ ] **`metadata` propia para el home** (`page.tsx` no exporta ninguna; hoy hereda solo el layout).
- [ ] **Alt text con keywords**:
  - Logo → `Prod. Mvxii — productor de beats e instrumentales`
  - Artwork de beat → `{name} — beat de {genre} | type beat {artista}` cuando aplique.
- [ ] **Copy de secciones**: inyectar términos del nicho en subtítulos de BeatGrid, Licencias y Contacto (ya hay buena base: "type beat", "BPM", "Old School", "Perreo").

---

## FASE 2 — Contenido indexable (la palanca grande) 🔴

El problema #1. La data existe (330 beats, 21 artistas, 9 géneros) pero **no se indexa**.

- [ ] **SSR / Server Component para el catálogo**: renderizar los beats (o al menos un bloque inicial) en el HTML del servidor para que el crawler vea nombres, géneros, BPM y artistas. Hoy todo es `fetch` en `useEffect`.
- [ ] **Páginas de aterrizaje por GÉNERO** → `/beats/genero/[trap|reggaeton|drill|afrobeat|...]`
  - Cada una: H1 keyword ("Beats de Trap | Instrumentales de Trap"), copy 150-300 palabras, lista de beats del género, JSON-LD `CollectionPage`.
  - Ataca directamente: *comprar beats de trap*, *instrumental de drill*, etc.
- [ ] **Páginas "type beat" por ARTISTA** → `/beats/type-beat/[cris-mj|kidd-voodoo|floyymenor|...]`
  - Oro puro: los 21 artistas ya están en la taxonomía. Cada página rankea para `[artista] type beat` (la búsqueda real del nicho).
  - H1: `{Artista} Type Beat — Instrumentales estilo {Artista}`.
- [ ] **Páginas por BEAT individual** → `/beats/[slug]` con JSON-LD `MusicRecording` + `Product`/`Offer`. Permite rankear por nombre de beat y mostrar rich snippets de precio.
- [ ] **Generar estas rutas en el `sitemap.ts`** dinámicamente desde la API.
- [ ] **(Opcional) Blog `/blog`** para keywords informacionales (qué es un type beat, licencias exclusiva vs no exclusiva, cómo comprar beats) → autoridad temática.

---

## FASE 3 — Off-page & continuo

- [ ] **Consistencia NAP/marca** entre el sitio, BeatStars, YouTube, Instagram, TikTok, Spotify (mismo handle @prodmvxii ya alineado ✅).
- [ ] **YouTube como motor SEO**: cada beat subido con title fórmula `[Artista] x [Artista] Type Beat — "Mood" | 2026 [Subgénero] [BPM]` y 20-30 tags buyer-intent (ver `SEO-KEYWORDS.md` §3). Enlazar de vuelta al sitio.
- [ ] **Google Business / perfiles** y enlaces desde bio de redes al dominio.
- [ ] **Core Web Vitals**: migrar `<img>` crudos a `next/image`; ya hay buen lazy-loading y code-splitting.
- [ ] **Medición**: GSC + (opcional) analytics. Revisar queries reales a las 4-6 semanas y doblar apuesta en los subgéneros breakout (pluggnb, brazilian phonk, corridos tumbados, afro house).

---

## ⚡ Orden recomendado de ejecución

1. **Fija el dominio** → me das la URL.
2. **Fase 0** completa (1-2 h) — base técnica, indexabilidad, rich snippets.
3. **Fase 1** (2-3 h) — keywords on-page, el quick win de mayor ROI inmediato.
4. **Fase 2** por etapas — primero SSR del catálogo, luego páginas de artista (mayor demanda), luego género y beat individual.
5. **Fase 3** en paralelo y continuo.

> Las Fases 0 y 1 las puedo implementar apenas confirmes el dominio. La Fase 2 es un proyecto mayor que conviene dividir en PRs.
