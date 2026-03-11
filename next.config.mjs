/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  // Only bundle the react-icons we use (smaller, fewer resolution issues)
  experimental: {
    optimizePackageImports: ["react-icons/fa", "react-icons/gi"],
  },
};

export default nextConfig;
