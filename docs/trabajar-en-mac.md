# Trabajar en el Mac (dispositivo principal)

Todo el trabajo vive en el repositorio de GitHub (`oscardiaz1553/out-studio-web`, ramas `desarrollo` y `main`). Lo que no está en el repositorio se lista al final.

## 1. Herramientas (una vez)

```
# Homebrew (https://brew.sh) y luego:
brew install node git gh ffmpeg python@3.11
npm install -g @anthropic-ai/claude-code      # Claude Code (o el instalador oficial de claude.ai)
gh auth login                                  # entra a tu cuenta de GitHub
```

## 2. Traer el proyecto

```
cd ~/Documents            # o donde prefieras
gh repo clone oscardiaz1553/out-studio-web
cd out-studio-web
git checkout desarrollo
npm install
npx playwright install chromium
```

El historial pesa unos 650 MB (muchos videos e imágenes); la primera descarga tarda. Si hace falta más rápido: `git clone --filter=blob:none <url>`.

## 3. Comprobar que todo funciona

```
npm run dev            # sitio en http://localhost:5173
npm run build          # debe terminar sin errores
```

## 4. Instagram y Mango (solo cuando haga falta producir videos)

```
python3.11 -m venv ~/.venvs/out && source ~/.venvs/out/bin/activate
pip install numpy scipy opencv-python-headless "bpy==5.0.1"     # bpy es solo para algunos scripts de imágenes
```

- Los videos se graban con `instagram/mango2d/grabar.cjs`: `cd instagram/mango2d && PAGINA=reel-barci.html NODE_PATH=$(npm root -g) node grabar.cjs vacio.json ev-vacio.json cuadros 19.0 24` (con `echo '{"estados": []}' > vacio.json` y `echo '[]' > ev-vacio.json`). Receta de mezcla y comandos completos: `.claude/skills/reel-con-mango/references/pipeline.md`.
- Los scripts usan el Chromium de Playwright. Si quieres otro: `export CHROMIUM_PATH=/ruta/a/chromium`.
- El render con WebGL va por software: un reel de 20 s tarda unos minutos.

## 5. Empezar una sesión de Claude Code en el Mac

```
cd ~/Documents/out-studio-web
claude
```

Claude Code lee `CLAUDE.md` solo y tiene las skills de `.claude/skills/`. Una sesión nueva **no recuerda** la conversación de la nube: todo lo importante está en `CLAUDE.md`, `docs/`, `instagram/` y las skills. Primer mensaje sugerido: «Lee CLAUDE.md y dime qué está pendiente».

## 6. Lo que NO está en el repositorio

| Qué | Dónde vive | Qué hacer |
|---|---|---|
| Worker de formularios y cotizaciones | Cloudflare (copia del código en `worker/cotizaciones.js`) | Se despliega pegando el archivo; las claves (Resend y clave de envío) están en Cloudflare |
| Correo del dominio y DMARC | Google Workspace, Resend, DNS | Nada que migrar |
| Dominio y despliegue | GitHub Pages y tu proveedor de DNS | Nada que migrar |
| Voces de ElevenLabs | Tu cuenta (los mp3 usados sí están en `instagram/voces/`) | Pídelas de nuevo allá si cambias un guion |
| Hoja de exposición de Mango (editor) | Un artefacto de claude.ai | Se puede volver a publicar desde `instagram/mango2d/hoja/` |
| Conectores (Google Drive, Gmail, Figma, Higgsfield) | Tu cuenta de claude.ai | Actívalos en Claude Code si los quieres allá |
| Vistas previas de videos de pruebas | Solo la sesión de la nube | No hace falta: se regeneran desde el repositorio |
