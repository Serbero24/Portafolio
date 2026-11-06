# Portafolio — Sheridan Manuyama (Dev Skinny)

React + Vite + Tailwind CSS v4.

## Cómo correrlo
```bash
npm install
npm run dev
```
> Si agregas archivos nuevos mientras `npm run dev` está corriendo, reinícialo (Ctrl+C y otra vez `npm run dev`).

## Qué editar
| Qué | Dónde |
|---|---|
| Correo, GitHub, LinkedIn, ubicación, Formspree | `src/data/site.js` |
| Proyectos y certificados | `src/data/projects.js` |
| Textos de Sobre mí, trayectoria y habilidades | inicio de `src/components/About.jsx` |
| Frase del hero y roles que se escriben solos | `src/components/Hero.jsx` |
| Tu foto | `src/assets/foto.jpg` (y cambia el import en `Hero.jsx`) |
| Tu CV | `public/cv.pdf` |
| Color de acento | `--color-accent` en `src/index.css` |

## Idioma (ES / EN)
Todos los textos están en los dos idiomas con el formato `{ es: '...', en: '...' }`.
Si agregas un texto nuevo en un componente, usa `const t = useT()` y escribe `t({ es: 'Hola', en: 'Hello' })`.
El idioma elegido se recuerda en el navegador del visitante.

## Atajos de teclado
- **Ctrl + K** (⌘K en Mac): paleta de comandos para ir a cualquier sección, copiar el correo, cambiar de idioma, etc.
- **B**: modo plano. Muestra los recuadros, nombres y medidas de todos los bloques.
- **Esc**: salta la construcción inicial de la página.

## Formulario de contacto
1. Crea una cuenta gratis en https://formspree.io y un formulario nuevo.
2. Copia su ID y pégalo en `formspreeId` dentro de `src/data/site.js`.
3. Los mensajes te llegarán al correo con el que te registraste.

Si `formspreeId` está vacío, el botón abre el programa de correo del visitante con el mensaje ya escrito.

## Estructura
- `components/Starfield.jsx` — fondo de estrellas, cuadrícula y luz del mouse
- `components/Navbar.jsx` — menú flotante
- `components/Hero.jsx` + `SocialDock.jsx` — portada y redes con efecto dock
- `components/About.jsx` — tarjetas, trayectoria y stack
- `components/Projects.jsx` — pestañas, filtros, tarjetas y ventana de detalle
- `components/Contact.jsx` — formulario y redes
- `components/Footer.jsx` — pie de página
- `components/Reveal.jsx`, `SectionTitle.jsx` — piezas reutilizables
