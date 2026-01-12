"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Trophy } from 'lucide-react';

export default function NavigationTabs() {
  const pathname = usePathname();

  const tabs = [
    { 
      href: '/entrenar/equipo', 
      label: 'MI EQUIPO', 
      icon: Users,
      active: pathname.startsWith('/entrenar/equipo') || pathname === '/entrenar'
    },
    { 
      href: '/entrenar/mis-logros', 
      label: 'MIS LOGROS', 
      icon: Trophy,
      active: pathname.startsWith('/entrenar/mis-logros')
    },
  ];

  return (
    <div className="flex justify-center gap-4 mb-12">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`
              group relative px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider
              transition-all duration-300
              ${tab.active 
                ? 'bg-yellow-500 text-black shadow-[0_0_30px_rgba(234,179,8,0.4)]' 
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <Icon size={20} />
              <span>{tab.label}</span>
            </div>
            
            {tab.active && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            )}
          </Link>
        );
      })}
    </div>
  );
}