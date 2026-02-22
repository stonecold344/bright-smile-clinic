import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format, setMonth, setYear } from "date-fns";
import { he } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const MONTHS_HE = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const [pickerView, setPickerView] = React.useState<"days" | "months" | "years">("days");
  const [viewDate, setViewDate] = React.useState(() => {
    if (props.selected && props.selected instanceof Date) return props.selected;
    return new Date();
  });

  // Year range for year picker
  const currentYear = new Date().getFullYear();
  const yearStart = currentYear - 10;
  const yearEnd = currentYear + 10;
  const years = Array.from({ length: yearEnd - yearStart + 1 }, (_, i) => yearStart + i);

  const handleMonthSelect = (monthIndex: number) => {
    setViewDate(prev => setMonth(prev, monthIndex));
    setPickerView("days");
  };

  const handleYearSelect = (year: number) => {
    setViewDate(prev => setYear(prev, year));
    setPickerView("months");
  };

  if (pickerView === "years") {
    return (
      <div className={cn("p-3", className)} style={{ minWidth: 280 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <button
            type="button"
            onClick={() => setPickerView("days")}
            style={{
              fontSize: 14, fontWeight: 600, cursor: "pointer", background: "none",
              color: "hsl(var(--foreground, 0 0% 10%))", padding: "4px 8px", borderRadius: 6,
              border: "none",
            }}
          >
            בחר שנה
          </button>
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6,
          maxHeight: 240, overflowY: "auto",
        }}>
          {years.map(year => (
            <button
              key={year}
              type="button"
              onClick={() => handleYearSelect(year)}
              style={{
                padding: "8px 4px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                cursor: "pointer", border: "none", transition: "all 0.15s",
                background: viewDate.getFullYear() === year
                  ? "hsl(var(--primary, 210 80% 50%))"
                  : "transparent",
                color: viewDate.getFullYear() === year
                  ? "hsl(var(--primary-foreground, 0 0% 100%))"
                  : "hsl(var(--foreground, 0 0% 10%))",
              }}
              onMouseEnter={e => {
                if (viewDate.getFullYear() !== year)
                  (e.target as HTMLElement).style.background = "hsl(var(--accent, 210 40% 96%))";
              }}
              onMouseLeave={e => {
                if (viewDate.getFullYear() !== year)
                  (e.target as HTMLElement).style.background = "transparent";
              }}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (pickerView === "months") {
    return (
      <div className={cn("p-3", className)} style={{ minWidth: 280 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <button
            type="button"
            onClick={() => setPickerView("years")}
            style={{
              fontSize: 14, fontWeight: 600, cursor: "pointer", background: "none",
              color: "hsl(var(--foreground, 0 0% 10%))", padding: "4px 8px", borderRadius: 6,
              border: "none", textDecoration: "underline", textUnderlineOffset: 3,
            }}
          >
            {viewDate.getFullYear()}
          </button>
          <button
            type="button"
            onClick={() => setPickerView("days")}
            style={{
              fontSize: 12, cursor: "pointer", background: "none", border: "none",
              color: "hsl(var(--muted-foreground, 0 0% 50%))",
            }}
          >
            חזרה
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {MONTHS_HE.map((month, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleMonthSelect(i)}
              style={{
                padding: "10px 4px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                cursor: "pointer", border: "none", transition: "all 0.15s",
                background: viewDate.getMonth() === i
                  ? "hsl(var(--primary, 210 80% 50%))"
                  : "transparent",
                color: viewDate.getMonth() === i
                  ? "hsl(var(--primary-foreground, 0 0% 100%))"
                  : "hsl(var(--foreground, 0 0% 10%))",
              }}
              onMouseEnter={e => {
                if (viewDate.getMonth() !== i)
                  (e.target as HTMLElement).style.background = "hsl(var(--accent, 210 40% 96%))";
              }}
              onMouseLeave={e => {
                if (viewDate.getMonth() !== i)
                  (e.target as HTMLElement).style.background = "transparent";
              }}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      month={viewDate}
      onMonthChange={setViewDate}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium cursor-pointer hover:underline",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        CaptionLabel: ({ displayMonth }) => (
          <button
            type="button"
            onClick={() => setPickerView("months")}
            style={{
              cursor: "pointer", background: "none", border: "none",
              fontSize: 14, fontWeight: 600,
              color: "hsl(var(--foreground, 0 0% 10%))",
              textDecoration: "underline", textUnderlineOffset: 3,
            }}
          >
            {format(displayMonth, "MMMM yyyy", { locale: he })}
          </button>
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
