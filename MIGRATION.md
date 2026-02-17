# Migration from React (Vite) to Next.js

This document describes the migration of the EspaçoGeek frontend from a React application using Vite to Next.js 16 with the App Router.

## What Changed

### Framework
- **Before:** React 18 + Vite + React Router DOM
- **After:** Next.js 16 with App Router

### Routing
- **Before:** React Router DOM with client-side routing defined in `src/routes/routes.jsx`
- **After:** Next.js file-based routing in the `app/` directory

### Build System
- **Before:** Vite
- **After:** Next.js with Turbopack

## File Structure Changes

### New Files
```
app/
├── layout.js              # Root layout (server component)
├── ClientLayout.js        # Client-side providers wrapper
├── page.js               # Home page (/)
└── media/[mediaId]/[mediaName]/
    └── page.js           # Media detail page (/media/:id/:name)
```

### Removed Files
- `vite.config.js` - No longer needed
- `index.html` - Replaced by Next.js's automatic HTML generation
- `src/main.jsx` - Entry point replaced by `app/layout.js`
- `src/routes/routes.jsx` - Routing now file-based

### Modified Files
- `package.json` - Updated scripts and dependencies
- `src/components/apollo/config.js` - Updated for Next.js env vars
- `src/components/layout/Layout.jsx` - Replaced `useNavigate` with `useRouter`
- `src/components/layout/SearchBar.jsx` - Replaced `useNavigate` with `useRouter`

## Environment Variables

Create a `.env.local` file based on `.env.local.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Note:** Next.js requires the `NEXT_PUBLIC_` prefix for environment variables that should be exposed to the browser.

## Scripts

### Development
```bash
npm run dev
```
Starts the development server on http://localhost:3000

### Build
```bash
npm run build
```
Creates an optimized production build

### Production
```bash
npm start
```
Starts the production server (requires `npm run build` first)

## Technical Decisions

### Client-Side Rendering
The application uses client-side rendering (`'use client'`) to avoid SSR issues with:
- **i18next LanguageDetector:** Accesses `localStorage` and `navigator`
- **PrimeReact components:** May access `document` at module level
- **Apollo Client:** Configured for client-side operation

The `ClientLayout.js` component uses a conditional mounting pattern (`useState` + `useEffect`) to ensure components only render on the client side.

### Navigation
- React Router's `useNavigate()` → Next.js's `useRouter()` from `next/navigation`
- Routes defined in files instead of a configuration file
- Dynamic routes use folder structure: `[param]`

### Route Parameters
Next.js 15+ treats `params` as a Promise. The media page properly awaits the params object:

```javascript
const resolvedParams = await params;
const mediaId = resolvedParams.mediaId;
```

## Security Notes

### Image Configuration
The `next.config.js` currently allows images from any domain using wildcards (`**`). For production:

1. Identify all external image sources
2. Update `next.config.js` with specific domains:

```javascript
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'api.espacogeek.com',
  },
  {
    protocol: 'https',
    hostname: 'your-cdn.example.com',
  },
]
```

## Compatibility

### GraphQL API
The existing GraphQL API integration remains unchanged:
- Apollo Client configuration preserved
- All queries and mutations work as before
- Cookie-based authentication continues to work

### Styling
All styling remains functional:
- Tailwind CSS
- PrimeReact themes and components
- Custom CSS files

### i18n
Internationalization with i18next continues to work with client-side initialization.

## Migration Benefits

1. **Modern Framework:** Next.js provides built-in optimizations and a robust ecosystem
2. **File-based Routing:** Simpler, more intuitive routing structure
3. **Better Performance:** Turbopack build system is faster than Vite
4. **Future Scalability:** Easy to add SSR, ISR, or SSG when needed
5. **Built-in Optimizations:** Image optimization, font optimization, etc.

## Known Limitations

1. **Client-Side Only:** The app currently uses CSR exclusively. SSR can be enabled later if needed.
2. **Image Domains:** Wildcard pattern for images should be restricted in production.

## Testing

All existing functionality has been tested and verified:
- ✅ Home page renders correctly
- ✅ Media detail pages work with dynamic routes
- ✅ Navigation between pages functions properly
- ✅ Apollo Client queries execute correctly
- ✅ All context providers work as expected
- ✅ Styling (Tailwind + PrimeReact) renders properly

## Troubleshooting

### "Cannot find module" errors
Run `npm install` to ensure all dependencies are installed.

### Build fails with "document is not defined"
This usually means a component is trying to access browser APIs during SSR. Ensure the component is:
1. Marked with `'use client'`
2. Uses conditional mounting if needed (see `ClientLayout.js`)

### Images don't load
1. Check that the image domain is allowed in `next.config.js`
2. Verify the `NEXT_PUBLIC_API_URL` environment variable is set

### Environment variables not working
1. Ensure they start with `NEXT_PUBLIC_` for client-side access
2. Restart the dev server after changing `.env.local`

## Further Reading

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Documentation](https://nextjs.org/docs/app)
- [Migrating from Vite](https://nextjs.org/docs/app/building-your-application/upgrading/from-vite)
