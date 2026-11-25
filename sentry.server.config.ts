import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://12b383b6904ff103e7e23ac0278b871d@o4512491024744448.ingest.us.sentry.io/4512493921042432",

  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
});
