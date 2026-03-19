# casa-boreal

Landing page para Casa Boreal Wellness Center (Barre, Pilates y Yoga).

## Ejecutar local

Abre `index.html` directamente en tu navegador o usa un servidor simple:

```bash
python3 -m http.server 5500
```

Luego abre `http://localhost:5500`.

## Estructura

- `index.html`: contenido y secciones de la landing.
- `styles.css`: estilo visual y responsive.
- `script.js`: menú móvil y animaciones al hacer scroll.

## Deploy en Vercel

El repo ya incluye `vercel.json` para servir el sitio estático con cabeceras base.

1. Inicia sesión en Vercel desde la CLI:

```bash
npx vercel login
```

2. Desde la carpeta del proyecto, enlaza y despliega:

```bash
cd /workspaces/casa-boreal
npx vercel
npx vercel --prod
```

3. Si prefieres token (CI/CD o entorno sin login interactivo):

```bash
npx vercel --token TU_TOKEN
npx vercel --prod --token TU_TOKEN
```

Nota: si recibes el error "The specified token is not valid", genera un token nuevo en Vercel Dashboard y reemplázalo.

## Traer archivos desde otro repositorio

Si ya tienes una landing en `tarjetas-puebla`, puedes traerla a este repo de dos formas.

### Opción 1: copiar archivos puntuales (recomendada)

1. Clona el otro repo en una carpeta temporal:

```bash
git clone https://github.com/JoseDario680/tarjetas-puebla /tmp/tarjetas-puebla
```

2. Copia solo los archivos que necesitas:

```bash
cp -r /tmp/tarjetas-puebla/* /workspaces/casa-boreal/
```

3. Revisa, commit y push:

```bash
cd /workspaces/casa-boreal
git add .
git commit -m "Importar landing desde tarjetas-puebla"
git push
```

### Opción 2: traer archivos con git checkout desde remote

1. Agrega el repo externo como remoto:

```bash
cd /workspaces/casa-boreal
git remote add tarjetas-puebla https://github.com/JoseDario680/tarjetas-puebla
git fetch tarjetas-puebla
```

2. Trae archivos específicos del branch principal del otro repo:

```bash
git checkout tarjetas-puebla/main -- index.html styles.css script.js
```

3. Commit y push:

```bash
git add index.html styles.css script.js
git commit -m "Traer landing desde tarjetas-puebla"
git push
```