/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Esto permite que Next.js cargue imágenes desde tu servidor de Supabase
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Autoriza todos los subdominios de Supabase
      },
    ],
  },
};

export default nextConfig;