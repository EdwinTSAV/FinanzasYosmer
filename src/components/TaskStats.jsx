
import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle2, Clock, AlertTriangle, PlayCircle } from "lucide-react";

function TaskStats({ tasks }) {
  const stats = {
    completed: tasks.filter(task => task.status === "completed").length,
    inProgress: tasks.filter(task => task.status === "in-progress").length,
    pending: tasks.filter(task => task.status === "pending").length,
    delayed: tasks.filter(task => task.status === "delayed").length
  };

  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((stats.completed / totalTasks) * 100) : 0;

  const statCards = [
    {
      title: "Completadas",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "En Progreso",
      value: stats.inProgress,
      icon: PlayCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Pendientes",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Retrasadas",
      value: stats.delayed,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="stats-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
            <div className={`${stat.bgColor} ${stat.color} p-3 rounded-full`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${stat.bgColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${(stat.value / totalTasks) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default TaskStats;
