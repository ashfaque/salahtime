"use client";

import { ReactNode } from "react";

interface StatusScreenProps {
  title: string;
  message: string;
  icon?: ReactNode; // Optional: Pass a custom icon
  actionLabel?: string; // Optional: Text for a button
  onAction?: () => void; // Optional: What happens when clicked
}

export function StatusScreen({ title, message, icon, actionLabel, onAction }: StatusScreenProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="mb-6 p-4 bg-foreground/5 rounded-full">{icon || <span className="text-4xl">⚠️</span>}</div>

      <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
      <p className="text-foreground/60 max-w-sm mb-8 leading-relaxed">{message}</p>

      {actionLabel && onAction && (
        <button onClick={onAction} className="bg-foreground text-background px-6 py-3 rounded-xl font-bold active:scale-95 transition-transform">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
