# Analytics Implementation Guide for JMJ Cloud Website

## Overview

Add Microsoft Clarity and Google Analytics to the JMJ Cloud Astro website to track visitor behavior and site analytics.

## Prerequisites

Before implementation, the user needs to:

1. **Microsoft Clarity**: Create a free account at https://clarity.microsoft.com and create a new project. Get the **Project ID** from the setup instructions.

2. **Google Analytics**: Create a Google Analytics 4 property at https://analytics.google.com. Get the **Measurement ID** (format: `G-XXXXXXXXXX`).

## Implementation Steps

### Step 1: Create Analytics Component

Create a new component file at `src/components/Analytics.astro`:

```astro
---
// Analytics.astro
// Loads Microsoft Clarity and Google Analytics

interface Props {
  clarityId?: string;
  googleAnalyticsId?: string;
}

const { 
  clarityId = import.meta.env.PUBLIC_CLARITY_ID,
  googleAnalyticsId = import.meta.env.PUBLIC_GA_ID 
} = Astro.props;
---

{clarityId && (
  <script type="text/javascript" define:vars={{ clarityId }}>
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", clarityId);
  </script>
)}

{googleAnalyticsId && (
  <>
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}></script>
    <script define:vars={{ googleAnalyticsId }}>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', googleAnalyticsId);
    </script>
  </>
)}
```

### Step 2: Add Environment Variables

Create or update the `.env` file in the project root:

```env
PUBLIC_CLARITY_ID=your-clarity-project-id
PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Note**: Variables prefixed with `PUBLIC_` are exposed to client-side code in Astro.

Also add these to `.env.example` for documentation:

```env
# Analytics Configuration
PUBLIC_CLARITY_ID=your-clarity-project-id
PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Step 3: Add Component to Base Layout

Find the main layout file (likely `src/layouts/Layout.astro` or `src/layouts/BaseLayout.astro`) and add the Analytics component inside the `<head>` tag:

```astro
---
import Analytics from '../components/Analytics.astro';
// ... other imports
---

<html lang="en">
  <head>
    <!-- ... other head content ... -->
    
    <!-- Analytics - only loads in production -->
    {import.meta.env.PROD && <Analytics />}
  </head>
  <body>
    <!-- ... body content ... -->
  </body>
</html>
```

The `import.meta.env.PROD` check ensures analytics only load in production builds, not during local development.

### Step 4: Update .gitignore

Ensure `.env` is in `.gitignore` to avoid committing sensitive IDs:

```
.env
.env.local
```

### Step 5: Configure GitHub Pages Deployment

If using GitHub Actions for deployment, add the environment variables as repository secrets:

1. Go to repository Settings → Secrets and variables → Actions
2. Add `PUBLIC_CLARITY_ID` and `PUBLIC_GA_ID` as repository secrets

Then update the GitHub Actions workflow file (likely `.github/workflows/deploy.yml` or similar) to include the environment variables during build:

```yaml
- name: Build
  env:
    PUBLIC_CLARITY_ID: ${{ secrets.PUBLIC_CLARITY_ID }}
    PUBLIC_GA_ID: ${{ secrets.PUBLIC_GA_ID }}
  run: npm run build
```

## Alternative: Using Astro Integration Packages

If preferred, you can use community packages instead of manual implementation:

```bash
npm install @astrojs/partytown
```

Partytown can offload analytics scripts to a web worker for better performance. See Astro docs for configuration.

## Verification

After deployment:

1. **Microsoft Clarity**: Visit your site, then check the Clarity dashboard. Data should appear within a few minutes. Use the "Live" view to see real-time sessions.

2. **Google Analytics**: Visit your site, then check GA4 Real-time reports. You should see yourself as an active user.

## Privacy Considerations

Consider adding a cookie consent banner if serving visitors in the EU (GDPR) or other privacy-regulated regions. Both Clarity and GA4 can be configured to respect consent preferences.

## Files Changed Summary

- `src/components/Analytics.astro` - New file
- `src/layouts/Layout.astro` (or equivalent) - Modified to include Analytics component
- `.env` - New/modified with analytics IDs
- `.env.example` - New/modified for documentation
- `.gitignore` - Ensure .env is listed
- `.github/workflows/*.yml` - Modified to include env vars in build (if using GitHub Actions)
