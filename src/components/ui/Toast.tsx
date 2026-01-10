"use client";

import { useEffect, useState } from "react";

type Props = {
  message?: string | null;
  visible?: boolean;
  duration?: number; // ms
};

export function Toast({ message, visible = false, duration = 5000 }: Props) {
  const [show, setShow] = useState(visible && !!message);

  useEffect(() => {
    setShow(visible && !!message);
    if (visible && message) {
      const t = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(t);
    }
  }, [visible, message, duration]);

  if (!show || !message) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-3 bg-background/95 border border-foreground/10 px-3 py-2 rounded shadow-sm text-sm">
        <div className="text-xs leading-none">📍</div>
        <div className="max-w-xs text-[13px]">{message}</div>
        <button onClick={() => setShow(false)} className="ml-2 text-foreground/60 hover:text-foreground">
          ✕
        </button>
      </div>
    </div>
  );
}
