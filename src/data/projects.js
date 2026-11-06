import { FaBrain } from 'react-icons/fa'

// ===== Tus proyectos =====
// Los textos van en los dos idiomas: { es: '...', en: '...' }
// image: pon una captura en src/assets/proyectos/ e impórtala, ej:
//   import amantiaImg from '../assets/proyectos/amantia.png'
//   ...  image: amantiaImg,
// Si image es null, se muestra una portada generada.
// repo / demo: enlaces opcionales (null = no se muestra el botón).

export const categories = [
  { id: 'Todos', label: { es: 'Todos', en: 'All' } },
  { id: 'Web', label: 'Web' },
  { id: 'IA', label: { es: 'IA', en: 'AI' } },
  { id: 'Escritorio', label: { es: 'Escritorio', en: 'Desktop' } },
]

// Tarjeta de "próximo proyecto". Pon null para quitarla.
export const upcoming = {
  title: { es: 'Próximo proyecto', en: 'Next project' },
  text: {
    es: 'Estoy construyendo proyectos que resuelvan problemas reales de las personas. Muy pronto aparecerán aquí.',
    en: "I'm building projects that solve real problems for people. They'll show up here very soon.",
  },
}

export const projects = [
  {
    id: 'amantia',
    featured: true,
    code: 'PRJ_01',
    title: 'AmantIA',
    subtitle: { es: 'Plataforma de IA para la investigación amazónica', en: 'AI platform for Amazon research' },
    category: ['Web', 'IA'],
    Icon: FaBrain,
    image: null,
    org: { es: 'IIAP · Prácticas', en: 'IIAP · Internship' },
    status: { es: 'En producción', en: 'In production' },
    summary: {
      es: 'Sistema web en producción que permite a investigadores ejecutar modelos de inteligencia artificial (bioacústica, detección de aguajales y más) y consultar sus resultados desde el navegador. Mi trabajo es actualizarlo y completarlo.',
      en: 'A web system in production that lets researchers run artificial intelligence models (bioacoustics, aguaje palm detection and more) and review the results in the browser. My job is to update and complete it.',
    },
    highlights: {
      es: [
        'Encontré y corregí errores en los tres componentes: backend en Laravel, frontend en React y el servicio de IA en FastAPI',
        'Rediseñé el flujo para que todas las peticiones pasen por el backend, haciendo el sistema más simple y seguro',
        'Preparo la migración de frontend, backend y base de datos al servidor del instituto, probada antes en máquinas virtuales Linux',
        'Mejoré el frontend: catálogo de modelos, ejemplos de resultados por modelo y rutas',
        'Documento el proceso en un manual de migración para el equipo',
      ],
      en: [
        'Found and fixed bugs across all three components: the Laravel backend, the React frontend and the FastAPI AI service',
        'Redesigned the flow so every request goes through the backend, making the system simpler and more secure',
        "Preparing the migration of frontend, backend and database to the institute's server, tested first on Linux virtual machines",
        'Improved the frontend: model catalog, per-model example results and routing',
        'Documenting the process in a migration manual for the team',
      ],
    },
    stack: ['Laravel', 'PHP', 'PostgreSQL', 'React', 'Tailwind', 'JWT', 'FastAPI', 'Linux'],
    repo: null, // repositorio privado
    demo: null,
    private: true,
  },
]

// ===== Tus certificados =====
// Agrega uno por cada certificado o curso. Ejemplo:
// { title: { es: 'Nombre del curso', en: 'Course name' }, issuer: 'Institución', date: '2026', url: 'https://...' },
export const certificates = []
