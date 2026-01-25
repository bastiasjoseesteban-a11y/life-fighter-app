/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true, // Mejora la compatibilidad de rutas en Android
  images: {
    unoptimized: true, // Necesario para exportaciones estáticas
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;