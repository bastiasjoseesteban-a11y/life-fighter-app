"use client";
import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface BoxingVideoProps {
  title: string;
  url: string;
  startTime?: number;
  description?: string;
  muted?: boolean; // Para los 82 videos, mejor que empiecen en silencio
}

export default function BoxingVideo({ 
  title, 
  url, 
  startTime = 0, 
  description,
  muted = true // Por defecto en mute para no asustar al usuario
}: BoxingVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extraer el ID del video de YouTube
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(url);
  const embedUrl = videoId 
    ? `https://www.youtube.com/embed/${videoId}?start=${startTime}&rel=0&modestbranding=1${muted ? '&mute=1' : ''}`
    : null;

  if (!embedUrl) {
    return (
      <div className="w-full aspect-video bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/10">
        <p className="text-zinc-500 text-sm">URL de video inválida</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Título del Video */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-wider text-white/80">{title}</h3>
        <button 
          onClick={() => setIsPlaying(false)}
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          title="Reiniciar video"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Contenedor del Video */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl group">
        {!isPlaying ? (
          // Thumbnail + Botón Play
          <div 
            className="absolute inset-0 cursor-pointer"
            onClick={() => setIsPlaying(true)}
          >
            <img 
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="w-20 h-20 bg-[#00FBFF] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Play size={32} fill="black" className="ml-1" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/80 backdrop-blur-sm p-3 rounded-xl">
                <p className="text-xs font-bold text-white/90">
                  {description || 'Click para reproducir'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Video de YouTube
          <iframe
            width="100%"
            height="100%"
            src={`${embedUrl}&autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0"
          />
        )}
      </div>

      {/* Tip debajo del video */}
      {description && (
        <p className="text-xs text-zinc-500 italic text-center">
          💡 Tip: Usa la velocidad 0.5x en YouTube para ver la técnica en cámara lenta
        </p>
      )}
    </div>
  );
}