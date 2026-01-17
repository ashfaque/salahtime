import { formatTime } from "@/lib/date-utils";
import { ArrowUpIcon } from "@/components/ui/Icon";

interface MakruhCardProps {
  prayers: { name: string; time: Date }[] | null;
}

export function MakruhCard({ prayers }: MakruhCardProps) {
  if (!prayers) return null;

  // Helper to add/subtract minutes
  const addMinutes = (date: Date, minutes: number) => new Date(date.getTime() + minutes * 60000);
  // 1. Find the reference times from your existing schedule
  const sunrise = prayers.find((p) => p.name === "Sunrise")?.time;
  const dhuhr = prayers.find((p) => p.name === "Dhuhr" || p.name === "Jumu'a")?.time;
  const maghrib = prayers.find((p) => p.name === "Maghrib")?.time;

  if (!sunrise || !dhuhr || !maghrib) return null;

  // 2. Define the ranges
  const times = [
    {
      label: "Sunrise (Ishraq)",
      start: sunrise, // From Sunrise...
      end: addMinutes(sunrise, 15), // HC: ...until 15 mins after
      desc: "Wait until the sun has fully risen",
    },
    {
      label: "Zawal (Noon)",
      start: addMinutes(dhuhr, -10), // HC: 10 mins before Dhuhr...
      end: dhuhr, // ...until Dhuhr starts
      desc: "Sun at its absolute highest peak",
    },
    {
      label: "Sunset (Ghurub)",
      start: addMinutes(maghrib, -15), // HC: 15 mins before Maghrib...
      end: maghrib, // ...until Maghrib starts
      desc: "When the sun turns yellow before setting",
    },
  ];

  // Helper to go back up
  const scrollBackUp = () => {
    document.getElementById("table-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="makruh-section" className="flex flex-col items-center justify-center w-full max-w-md relative">
      {/* UP ARROW (To go back to Table) */}
      <button onClick={scrollBackUp} className="absolute -top-24 animate-bounce p-2 hover:bg-foreground/5 rounded-full">
        <ArrowUpIcon className="w-6 h-6 opacity-50" />
      </button>

      <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-6 text-center">🚫 Forbidden (Makruh) Times</h3>

      <div className="w-full bg-orange-500/5 border border-orange-500/10 rounded-xl overflow-hidden divide-y divide-orange-500/10 shadow-sm">
        {times.map((item) => (
          <div key={item.label} className="flex flex-col p-4 hover:bg-orange-500/10 transition-colors">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-sm text-orange-700 dark:text-orange-400">{item.label}</span>
              <span className="font-mono text-sm font-bold text-foreground/80">
                {formatTime(item.start)} – {formatTime(item.end)}
              </span>
            </div>
            <p className="text-[10px] text-foreground/50 italic">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
