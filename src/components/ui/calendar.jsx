import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday } from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function Calendar({ mode = "single", selected, onSelect, locale = ko, className, ...props }) {
  const [currentMonth, setCurrentMonth] = React.useState(selected ? new Date(selected) : new Date());

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          {format(currentMonth, "yyyy년 M월", { locale })}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale });
    const endDate = endOfWeek(monthEnd, { locale });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isSelected = selected && isSameDay(day, new Date(selected));
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isTodayDate = isToday(day);

        days.push(
          <Button
            key={day.toString()}
            variant="ghost"
            className={cn(
              "h-9 w-9 p-0 font-normal",
              !isCurrentMonth && "text-gray-400 opacity-50",
              isSelected && "!bg-[#3b82f6] !text-white !font-semibold hover:!bg-[#3b82f6]",
              !isSelected && "hover:bg-gray-100"
            )}
            onClick={() => {
              if (isCurrentMonth) {
                onSelect(cloneDay);
              }
            }}
          >
            {format(day, "d")}
          </Button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className={cn("p-3", className)} {...props}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}

Calendar.displayName = "Calendar"

export { Calendar }