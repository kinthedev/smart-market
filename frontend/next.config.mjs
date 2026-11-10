/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";
const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  (isProduction
    ? "https://smart-market-zogb.onrender.com"
    : "http://localhost:4000");

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
