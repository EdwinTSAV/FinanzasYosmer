
import React from "react";
import { motion } from "framer-motion";
import { format, addMonths, subMonths, parseISO, isSameMonth } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function TaskBoard({ tasks, currentDate, onMonthChange, onUpdateStatus }) {
  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "task-status-pending";
      case "in-progress":
        return "task-status-in-progress";
      case "completed":
        return "task-status-completed";
      case "delayed":
        return "task-status-delayed";
      default:
        return "";
    }
  };

  const monthTasks = tasks.filter(task => 
    isSameMonth(parseISO(task.date), currentDate)
  );

  return (
    <div className="bg-card rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          {format(currentDate, "MMMM yyyy", { locale: es })}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onMonthChange(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onMonthChange(addMonths(currentDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="calendar-grid">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div key={day} className="p-2 text-center font-semibold text-xs">
            {day}
          </div>
        ))}
        {Array.from({ length: parseISO(format(currentDate, "yyyy-MM-01")).getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day" />
        ))}
        {Array.from({ length: 31 }).map((_, i) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
          if (date.getMonth() !== currentDate.getMonth()) return null;

          const dayTasks = monthTasks.filter(task => 
            format(parseISO(task.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
          );

          return (
            <div
              key={date.toISOString()}
              className="calendar-day overflow-hidden"
            >
              <div className="text-xs mb-1">{format(date, "d")}</div>
              <div className="space-y-1">
                {dayTasks.map(task => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative"
                  >
                    <div
                      className={`text-[0.65rem] p-1 rounded ${getStatusClass(task.status)} truncate`}
                    >
                      {task.title}
                    </div>
                    <select
                      value={task.status}
                      onChange={(e) => onUpdateStatus(task.id, e.target.value)}
                      className={`absolute right-0 top-0 text-[0.65rem] cursor-pointer opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity ${getStatusClass(
                        task.status
                      )}`}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="in-progress">En Progreso</option>
                      <option value="completed">Completado</option>
                      <option value="delayed">Retrasado</option>
                    </select>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TaskBoard;
