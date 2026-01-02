/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // webpack(config) {
  //   config.experiments = {
  //     ...config.experiments,
  //     topLevelAwait: true,
  //   };
  //   return config;
  // },
  turbopack: {}, // enables turbopack
  // securityHeaders: [
  //   {
  //     key: "X-Content-Type-Options",
  //     value: "nosniff",
  //   },
  //   {
  //     key: "X-Frame-Options",
  //     value: "DENY",
  //   },
  //   {
  //     key: "X-XSS-Protection",
  //     value: "1; mode=block",
  //   },
  //   {
  //     key: "Strict-Transport-Security",
  //     value: "max-age=31536000; includeSubDomains",
  //   },
  // ],
};

export default nextConfig;
