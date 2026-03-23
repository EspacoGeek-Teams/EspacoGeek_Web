'use client';

import { useTranslation } from 'react-i18next';
import HomeHero from './HomeHero';
import MediaCategoryGrid from './MediaCategoryGrid';

const categoryKeys = ['anime', 'series', 'movies', 'visualNovels', 'books', 'games'];

export default function HomeLandingContent() {
    const { t } = useTranslation();

    const categories = categoryKeys.map((key) => ({
        key,
        title: t(`homeLanding.categories.${key}.title`),
        description: t(`homeLanding.categories.${key}.description`),
        count: t(`homeLanding.categories.${key}.count`),
    }));

    return (
        <>
            <HomeHero
                badge={t('homeLanding.badge')}
                titlePrefix={t('homeLanding.titlePrefix')}
                titleHighlight={t('homeLanding.titleHighlight')}
                description={t('homeLanding.description')}
            />

            <MediaCategoryGrid categories={categories} />

            <p className="animate-slide-up-delay-5 mt-20 text-xs font-mono tracking-[0.35em] text-muted-foreground/50">
                {t('homeLanding.multiverseTagline')}
            </p>
        </>
    );
}