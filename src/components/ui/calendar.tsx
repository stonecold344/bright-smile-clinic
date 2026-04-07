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

const calendarShellClassName = "pointer-events-auto w-full max-w-[22rem] mx-auto rounded-[1.25rem] border border-border bg-background p-3 shadow-xl";

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
    setViewDate((prev) => setMonth(prev, monthIndex));
    setPickerView("days");
  };

  const handleYearSelect = (year: number) => {
    setViewDate((prev) => setYear(prev, year));
    setPickerView("months");
  };

  if (pickerView === "years") {
    return (
      <div className={cn(calendarShellClassName, className)} dir="rtl">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">בחירת שנה</span>
          <button
            type="button"
            onClick={() => setPickerView("days")}
            className="rounded-full px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            חזרה
          </button>
        </div>

        <div className="grid max-h-[14rem] grid-cols-4 gap-2 overflow-y-auto pr-1">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => handleYearSelect(year)}
              className={cn(
                "rounded-xl px-2 py-3 text-xs font-semibold transition-all duration-200 active:scale-95",
                viewDate.getFullYear() === year
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-foreground hover:bg-accent hover:text-accent-foreground"
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
      <div className={cn(calendarShellClassName, className)} dir="rtl">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPickerView("years")}
            className="text-sm font-bold text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            {viewDate.getFullYear()}
          </button>
          <button
            type="button"
            onClick={() => setPickerView("days")}
            className="rounded-full px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            חזרה
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {MONTHS_HE.map((month, index) => (
            <button
              key={month}
              type="button"
              onClick={() => handleMonthSelect(index)}
              className={cn(
                "rounded-2xl px-2 py-3 text-xs font-semibold transition-all duration-200 active:scale-95",
                viewDate.getMonth() === index
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-foreground hover:bg-accent hover:text-accent-foreground"
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
      fixedWeeks
      month={viewDate}
      onMonthChange={setViewDate}
      className={cn(calendarShellClassName, className)}
      classNames={{
        months: "w-full",
        month: "w-full",
        caption: "relative mb-2 flex h-10 items-center justify-center",
        caption_label: "text-sm font-bold text-foreground",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "flex h-9 w-9 items-center justify-center rounded-full border-border bg-background p-0 text-foreground shadow-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground active:scale-95"
        ),
        nav_button_previous: "!absolute right-0 top-0",
        nav_button_next: "!absolute left-0 top-0",
        table: "w-full table-fixed border-separate border-spacing-y-1.5",
        head_row: "",
        head_cell: "pb-1 text-center text-[0.72rem] font-semibold text-muted-foreground",
        row: "",
        cell: "p-0 text-center align-middle",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "flex h-10 w-10 mx-auto items-center justify-center rounded-xl p-0 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground active:scale-95"
        ),
        day_selected: "bg-primary text-primary-foreground shadow-md hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "border border-primary/30 bg-accent/20 text-foreground",
        day_outside: "text-muted-foreground opacity-35",
        day_disabled: "text-muted-foreground opacity-25",
        day_range_middle: "bg-accent text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        CaptionLabel: ({ displayMonth }) => (
          <button
            type="button"
            onClick={() => setPickerView("months")}
            className="rounded-full px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-secondary hover:text-primary"
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
