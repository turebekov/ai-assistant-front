import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://12b383b6904ff103e7e23ac0278b871d@o4512491024744448.ingest.us.sentry.io/4512493921042432",

  // 100% of traces in development, 10% in production
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  integrations: [Sentry.replayIntegration()],

  // Replay 10% of sessions, plus 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
