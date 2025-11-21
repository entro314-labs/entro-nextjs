# @entro314labs/entro-nextjs

Official Next.js integration for Entrolytics analytics. Built for the App Router with full TypeScript support.

## Features

- **App Router Native** - Built specifically for Next.js 13+ App Router
- **SSR Safe** - No hydration mismatches, proper server/client separation
- **Auto Page Tracking** - Automatic page view tracking with route detection
- **Event Tracking** - Track custom events with typed data
- **User Identification** - Identify users across sessions
- **Revenue Tracking** - Track purchases and conversions
- **Outbound Links** - Automatic external link tracking
- **A/B Testing** - Tag-based segmentation for experiments
- **Ad-Blocker Bypass** - Proxy mode for reliable tracking
- **Server-Side Tracking** - Track from API routes and Server Actions

## Installation

```bash
pnpm add @entro314labs/entro-nextjs
```

## Quick Start

### 1. Setup Provider

```tsx
// app/providers.tsx
'use client';

import { EntrolyticsProvider } from '@entro314labs/entro-nextjs';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EntrolyticsProvider
      websiteId={process.env.NEXT_PUBLIC_ENTROLYTICS_WEBSITE_ID!}
      host={process.env.NEXT_PUBLIC_ENTROLYTICS_HOST}
    >
      {children}
    </EntrolyticsProvider>
  );
}
```

```tsx
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 2. Track Events

```tsx
'use client';

import { useEntrolytics } from '@entro314labs/entro-nextjs';

export function SignupButton() {
  const { track } = useEntrolytics();

  return (
    <button onClick={() => track('signup-click', { plan: 'premium' })}>
      Sign Up
    </button>
  );
}
```

## Configuration

```tsx
<EntrolyticsProvider
  websiteId="your-website-id"           // Required
  host="https://analytics.example.com"  // Optional: custom host
  autoTrack={true}                      // Auto page views (default: true)
  tag="production"                      // A/B testing tag
  domains={['example.com']}             // Restrict to domains
  excludeSearch={false}                 // Strip query params
  excludeHash={true}                    // Strip hash fragments
  respectDoNotTrack={false}             // Honor DNT header
  ignoreLocalhost={true}                // Skip localhost
  trackOutboundLinks={true}             // Track external links
  debug={false}                         // Console logging
  beforeSend={(type, payload) => {      // Transform/filter
    if (isAdmin) return null;
    return payload;
  }}
/>
```

## Hooks

### useEntrolytics

```tsx
const {
  track,              // Track events
  trackView,          // Manual page view
  identify,           // User identification
  trackRevenue,       // Revenue tracking
  trackOutboundLink,  // Outbound link tracking
  setTag,             // Change A/B test tag
  generateEnhancedIdentity,  // Browser metadata
  isReady,            // Tracker ready state
  isEnabled,          // Tracking enabled state
} = useEntrolytics();
```

### usePageView

```tsx
// Basic - tracks on mount
usePageView();

// Custom URL
usePageView({ url: '/virtual-page' });

// With dependencies
usePageView({ url: dynamicPath, deps: [dynamicPath] });

// Conditional
usePageView({ enabled: isAuthenticated });
```

### useEventTracker

```tsx
const { trackEvent, createClickHandler } = useEventTracker({
  eventName: 'button-click',
  defaultData: { section: 'header' },
});

// Track with defaults
trackEvent();

// Use as click handler
<button onClick={createClickHandler('cta-click')}>Click</button>
```

## Components

### TrackEvent

```tsx
// Track on click
<TrackEvent name="cta-click" data={{ location: 'hero' }}>
  <button>Get Started</button>
</TrackEvent>

// Track on visibility
<TrackEvent name="section-viewed" trigger="visible" once>
  <section>Pricing</section>
</TrackEvent>

// Track on form submit
<TrackEvent name="form-submit" trigger="submit">
  <form>...</form>
</TrackEvent>
```

### OutboundLink

```tsx
<OutboundLink href="https://github.com" data={{ context: 'footer' }}>
  GitHub
</OutboundLink>
```

## Server-Side Tracking

### API Routes / Server Actions

```ts
import { trackServerEvent } from '@entro314labs/entro-nextjs/server';

export async function POST(request: Request) {
  await trackServerEvent(
    {
      host: process.env.ENTROLYTICS_HOST!,
      websiteId: process.env.ENTROLYTICS_WEBSITE_ID!,
    },
    {
      event: 'api-call',
      data: { endpoint: '/api/users' },
      request,
    }
  );

  return Response.json({ success: true });
}
```

### Proxy Mode

```ts
// app/api/collect/[...path]/route.ts
import { createProxyHandler } from '@entro314labs/entro-nextjs/server';

export const { GET, POST } = createProxyHandler({
  host: process.env.ENTROLYTICS_HOST!,
  websiteId: process.env.ENTROLYTICS_WEBSITE_ID,
  mode: 'cloak',
});
```

### Middleware

```ts
// middleware.ts
import { withEntrolyticsMiddleware } from '@entro314labs/entro-nextjs/server';

const entrolytics = withEntrolyticsMiddleware({
  host: process.env.ENTROLYTICS_HOST!,
  websiteId: process.env.ENTROLYTICS_WEBSITE_ID!,
  trackRoutes: ['/api/*'],
});

export async function middleware(request: NextRequest) {
  return entrolytics(request);
}
```

## Next.js Config Plugin

```ts
// next.config.ts
import { withEntrolytics } from '@entro314labs/entro-nextjs/plugin';

export default withEntrolytics({
  websiteId: process.env.NEXT_PUBLIC_ENTROLYTICS_WEBSITE_ID!,
  host: process.env.NEXT_PUBLIC_ENTROLYTICS_HOST,
  proxy: {
    enabled: true,
    mode: 'cloak',
  },
})({
  reactStrictMode: true,
});
```

## License

MIT © [Entrolytics](https://entrolytics.click)
