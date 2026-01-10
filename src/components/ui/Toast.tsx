"use client";

import { useEffect, useState } from "react";

type Props = {
  message?: string | null;
  visible?: boolean;
  duration?: number; // ms (0 = infinite/sticky)
  className?: string; // Allow custom positioning
};

export function Toast({ message, visible = false, duration = 5000, className }: Props) {
  const [show, setShow] = useState(visible && !!message);

  useEffect(() => {
    setShow(visible && !!message);
    if (visible && message && duration > 0) {
      const t = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(t);
    }
  }, [visible, message, duration]);

  if (!show || !message) return null;

  // Use className prop for custom position (default to top-4 right-4)
  const positionClass = className || "top-4 right-4";

  return (
    <div className={`fixed ${positionClass} z-50 transition-all duration-300`}>
      <div
        className={`flex items-center gap-3 bg-background/95 border px-3 py-2 rounded shadow-sm text-sm ${
          // Optional: Make it look different (e.g., Red border) if sticky/infinite
          duration === 0 ? "border-red-500/50" : "border-foreground/10"
        }`}
      >
        <div className="text-xs leading-none">{duration === 0 ? "⚠️" : "📍"}</div>
        <div className="max-w-xs text-[13px]">{message}</div>

        {/* Only show close button if it's not a sticky/forced toast (Optional) */}
        {duration > 0 && (
          <button onClick={() => setShow(false)} className="ml-2 text-foreground/60 hover:text-foreground">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
