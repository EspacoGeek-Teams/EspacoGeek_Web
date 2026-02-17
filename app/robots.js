// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://espacogeek.com';

export default function robots() {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: '/verify-account',
		},
		sitemap: `${SITE_URL}/sitemap.xml`,
		host: SITE_URL,
	};
}
