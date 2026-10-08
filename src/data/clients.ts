// Marcas que confían en Out. Se alimenta de los proyectos reales; para mostrar
// un logo en vez del nombre, agrega el archivo en public/clients/ (por
// ejemplo public/clients/barci.svg) y pon su ruta en `logo`.
import { PROJECTS } from './projects';

export interface Client {
  name: string;
  /** Ruta del logo (opcional). Si falta, se muestra el nombre en tipografía. */
  logo?: string;
}

const LOGOS: Record<string, string | undefined> = {
  // BARCI: `${import.meta.env.BASE_URL}clients/barci.svg`,
};

export const CLIENTS: Client[] = PROJECTS.map((p) => ({
  name: p.name,
  logo: LOGOS[p.name],
}));
