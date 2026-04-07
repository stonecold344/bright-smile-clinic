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

  const pickerWrapperClass = cn(
    "p-4 animate-in fade-in-0 zoom-in-95 duration-200",
    "w-full min-w-0",
    className
  );

  if (pickerView === "years") {
    return (
      <div className={pickerWrapperClass}>
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => setPickerView("days")}
            className="text-sm font-semibold text-foreground px-2 py-1 rounded-md hover:bg-accent transition-colors"
          >
            בחר שנה
          </button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-60 overflow-y-auto">
          {years.map(year => (
            <button
              key={year}
              type="button"
              onClick={() => handleYearSelect(year)}
              className={cn(
                "py-2.5 px-1 rounded-lg text-sm font-medium transition-all duration-150",
                "hover:bg-accent active:scale-95",
                viewDate.getFullYear() === year
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground"
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
      <div className={pickerWrapperClass}>
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => setPickerView("years")}
            className="text-sm font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors"
          >
            {viewDate.getFullYear()}
          </button>
          <button
            type="button"
            onClick={() => setPickerView("days")}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            חזרה
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {MONTHS_HE.map((month, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleMonthSelect(i)}
              className={cn(
                "py-3 px-2 rounded-lg text-sm font-medium transition-all duration-150",
                "hover:bg-accent active:scale-95",
                viewDate.getMonth() === i
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground"
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
      showOutsideDays={showOutsideDays}
      month={viewDate}
      onMonthChange={setViewDate}
      className={cn("p-3 pointer-events-auto w-full", className)}
      classNames={{
        months: "flex flex-col space-y-4 w-full",
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium cursor-pointer hover:underline",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 transition-all duration-150 active:scale-90",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex w-full",
        head_cell: "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] text-center",
        row: "flex w-full mt-1",
        cell: cn(
          "flex-1 text-center text-sm p-0.5 relative",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "[&:has([aria-selected].day-outside)]:bg-accent/50",
          "[&:has([aria-selected])]:bg-accent",
          "first:[&:has([aria-selected])]:rounded-l-md",
          "last:[&:has([aria-selected])]:rounded-r-md",
          "focus-within:relative focus-within:z-20"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-full p-0 font-normal aria-selected:opacity-100 transition-all duration-150 active:scale-90"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-sm",
        day_today: "bg-accent text-accent-foreground font-semibold",
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
            className="cursor-pointer bg-transparent border-none text-sm font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors"
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
