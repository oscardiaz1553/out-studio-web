# Out. — Kit de identidad v1.0

> Documento portable del sistema de marca de **Out. Studio** (Oscar Díaz).
> Pensado para dárselo tal cual a un agente/IA o a un diseñador y que pueda
> aplicar la identidad en cualquier proyecto (p. ej. un portafolio personal).

---

## 1. Concepto

**Hook:** `Never the usual.`
**Idea madre:** *"Casi todo obedece. Una cosa se sale."*

El azul es **el sistema**: la retícula, el orden, lo que obedece.
El cálido (carne/naranja) es **la excepción**: lo único que se sale.
Toda pieza debe escenificar esa tensión: mucho orden azul y **un solo**
elemento cálido que rompe. Si hay dos excepciones, no hay excepción.

**Estética:** editorial tipo revista / brand manual impreso. Elementos a
sangre (full-bleed), láminas, cenefas, pull-quotes calados, numeración de
secciones (01, 02…), pie de foto pequeño.

## 2. Logo (dirección vigente desde el 9 oct 2026)

El logo es solo **«Out»**, sin «studio» y sin punto. La **O se parte por la
mitad y se vuelve un par de corchetes**, el símbolo más usado en desarrollo.

- **O** = el contenedor (partido: los corchetes). **u** = tú (*you*), adentro,
  protegida y en el centro. **t** = tecnología. Juntas, `(u)t`: *tecnología
  que te abraza*. Esta lectura es interna: no se escribe en pantalla.
- Un solo color (recoloreable con `currentColor`). Azul oficial: **klein
  `#1B2FCC`** (no `#2d469c`, que sólo quedó en los SVG originales).
- Piezas (en `docs/marca-nueva/logos/`):
  - `Logo out-03.svg` — «Out» completo. **Principal.** En código: `LogoOut`.
  - `Logo out-06.svg` — `(u)`, la O partida con la u adentro. Secundario/sello.
  - `Logo out-07.svg` — los corchetes `( )`. Favicon, marca de agua, marco.
  - `Logo out-08.svg` — la O partida en horizontal. Sólo para animar.
  - `Logo out-09.svg` — `ut`, sin la O. Sólo para animar (la O se salió).
- `( )` o `(u)` solos no se leen como «Out» para quien no conoce la marca:
  el logo completo (03) manda; el resto es secundario.
- **El elemento cálido ya no vive en el logo**: es la O misma cuando se sale
  (`#BC6039`) en la animación.
- Lockups de servicio: `Out.Web`, `Out.Design`, `Out.Motion`, `Out.Brand`,
  `Out.Social` (sin cambios).
- Mascota: el **mono aullador** caricaturesco con gafas (`public/mono-*.webp`;
  originales en `design-src/mono/`). Es el asistente «Mango».

## 2b. Símbolos y movimiento

- **Símbolos** (`docs/marca-nueva/simbolos/`, mismo trazo de 9.4 y corte plano
  que los corchetes del logo): `[ ]` `{ }` `< >` `</ >` `/ /` y el cursor `|`.
  En la web enmarcan los títulos de sección (`TitleFrame`) y el cursor `|`
  parpadea en el «escribiendo…» de Mango. Dentro de `<img>` no toman color:
  van inline o con `mask-image`.
- **Animación de apertura** (`public/intro/`, fuente en
  `docs/marca-nueva/fuente/animacion-logo/`): la O se parte en corchetes, cambia
  a `[ ]` `{ }` `< >` `</ >` `/ /` + cursor y la O vuelve. Se ve una vez por
  visita, con «Omitir», y no corre con «reducir movimiento».
- **Lenguaje de movimiento:** pulso de 0.6 s (100 BPM); cada golpe lleva anillo
  de impacto, temblor de cámara de 0.3 s, barrido circular de color y cambio de
  ángulo. Easings `expo.out`, `power4.out`, `power3.in`, `back.out(1.5–2)`.
  Tipografía cinética: cada letra entra desde abajo con rotación pequeña.
- Un solo elemento cálido por cuadro; ni negro ni blanco puros.

## 3. Paleta (exacta, no aproximar)

| Token | Hex | Rol |
|---|---|---|
| `--paper` | `#F3EDE7` | Fondo base (60%). Papel cálido |
| `--paper-pure` | `#FBF8F5` | "Blanco": cards, texto sobre azul |
| `--klein` | `#1B2FCC` | Azul Klein. El sistema (30%) |
| `--klein-deep` | `#141E5C` | Azul profundo: texto principal, scrims |
| `--klein-mid` | `#4A55C4` | Azul intermedio: subtítulos |
| `--klein-soft` | `#C8CDF0` | Azul claro: retículas, detalles sobre Klein |
| `--carne` | `#F5E3B3` | Crema: acento claro sobre azul. **Ya no es rosado** (se retiró el `#F2C6B4` de toda la web) |
| `--carne-deep` | `#BC6039` | Cálido medio: el punto sobre claro |
| `--carne-tinta` | `#9C3F1C` | Cálido oscuro: eyebrows, links hover |
| `--ink-2` | `#3C4375` | Texto de cuerpo |
| `--muted` | `#585D88` | Texto secundario |

**Reglas duras:**
- ❌ **Nunca negro puro** (`#000`) ni **blanco puro** (`#FFF`).
- Proporción **60/30/10**: papel / azul / cálido.
- `::selection` → fondo `--carne`, texto `--klein-deep`.
- Focus visible: outline 3px `--carne-tinta`.

## 4. Tipografía (solo DOS familias)

| Uso | Familia | Pesos | Notas |
|---|---|---|---|
| Display (títulos, wordmark) | **Bricolage Grotesque** (variable) | 600–800 | tracking negativo −0.02 a −0.05em, line-height ≤ 1.02 |
| Cuerpo y rótulos | **Instrument Sans** | 400, 500 | line-height 1.5 |

- Paquetes npm: `@fontsource-variable/bricolage-grotesque`,
  `@fontsource/instrument-sans` (400.css y 500.css).
- ❌ No usar una tercera tipografía (se eliminó DM Mono deliberadamente).
- ❌ **Nada de texto en mayúsculas forzadas** (`uppercase` prohibido).
  Todo en sentence case.
- ❌ Nada de etiquetas tipo "Fig. 01 —" visibles.
- Títulos gigantes con `clamp()`, p. ej. hero: `clamp(4rem, 13vw, 12rem)`.

## 5. Voz y copy

- Idioma: español, directo, sin humo. Frases cortas.
- Hook en inglés: **"Never the usual."** (así, exacto)
- Concepto en español: **"Casi todo obedece. Una cosa se sale."**
- En pull-quotes se parte en dos líneas y la segunda va en cálido:
  `Casi todo obedece.` (blanco/paper-pure) + `Una se sale.` (carne)
- CTAs en sentence case: "Hablemos", "Enviar mensaje", "Ver proyecto".

## 6. Recursos gráficos (URLs públicas, listas para usar)

Base: `https://oscardiaz1553.github.io/out-studio-web/`

| Archivo | URL | Qué es / cómo usarlo |
|---|---|---|
| `botanica.png` | …/botanica.png | Lámina botánica vintage (peonías azules + mangos). Pieza única: full-bleed con parallax suave y quote calado. 3.4MB |
| `mangos_out.png` | …/mangos_out.png | Patrón de mangos sobre crema. Segunda lámina. 2MB |
| `mango_out_patrones.png` | …/mango_out_patrones.png | Azulejo portugués (mangos + ornamentos cobalto). NO es tileable tal cual. 3MB |
| `azulejo.webp` | …/azulejo.webp | El azulejo optimizado (344KB) para rellenos/`background-clip: text` |
| `azulejo-band.webp` | …/azulejo-band.webp | Banda espejada [original\|reflejo] que **sí** repite sin costuras en X (248KB). Para cenefas/frisos |
| `Out_video.mp4` | …/Out_video.mp4 | Video botánico 6s (fuente de la secuencia de scrubbing) |
| `out-seq/f_0001.webp` … `f_0119.webp` | …/out-seq/f_XXXX.webp | 119 fotogramas del video para scroll-scrubbing en canvas |

**Reglas de uso de imagen:**
- Las láminas ilustradas (botanica, mangos) funcionan como *piezas únicas*
  a sangre. Los patrones (azulejo) funcionan **pequeños y sistemáticos**:
  cenefas, lomos, tinta de texto, detalles — nunca full-bleed (a pantalla
  completa un patrón lee como mantel, no como lámina).
- Para repetir el azulejo en horizontal usar `azulejo-band.webp`
  (espejado = sin costuras). El PNG original corta motivos en los bordes.

## 7. Tokens listos para copiar

### CSS variables
```css
:root {
  --klein: #1b2fcc;
  --klein-deep: #141e5c;
  --klein-soft: #c8cdf0;
  --klein-mid: #4a55c4;
  --carne: #f2c6b4;
  --carne-deep: #bc6039;
  --carne-tinta: #9c3f1c;
  --paper: #f3ede7;
  --paper-pure: #fbf8f5;
  --ink-2: #3c4375;
  --muted: #585d88;
  --display: 'Bricolage Grotesque Variable', sans-serif;
  --body: 'Instrument Sans', sans-serif;
}
::selection { background: var(--carne); color: var(--klein-deep); }
:focus-visible { outline: 3px solid var(--carne-tinta); outline-offset: 2px; }
```

### Tailwind (theme.extend)
```js
colors: {
  klein: '#1B2FCC', 'klein-deep': '#141E5C', 'klein-soft': '#C8CDF0',
  'klein-mid': '#4A55C4', carne: '#F2C6B4', 'carne-deep': '#BC6039',
  'carne-tinta': '#9C3F1C', paper: '#F3EDE7', 'paper-pure': '#FBF8F5',
  'ink-2': '#3C4375', muted: '#585D88',
},
fontFamily: {
  display: ['Bricolage Grotesque Variable', 'sans-serif'],
  sans: ['Instrument Sans', 'sans-serif'],
}
```

### El punto de marca (React)
```jsx
// El punto: siempre cálido, nunca del color de la palabra.
// #BC6039 sobre claro, #F2C6B4 sobre azul. 0.16em, redondo.
<span style={{
  display: 'inline-block', borderRadius: '50%',
  width: '0.16em', height: '0.16em', backgroundColor: '#BC6039',
}} />
```

## 8. Motion (si aplica)

- Sutil y con propósito; todo gated con `prefers-reduced-motion`.
- Easing preferido: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out expo suave).
- Recursos ya construidos en este repo (copiables):
  - Scroll-scrubbing con secuencia de frames en canvas
    (`src/sections/ScrollVideoSection.tsx`)
  - Lámina editorial con parallax suave (`src/components/EditorialPlate.tsx`)
  - Marquee infinito lento y friso de azulejos transform-only
    (`src/sections/marquee.css`, `src/sections/footer.css`)
- Regla de ritmo: máximo un protagonista de scroll por vista; los loops
  decorativos van MUY lentos (60–120s).

## 9. Contacto / datos de la marca

- Estudio: **Out.** (Out. Studio) — estudio digital, Bogotá · São Paulo
- Detrás: **Oscar Díaz** — UX/UI Specialist y Desarrollador WordPress y
  Shopify. Potenciamos tu idea con inteligencia artificial.
- Email: oscar.diaz@out-studio.net · Tel: +57 300 565 8674
- Web: https://oscardiaz1553.github.io/out-studio-web/
