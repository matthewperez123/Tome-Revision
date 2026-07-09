import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  // Allow external painting images from museum / Wikimedia sources
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "images.metmuseum.org" },
      { protocol: "https", hostname: "www.artic.edu" },
      { protocol: "https", hostname: "lakeimagesweb.artic.edu" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "media.nga.gov" },
      // Standard Ebooks text-free cover paintings in Supabase Storage
      { protocol: "https", hostname: "vjaezrcuuzmbmnsfrtwt.supabase.co" },
    ],
  },

  // Reduce file-watcher CPU by ignoring 27K static content files
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: /node_modules|public\/content/,
    };
    return config;
  },

  // The cover reference route reads files via a dynamic process.cwd() path,
  // which makes Next.js conservatively trace the entire project root into the
  // serverless function (982mb > 250mb limit). It only needs node:fs/node:path,
  // so exclude node_modules and public from its trace.
  outputFileTracingExcludes: {
    "/api/covers/references/*": [
      "node_modules/**",
      "public/**",
      "archive/**",
      "content/**",
      "scripts/**",
    ],
  },

  // /library is the marketing preview surface (Wanderer hero); the functional
  // catalog with working filters/search lives at /library/browse. Both are
  // distinct, live routes — no redirect between them.

  // Compress responses
  compress: true,

  // Caching headers for static assets
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|avif|woff2|woff|ttf|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // _next/static caching handled automatically by Vercel
    ];
  },

  // Optimize packages for tree-shaking
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "motion/react",
      "@base-ui/react",
    ],
  },
};

export default nextConfig;
