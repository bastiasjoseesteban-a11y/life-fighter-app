/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✅ Habilitar export estático
  images: {
    unoptimized: true, // ✅ Deshabilitar optimización para entornos estáticos
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default nextConfig;