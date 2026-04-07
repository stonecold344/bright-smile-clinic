import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay, 
  isToday,
  setMonth as setDateMonth,
  setYear as setDateYear
} from "date-fns";
import { he } from "date-fns/locale";
import { cn } from "@/lib/utils";

const DAY_NAMES = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
const MONTHS_HE = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

export interface CalendarProps {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  initialFocus?: boolean;
}

function Calendar({ selected, onSelect, disabled, className }: CalendarProps) {
  const [viewDate, setViewDate] = React.useState(() => selected || new Date());
  const [showMonths, setShowMonths] = React.useState(false);
  const [showYears, setShowYears] = React.useState(false);
  const [animDir, setAnimDir] = React.useState<"left" | "right" | null>(null);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  // Week starts on Sunday (0) for Hebrew calendar
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const goNext = () => {
    setAnimDir("left");
    setViewDate(prev => addMonths(prev, 1));
    setTimeout(() => setAnimDir(null), 250);
  };

  const goPrev = () => {
    setAnimDir("right");
    setViewDate(prev => subMonths(prev, 1));
    setTimeout(() => setAnimDir(null), 250);
  };

  const handleMonthSelect = (idx: number) => {
    setViewDate(prev => setDateMonth(prev, idx));
    setShowMonths(false);
  };

  const handleYearSelect = (year: number) => {
    setViewDate(prev => setDateYear(prev, year));
    setShowYears(false);
    setShowMonths(true);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Year picker
  if (showYears) {
    return (
      <div className={cn("pointer-events-auto w-full max-w-[320px] mx-auto select-none", className)} dir="rtl">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-foreground">בחירת שנה</span>
            <button
              type="button"
              onClick={() => { setShowYears(false); setShowMonths(true); }}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-accent"
            >
              חזרה
            </button>
          </div>
          <div className="grid grid-cols-4 gap-1.5 max-h-[240px] overflow-y-auto scrollbar-thin">
            {years.map(y => (
              <button
                key={y}
                type="button"
                onClick={() => handleYearSelect(y)}
                className={cn(
                  "rounded-xl py-2.5 text-xs font-semibold transition-all duration-200 active:scale-95",
                  viewDate.getFullYear() === y
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-accent"
                )}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Month picker
  if (showMonths) {
    return (
      <div className={cn("pointer-events-auto w-full max-w-[320px] mx-auto select-none", className)} dir="rtl">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setShowYears(true)}
              className="text-sm font-bold text-foreground hover:text-primary transition-colors"
            >
              {viewDate.getFullYear()}
            </button>
            <button
              type="button"
              onClick={() => setShowMonths(false)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-accent"
            >
              חזרה
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {MONTHS_HE.map((m, idx) => (
              <button
                key={m}
                type="button"
                onClick={() => handleMonthSelect(idx)}
                className={cn(
                  "rounded-xl py-3 text-xs font-semibold transition-all duration-200 active:scale-95",
                  viewDate.getMonth() === idx
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-accent"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main calendar
  return (
    <div className={cn("pointer-events-auto w-full max-w-[320px] mx-auto select-none", className)} dir="rtl">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-lg">
        {/* Header: arrows in corners, month label in center */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={goPrev}
            className="flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200 active:scale-90"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowMonths(true)}
            className="px-3 py-1.5 rounded-xl text-sm font-bold text-foreground hover:bg-accent transition-all duration-200"
          >
            {format(viewDate, "MMMM yyyy", { locale: he })}
          </button>

          <button
            type="button"
            onClick={goNext}
            className="flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200 active:scale-90"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_NAMES.map(d => (
            <div key={d} className="text-center text-[11px] font-semibold text-muted-foreground py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day grid with animation */}
        <div
          className={cn(
            "transition-all duration-200 ease-out",
            animDir === "left" && "animate-slide-left",
            animDir === "right" && "animate-slide-right"
          )}
        >
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7">
              {week.map((d, di) => {
                const inMonth = isSameMonth(d, viewDate);
                const isSelected = selected && isSameDay(d, selected);
                const isTodayDate = isToday(d);
                const isDisabled = disabled?.(d);

                return (
                  <div key={di} className="flex items-center justify-center py-[3px]">
                    <button
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        if (!isDisabled && onSelect) {
                          onSelect(isSelected ? undefined : d);
                        }
                      }}
                      className={cn(
                        "relative w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200 active:scale-90",
                        !inMonth && "opacity-25",
                        isDisabled && "opacity-20 cursor-not-allowed",
                        !isSelected && !isTodayDate && inMonth && "text-foreground hover:bg-accent",
                        isTodayDate && !isSelected && "text-primary font-bold",
                        isSelected && "bg-primary text-primary-foreground shadow-md font-bold"
                      )}
                    >
                      {d.getDate()}
                      {/* Today indicator dot */}
                      {isTodayDate && !isSelected && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                      )}
                      {/* Selected indicator ring */}
                      {isSelected && (
                        <span className="absolute inset-0 rounded-xl ring-2 ring-primary/30 ring-offset-1 ring-offset-card" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
