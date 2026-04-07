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
  setYear as setDateYear,
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

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const shellStyle: React.CSSProperties = {
    width: "300px",
    maxWidth: "92vw",
    padding: "16px",
    borderRadius: "16px",
    background: "#fff",
    border: "1px solid hsl(200, 20%, 90%)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    direction: "rtl",
    fontFamily: "Heebo, sans-serif",
    pointerEvents: "auto",
    userSelect: "none",
  };

  // Year picker
  if (showYears) {
    return (
      <div style={shellStyle} className={className}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "hsl(200,50%,15%)" }}>בחירת שנה</span>
          <button
            type="button"
            onClick={() => { setShowYears(false); setShowMonths(true); }}
            style={{ fontSize: 12, color: "hsl(200,15%,45%)", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 8 }}
          >
            חזרה
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, maxHeight: 240, overflowY: "auto" }}>
          {years.map(y => (
            <button
              key={y}
              type="button"
              onClick={() => { setViewDate(prev => setDateYear(prev, y)); setShowYears(false); setShowMonths(true); }}
              style={{
                padding: "10px 0",
                borderRadius: 12,
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                background: viewDate.getFullYear() === y ? "hsl(174,62%,45%)" : "hsl(200,40%,96%)",
                color: viewDate.getFullYear() === y ? "#fff" : "hsl(200,50%,15%)",
                boxShadow: viewDate.getFullYear() === y ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
              }}
            >
              {y}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Month picker
  if (showMonths) {
    return (
      <div style={shellStyle} className={className}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <button
            type="button"
            onClick={() => setShowYears(true)}
            style={{ fontSize: 14, fontWeight: 700, color: "hsl(200,50%,15%)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
          >
            {viewDate.getFullYear()}
          </button>
          <button
            type="button"
            onClick={() => setShowMonths(false)}
            style={{ fontSize: 12, color: "hsl(200,15%,45%)", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 8 }}
          >
            חזרה
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
          {MONTHS_HE.map((m, idx) => (
            <button
              key={m}
              type="button"
              onClick={() => { setViewDate(prev => setDateMonth(prev, idx)); setShowMonths(false); }}
              style={{
                padding: "12px 0",
                borderRadius: 12,
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                background: viewDate.getMonth() === idx ? "hsl(174,62%,45%)" : "hsl(200,40%,96%)",
                color: viewDate.getMonth() === idx ? "#fff" : "hsl(200,50%,15%)",
                boxShadow: viewDate.getMonth() === idx ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Main calendar view
  const cellSize = 36;

  return (
    <div style={shellStyle} className={className}>
      {/* Header row: right arrow | month label | left arrow */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => setViewDate(prev => subMonths(prev, 1))}
          style={{
            width: 32, height: 32, borderRadius: "50%", border: "1px solid hsl(200,20%,90%)",
            background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s", color: "hsl(200,15%,45%)",
          }}
        >
          <ChevronRight style={{ width: 16, height: 16 }} />
        </button>

        <button
          type="button"
          onClick={() => setShowMonths(true)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 15, fontWeight: 700, color: "hsl(174,62%,45%)",
            padding: "4px 12px", borderRadius: 10, transition: "all 0.2s",
          }}
        >
          {format(viewDate, "MMMM yyyy", { locale: he })}
        </button>

        <button
          type="button"
          onClick={() => setViewDate(prev => addMonths(prev, 1))}
          style={{
            width: 32, height: 32, borderRadius: "50%", border: "1px solid hsl(200,20%,90%)",
            background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s", color: "hsl(200,15%,45%)",
          }}
        >
          <ChevronLeft style={{ width: 16, height: 16 }} />
        </button>
      </div>

      {/* Day names header */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
        {DAY_NAMES.map(d => (
          <div key={d} style={{
            textAlign: "center", fontSize: 11, fontWeight: 600,
            color: "hsl(200,15%,45%)", padding: "4px 0",
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Weeks grid */}
      {weeks.map((week, wi) => (
        <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {week.map((d, di) => {
            const inMonth = isSameMonth(d, viewDate);
            const sel = selected && isSameDay(d, selected);
            const today = isToday(d);
            const dis = disabled?.(d);

            return (
              <div key={di} style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "2px 0" }}>
                <button
                  type="button"
                  disabled={dis}
                  onClick={() => {
                    if (!dis && onSelect) onSelect(sel ? undefined : d);
                  }}
                  style={{
                    position: "relative",
                    width: cellSize,
                    height: cellSize,
                    borderRadius: 10,
                    border: today && !sel ? "2px solid hsl(174,62%,45%)" : "2px solid transparent",
                    background: sel ? "hsl(174,62%,45%)" : "transparent",
                    color: sel ? "#fff" : !inMonth ? "hsl(200,15%,80%)" : dis ? "hsl(200,15%,80%)" : "hsl(200,50%,15%)",
                    fontSize: 13,
                    fontWeight: sel || today ? 700 : 500,
                    cursor: dis ? "not-allowed" : "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: sel ? "0 2px 8px hsla(174,62%,45%,0.35)" : "none",
                    fontFamily: "inherit",
                  }}
                >
                  {d.getDate()}
                  {/* Today dot indicator */}
                  {today && !sel && (
                    <span style={{
                      position: "absolute",
                      bottom: 3,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: "hsl(174,62%,45%)",
                    }} />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
