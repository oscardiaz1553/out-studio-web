---
name: tiendas-nuevas
description: Quita o vuelve a poner las seis tiendas nuevas (Rugs N Home, Eticolor, Maison Caviar, The Black Box Snack, Osere y Daza Organic) en la página de Proyectos del sitio de Out. Úsalo cuando Oscar diga "Quita las tiendas nuevas de proyectos" (o algo equivalente: "oculta las tiendas nuevas") para quitarlas, o "Pon las tiendas nuevas en proyectos" para volver a mostrarlas.
---

# Tiendas nuevas en Proyectos

Las seis tiendas viven en `src/data/projects.ts` detrás del interruptor
`SHOW_NEW_STORES`. Quitarlas no borra nada: se pueden volver a poner.

## Quitar ("Quita las tiendas nuevas de proyectos")

1. `node scripts/tiendas-nuevas.mjs off`
2. `npm run seo:pages` (regenera `proyectos.html` y el resto de páginas estáticas).
3. Publica con el flujo de siempre:
   - `PRERENDER_CHROMIUM=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npm run build`
   - `git add -A` y commit con el mensaje "Proyectos: quita las tiendas nuevas" y las líneas de atribución que dé la sesión (nunca el identificador del modelo en el mensaje).
   - `git push -u origin desarrollo` (con reintentos si falla la red).
   - `git fetch origin main && git checkout main && git merge --ff-only desarrollo && git push origin main && git checkout desarrollo`
   - Espera a que `gh api repos/oscardiaz1553/out-studio-web/actions/runs?per_page=1` diga `completed success` para ese commit.
4. Confirma a Oscar en pocas líneas: ya no aparecen, siguen en el código y se vuelven a poner con "Pon las tiendas nuevas en proyectos".

Ojo: en Proyectos quedan solo BARCI y Diario Deportes, los proyectos propios de Out. Si Oscar pide quitar solo
algunas de las seis, no uses el interruptor: edita la lista `NEW_STORES` en `projects.ts`.

## Volver a poner ("Pon las tiendas nuevas en proyectos")

Igual, pero con `node scripts/tiendas-nuevas.mjs on` y el mensaje "Proyectos: vuelve a poner las tiendas nuevas".

## No hacer

- No borres `NEW_STORES` ni los dominios: sin ellos no se pueden volver a poner.
- No toques las láminas (`src/components/ProjectMedia.tsx`) ni los otros proyectos.
