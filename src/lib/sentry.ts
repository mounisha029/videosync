// Sentry Error Tracking Setup
// To use: npm install @sentry/nextjs
// Then run: npx @sentry/wizard@latest -i nextjs

/**
 * Initialize Sentry for error tracking
 * 
 * Setup Instructions:
 * 1. Install Sentry: npm install @sentry/nextjs
 * 2. Run setup wizard: npx @sentry/wizard@latest -i nextjs
 * 3. Add SENTRY_DSN to .env.local
 * 4. The wizard will create sentry.client.config.ts and sentry.server.config.ts
 * 
 * Manual Setup (if wizard doesn't work):
 */

// Example Sentry configuration (commented out until package is installed)
/*
import * as Sentry from "@sentry/nextjs";

export function initSentry() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    
    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
    
    environment: process.env.NODE_ENV,
    
    // Filter out sensitive data
    beforeSend(event, hint) {
      // Don't send events in development
      if (process.env.NODE_ENV === "development") {
        return null;
      }
      
      // Filter out sensitive data from the event
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers;
      }
      
      return event;
    },
    
    // Ignore certain errors
    ignoreErrors: [
      // Browser extensions
      "top.GLOBALS",
      // Random plugins/extensions
      "originalCreateNotification",
      "canvas.contentDocument",
      "MyApp_RemoveAllHighlights",
      // Network errors
      "NetworkError",
      "Network request failed",
      // Clerk errors (handled by Clerk)
      "ClerkAPIResponseError",
    ],
  });
}

// Custom error logging function
export function logError(error: Error, context?: Record<string, any>) {
  console.error("Error:", error, context);
  
  if (process.env.NODE_ENV === "production" && typeof Sentry !== "undefined") {
    Sentry.captureException(error, {
      extra: context,
    });
  }
}

// Log custom events
export function logEvent(eventName: string, data?: Record<string, any>) {
  console.log("Event:", eventName, data);
  
  if (process.env.NODE_ENV === "production" && typeof Sentry !== "undefined") {
    Sentry.captureMessage(eventName, {
      level: "info",
      extra: data,
    });
  }
}
*/

// Placeholder functions until Sentry is installed
export function logError(error: Error, context?: Record<string, any>) {
  console.error("Error:", error);
  if (context) {
    console.error("Context:", context);
  }
  
  // In production, this would send to Sentry
  // For now, just log to console
}

export function logEvent(eventName: string, data?: Record<string, any>) {
  console.log("Event:", eventName, data);
  
  // In production, this would send to Sentry
  // For now, just log to console
}

/**
 * Setup Instructions for Production:
 * 
 * 1. Install Sentry:
 *    npm install @sentry/nextjs
 * 
 * 2. Run the setup wizard:
 *    npx @sentry/wizard@latest -i nextjs
 * 
 * 3. Add to .env.local:
 *    NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
 * 
 * 4. The wizard will create:
 *    - sentry.client.config.ts
 *    - sentry.server.config.ts
 *    - sentry.edge.config.ts
 * 
 * 5. Update next.config.mjs to include Sentry webpack plugin
 * 
 * 6. Use in your code:
 *    import { logError, logEvent } from '@/lib/sentry';
 *    
 *    try {
 *      // your code
 *    } catch (error) {
 *      logError(error, { userId, action: 'create_interview' });
 *    }
 */
