import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LifeFighter - Entrena como un Campeón',
  description: 'Sistema de entrenamiento de boxeo con leyendas del deporte',
  keywords: ['boxeo', 'entrenamiento', 'fitness', 'deporte', 'rutinas'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-black text-white`}>
        {/* Header Simple */}
        <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold">🥊</span>
                </div>
                <h1 className="text-2xl font-black italic tracking-tighter">
                  <span className="text-yellow-500">LIFE</span>FIGHTER
                </h1>
              </div>
              
              <nav className="hidden md:flex space-x-6">
                <a href="/" className="hover:text-yellow-500 transition">Inicio</a>
                <a href="/entrenar" className="hover:text-yellow-500 transition">Entrenar</a>
                <a href="/boxeador" className="hover:text-yellow-500 transition">Boxeadores</a>
                <a href="/admin" className="hover:text-yellow-500 transition">Admin</a>
              </nav>
            </div>
          </div>
        </header>
        
        {/* Contenido principal */}
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-900 border-t border-gray-800 py-8">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>© 2024 LifeFighter. Entrena como un campeón.</p>
            <p className="text-sm mt-2">Sistema de entrenamiento de boxeo profesional</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
