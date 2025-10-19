/** @type {import('next').NextConfig} */
const nextConfig = {
  // cache: {
  //   // Disable caching for all pages
  //   etag: false,
  //   // Disable caching for all pages
  //   lastModified: false,
  // },

  // experimental: {
  //   serverExternalPackages: ["mongodb"],
  // },

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
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    return config;
  },
};

export default nextConfig;
