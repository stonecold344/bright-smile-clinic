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
      <div className={cn("p-3 pointer-events-auto w-full max-w-[320px] mx-auto", className)} dir="rtl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-foreground">בחר שנה</span>
          <button
            type="button"
            onClick={() => setPickerView("days")}
            className="text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-accent"
          >
            חזרה ←
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1.5 max-h-[200px] overflow-y-auto">
          {years.map(year => (
            <button
              key={year}
              type="button"
              onClick={() => handleYearSelect(year)}
              className={cn(
                "py-2 rounded-lg text-xs font-semibold transition-all",
                viewDate.getFullYear() === year
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              )}
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
      <div className={cn("p-3 pointer-events-auto w-full max-w-[320px] mx-auto", className)} dir="rtl">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => setPickerView("years")}
            className="text-sm font-bold text-foreground underline underline-offset-4 hover:text-primary transition-colors"
          >
            {viewDate.getFullYear()}
          </button>
          <button
            type="button"
            onClick={() => setPickerView("days")}
            className="text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-accent"
          >
            חזרה ←
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {MONTHS_HE.map((month, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleMonthSelect(i)}
              className={cn(
                "py-2 px-1 rounded-lg text-xs font-semibold transition-all",
                viewDate.getMonth() === i
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              )}
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
      dir="rtl"
      locale={he}
      showOutsideDays={showOutsideDays}
      month={viewDate}
      onMonthChange={setViewDate}
      className={cn("p-3 pointer-events-auto w-full max-w-[320px] mx-auto", className)}
      classNames={{
        months: "flex flex-col w-full",
        month: "w-full",
        caption: "flex justify-center pt-1 pb-2 relative items-center",
        caption_label: "text-sm font-bold cursor-pointer hover:text-primary transition-colors",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100 hover:bg-accent transition-all",
        ),
        nav_button_previous: "absolute left-0",
        nav_button_next: "absolute right-0",
        table: "w-full border-collapse",
        head_row: "flex w-full",
        head_cell: "text-muted-foreground flex-1 font-medium text-[11px] text-center py-1",
        row: "flex w-full",
        cell: cn(
          "flex-1 text-center p-px relative",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "[&:has([aria-selected].day-outside)]:bg-accent/50",
          "[&:has([aria-selected])]:bg-accent",
          "first:[&:has([aria-selected])]:rounded-l-md",
          "last:[&:has([aria-selected])]:rounded-r-md",
          "focus-within:relative focus-within:z-20"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-full p-0 text-xs font-medium aria-selected:opacity-100 rounded-lg"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground font-bold ring-1 ring-primary/30",
        day_outside:
          "day-outside text-muted-foreground opacity-40 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-40",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-3.5 w-3.5" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-3.5 w-3.5" />,
        CaptionLabel: ({ displayMonth }) => (
          <button
            type="button"
            onClick={() => setPickerView("months")}
            className="cursor-pointer bg-transparent border-none text-sm font-bold text-foreground underline underline-offset-4 hover:text-primary transition-colors"
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
