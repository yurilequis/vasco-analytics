"use client";

import React from 'react';
import Navbar from '@/components/Navbar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="scroll-area bg-background pb-24 md:pb-0">
        {children}
      </main>
    </>
  );
}
