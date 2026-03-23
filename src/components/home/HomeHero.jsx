import Link from 'next/link';
import { ChevronRight, Rocket } from 'lucide-react';

export default function HomeHero({
    badge,
    titlePrefix,
    titleHighlight,
    description,
    launchLabel,
    exploreLabel,
}) {
    return (
        <section className="mb-16 text-center max-w-3xl mx-auto">
            <div className="animate-slide-up flex items-center justify-center gap-2 mb-6">
                <Rocket className="h-5 w-5 text-primary animate-float" />
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-primary/80">
                    {badge}
                </span>
            </div>

            <h1 className="animate-slide-up-delay-1 mb-6 text-5xl font-bold tracking-tight text-foreground md:text-7xl">
                {titlePrefix} <span className="text-primary text-glow">{titleHighlight}</span>
            </h1>

            <p className="animate-slide-up-delay-2 mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                {description}
            </p>

            <div className="animate-slide-up-delay-3 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                    href="/about"
                    className="glow-button inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground"
                >
                    {launchLabel}
                    <ChevronRight className="h-4 w-4" />
                </Link>

                <Link
                    href="#categories"
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
                >
                    {exploreLabel}
                </Link>
            </div>
        </section>
    );
}