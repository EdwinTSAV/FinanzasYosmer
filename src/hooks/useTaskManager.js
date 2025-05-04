
import { useState, useEffect } from "react";
import { parseISO, isAfter } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export function useTaskManager() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const checkTasksStatus = () => {
      const now = new Date();
      let updated = false;
      const newTasks = tasks.map(task => {
        let taskUpdated = false;
        let newTask = { ...task };

        if (newTask.status !== "completed" && newTask.status !== "delayed") {
          const taskDate = parseISO(newTask.date);
          if (isAfter(now, taskDate)) {
            newTask.status = "delayed";
            taskUpdated = true;
            toast({
              title: "¡Tarea Retrasada!",
              description: `La tarea "${newTask.title}" ha pasado su fecha límite`,
              duration: 4000,
              variant: "destructive"
            });
          }
        }

        if (newTask.reminder && !newTask.reminderShown) {
          const reminderTime = parseISO(newTask.reminder);
          if (isAfter(now, reminderTime)) {
            const audio = new Audio("/notification.mp3");
            audio.play();
            newTask.reminderShown = true;
            taskUpdated = true;
            toast({
              title: "¡Recordatorio!",
              description: newTask.title,
              duration: 4000,
            });
          }
        }
        if (taskUpdated) updated = true;
        return newTask;
      });

      if (updated) {
        setTasks(newTasks);
      }
    };

    const interval = setInterval(checkTasksStatus, 60000);
    checkTasksStatus();

    return () => clearInterval(interval);
  }, [tasks, toast]);

  const addTask = (task) => {
    setTasks(prev => [...prev, { ...task, id: Date.now() }]);
    toast({
      title: "Tarea creada",
      description: "La tarea se ha creado exitosamente",
      duration: 4000,
    });
  };

  const editTask = (updatedTask) => {
    setTasks(prev => prev.map(t => 
      t.id === updatedTask.id ? updatedTask : t
    ));
    toast({
      title: "Tarea actualizada",
      description: "La tarea se ha actualizado exitosamente",
      duration: 4000,
    });
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Tarea eliminada",
      description: "La tarea se ha eliminado exitosamente",
      duration: 4000,
      variant: "destructive"
    });
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return {
    tasks,
    addTask,
    editTask,
    deleteTask,
    updateTaskStatus,
  };
}
