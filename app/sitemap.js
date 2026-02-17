const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://espacogeek.com';

// TODO Implement site map using the most popular medias
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
export default function sitemap() {
	const now = new Date();

	return [
		{
			url: `${SITE_URL}/`,
			lastModified: now,
			changeFrequency: 'daily',
			priority: 1,
		},
		{
			url: `${SITE_URL}/about`,
			lastModified: now,
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${SITE_URL}/media`,
			lastModified: now,
			changeFrequency: 'daily',
			priority: 1,
		},
	];
}
