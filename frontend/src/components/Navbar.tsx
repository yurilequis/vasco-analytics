"use client"; // Precisamos disso porque vamos ler a rota atual para destacar o menu ativo

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();

  // Lista de links para facilitar a manutenção
  const links = [
    { nome: 'Início', rota: '/' },
    { nome: 'Elenco', rota: '/elenco' },
    { nome: 'Partidas', rota: '/partidas' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        
        {/* Logo / Nome do Projeto */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">
            VASCO<span className="text-red-600">ANALYTICS</span>
          </span>
        </Link>

        {/* Links de Navegação */}
        {/* Links de Navegação e Botão de Tema */}
        <div className="flex items-center gap-2 sm:gap-4">
          {links.map((link) => {
            const isActive = pathname === link.rota;
            return (
              <Link
                key={link.nome}
                href={link.rota}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50'
                }`}
              >
                {link.nome}
              </Link>
            );
          })}
          
          {/* Divisor Visual */}
          <div className="hidden h-6 w-px bg-zinc-300 dark:bg-zinc-700 sm:block"></div>
          
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}