// Muestra u oculta las seis tiendas nuevas en Proyectos (src/data/projects.ts).
// Uso:  node scripts/tiendas-nuevas.mjs off   → las quita
//       node scripts/tiendas-nuevas.mjs on    → las vuelve a poner
// Solo cambia el interruptor SHOW_NEW_STORES; no borra los datos.
import { readFileSync, writeFileSync } from 'node:fs';

const mode = process.argv[2];
if (!['on', 'off'].includes(mode)) {
  console.error('Uso: node scripts/tiendas-nuevas.mjs on|off');
  process.exit(1);
}
const file = new URL('../src/data/projects.ts', import.meta.url);
const src = readFileSync(file, 'utf8');
const re = /const SHOW_NEW_STORES = (true|false);/;
if (!re.test(src)) {
  console.error('No encontré SHOW_NEW_STORES en src/data/projects.ts');
  process.exit(1);
}
const value = mode === 'on';
const next = src.replace(re, `const SHOW_NEW_STORES = ${value};`);
if (next === src) {
  console.log(`Ya estaban ${value ? 'visibles' : 'ocultas'}: no hay nada que cambiar.`);
} else {
  writeFileSync(file, next);
  console.log(`Tiendas nuevas ${value ? 'visibles' : 'ocultas'} en Proyectos.`);
}
