import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  /* Les migrations sont lues au démarrage (instrumentation.ts) : on les embarque dans le déploiement. */
  outputFileTracingIncludes: {
    "/*": ["./serveur/db/migrations/**/*"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
