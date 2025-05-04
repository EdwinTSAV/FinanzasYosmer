
import React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

function MonthlyCalendarView({ currentDate, tasks, selectedDate, onDateClick, onPrevMonth, onNextMonth }) {
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  return (
    <div className="bg-card rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          {format(currentDate, "MMMM yyyy", { locale: es })}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onPrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="calendar-grid">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div key={day} className="p-2 text-center font-semibold text-sm">
            {day}
          </div>
        ))}
        {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day" />
        ))}
        {daysInMonth.map((date) => (
          <motion.div
            key={date.toISOString()}
            className={`calendar-day ${
              isSameDay(date, new Date()) ? "today" : ""
            } ${selectedDate && isSameDay(date, selectedDate) ? "selected" : ""}`}
            onClick={() => onDateClick(date)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm">{format(date, "d")}</span>
            {tasks.some(task => isSameDay(parseISO(task.date), date)) && (
              <div className="absolute bottom-1 right-1 w-2 h-2 bg-primary rounded-full" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default MonthlyCalendarView;
