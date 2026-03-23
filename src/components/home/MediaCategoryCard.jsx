export default function MediaCategoryCard({ icon: Icon, title, description, count, delayClass }) {
    return (
        <article className={`group relative rounded-xl bg-card/60 p-6 backdrop-blur-sm card-neon-border ${delayClass}`}>
            <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-foreground">{title}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{description}</p>
                <span className="text-xs font-mono text-primary/70">{count}</span>
            </div>
        </article>
    );
}