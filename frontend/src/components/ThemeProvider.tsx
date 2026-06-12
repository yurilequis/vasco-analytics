"use client";

import * as React from "react";

/**
 * Provedor de Tema simplificado para a Arquitetura Unificada Dark Pro.
 * Como o tema agora é fixo e definido via CSS Variables no globals.css,
 * este componente serve apenas como compatibilidade para evitar quebras em outros arquivos.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
