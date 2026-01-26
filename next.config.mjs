/** @type {import('next').NextConfig} */
const nextConfig = {
  // ELIMINAR output: "export" - no es compatible con Edge Functions
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;