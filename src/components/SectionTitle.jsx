// Encabezado de sección: número + etiqueta de código + título grande
export default function SectionTitle({ index, tag, title, highlight }) {
  return (
    <div className="mb-14" data-build={`<SectionTitle /> · ${tag}`} data-build-by="React">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
        {index} <span className="text-muted">//</span> {tag}
      </p>
      <h2 data-label={`<h2> · ${tag}`} className="selectable inline-block mt-3 font-display font-bold uppercase leading-[0.95] tracking-tight text-4xl sm:text-5xl lg:text-6xl">
        {title} <span className="text-accent neon">{highlight}</span>
      </h2>
      <div className="mt-5 flex items-center gap-2">
        <span className="h-px w-16 bg-accent" />
        <span className="size-1.5 bg-accent" />
        <span className="h-px w-6 bg-accent/40" />
      </div>
    </div>
  )
}
