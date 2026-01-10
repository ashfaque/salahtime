import { ArrowUpIcon } from "@/components/ui/Icon";
import { formatTime } from "@/lib/date-utils";
import { Skeleton } from "@/components/ui/Skeleton";

// Define what data this component expects
interface PrayerTableProps {
  prayers: { name: string; time: Date; isSecondary?: boolean }[] | null;
  currentPrayerId?: string;
  date?: Date;
}

export function PrayerTable({ prayers, currentPrayerId, date }: PrayerTableProps) {
  if (!prayers) return null; // Don't show anything if loading

  // Helper to scroll back up
  const scrollToTop = () => {
    const heroSection = document.getElementById("hero-section");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    }
    // document.getElementById("hero-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const isToday = date ? date.toDateString() === new Date().toDateString() : false;

  return (
    <div id="table-section" className="flex flex-col items-center justify-center w-full max-w-md relative pb-20">
      {/* Scroll Up Button */}
      <button onClick={scrollToTop} className="absolute -top-16 animate-bounce p-2 hover:bg-foreground/5 rounded-full">
        <ArrowUpIcon className="w-6 h-6 opacity-50" />
      </button>

      <h2 className="text-2xl font-bold mb-8">Prayer Schedule</h2>

      <div className="w-full space-y-4">
        {prayers
          ? // REAL DATA RENDER
            prayers.map((prayer) => {
              // Check if this row is the active one
              // Adhan returns lowercase (dhuhr), our names are Title Case (Dhuhr)
              const isActive = isToday && currentPrayerId === prayer.name.toLowerCase();

              return (
                <div
                  key={prayer.name}
                  className={`
                flex justify-between items-center text-lg p-3 rounded-lg transition-all
                ${prayer.isSecondary ? "text-foreground/40 text-base" : ""}
                ${isActive ? "bg-foreground/10 font-bold scale-105 shadow-sm border border-foreground/5" : "border-b border-foreground/10 font-medium"}
              `}
                >
                  <span>{prayer.name}</span>
                  <span className="font-mono">{formatTime(prayer.time)}</span>
                </div>
              );
            })
          : // SKELETON LOADER STATE
            [...Array(6)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-3 border-b border-foreground/5">
                <Skeleton className="h-6 w-24" /> {/* Prayer Name */}
                <Skeleton className="h-6 w-20" /> {/* Prayer Time */}
              </div>
            ))}
      </div>
    </div>
  );
}
