import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-black text-white antialiased">
        {/* Comentamos esto para que no aparezca el banner superior */}
        {/* <header> ... contenido del header ... </header> */}
        <main>{children}</main>
      </body>
    </html>
  );
}