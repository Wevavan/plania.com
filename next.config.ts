import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimisation des images avec Cloudinary
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Headers de sécurité
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Force HTTPS pendant 2 ans (HSTS), sous-domaines inclus + preload
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Empêche le site d'être intégré dans un iframe (protection clickjacking)
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Empêche le navigateur de deviner le type MIME
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Politique de referrer
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Permissions restrictives
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Content Security Policy (CSP)
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://*.googletagmanager.com",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // Optimisations de production
  compress: true,
  poweredByHeader: false,

  // Configuration expérimentale pour optimisations
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
