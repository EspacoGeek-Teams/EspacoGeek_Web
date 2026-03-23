import { BookOpen, BookText, Film, Gamepad2, MonitorPlay, Tv } from 'lucide-react';
import MediaCategoryCard from './MediaCategoryCard';

const iconsByCategory = {
    anime: MonitorPlay,
    series: Tv,
    movies: Film,
    visualNovels: BookText,
    books: BookOpen,
    games: Gamepad2,
};

export default function MediaCategoryGrid({ categories }) {
    return (
        <section id="categories" className="w-full max-w-5xl mx-auto">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category, index) => (
                    <MediaCategoryCard
                        key={category.title}
                        icon={iconsByCategory[category.key]}
                        title={category.title}
                        description={category.description}
                        count={category.count}
                        delayClass={`animate-slide-up-delay-${Math.min(index, 5)}`}
                    />
                ))}
            </div>
        </section>
    );
}