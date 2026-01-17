"use client";

import { useRef, useEffect } from "react";
import { Madhab } from "adhan";
import { useTheme } from "@/modules/prayer/hooks/useTheme";

// Define the type again here for safety
type MadhabValue = typeof Madhab.Hanafi | typeof Madhab.Shafi;

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  madhab: MadhabValue;
  onMadhabChange: (val: "Hanafi" | "Standard") => void;
  method: string;
  onMethodChange: (val: string) => void;
}

export function SettingsModal({ isOpen, onClose, madhab, onMadhabChange, method, onMethodChange }: SettingsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div ref={modalRef} className="bg-background border border-foreground/10 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
        <h2 className="text-xl font-bold mb-6">Settings</h2>
        {/* Appearance Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground/70 mb-2">Appearance</label>
          <div className="flex bg-foreground/5 p-1 rounded-lg">
            <button
              onClick={() => theme === "dark" && toggleTheme()}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                theme === "light" ? "bg-background shadow text-foreground" : "text-foreground/50 hover:text-foreground/80"
              }`}
            >
              Light
            </button>
            <button
              onClick={() => theme === "light" && toggleTheme()}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                theme === "dark" ? "bg-background shadow text-foreground" : "text-foreground/50 hover:text-foreground/80"
              }`}
            >
              Dark
            </button>
          </div>
        </div>
        {/* Asr Calculation (Madhab) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground/70 mb-2">Asr Calculation (Madhab)</label>
          <div className="flex bg-foreground/5 p-1 rounded-lg">
            <button
              onClick={() => onMadhabChange("Hanafi")}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                madhab === Madhab.Hanafi ? "bg-background shadow text-foreground" : "text-foreground/50 hover:text-foreground/80"
              }`}
            >
              Hanafi
            </button>
            <button
              onClick={() => onMadhabChange("Standard")}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                madhab === Madhab.Shafi ? "bg-background shadow text-foreground" : "text-foreground/50 hover:text-foreground/80"
              }`}
              title="Includes Shafi'i, Maliki, Hanbali"
            >
              Standard
            </button>
          </div>
          <p className="text-[10px] text-foreground/40 mt-2 text-center">&quot;Standard&quot; covers Shafi&apos;i, Maliki, and Hanbali.</p>
        </div>

        {/* Calculation Method */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground/70 mb-2">Calculation Method</label>
          <select
            value={method}
            onChange={(e) => onMethodChange(e.target.value)}
            className="w-full bg-background text-foreground border border-foreground/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 [&>*]:bg-background [&>*]:text-foreground"
          >
            <option value="JamiaUloomIslamia">Jamia Uloom-ul-Islamia (Indian Subcontinent)</option>
            <option value="MoonsightingCommittee">Moonsighting Committee</option>
            <option value="MuslimWorldLeague">Muslim World League</option>
            <option value="Egyptian">Egyptian General Authority</option>
            <option value="UmmAlQura">Umm Al-Qura (Makkah)</option>
            <option value="NorthAmerica">ISNA (North America)</option>
          </select>
          <p className="text-[10px] text-foreground/40 mt-2">Auto-detected based on your location.</p>
        </div>

        <button onClick={onClose} className="w-full py-3 bg-foreground text-background font-bold rounded-xl active:scale-95 transition-transform">
          Done
        </button>
      </div>
    </div>
  );
}
