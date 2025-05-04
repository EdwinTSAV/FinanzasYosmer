
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { BUDGET_TYPES } from '@/lib/constants';

const BUDGET_STORAGE_KEY = 'budgets_data';

export function useBudget() {
  const [budgets, setBudgets] = useState(() => {
    const defaultBudgets = {
        [BUDGET_TYPES.FOOD]: 0,
        [BUDGET_TYPES.MISC]: 0,
    };
    try {
      const savedBudgets = localStorage.getItem(BUDGET_STORAGE_KEY);
      return savedBudgets ? { ...defaultBudgets, ...JSON.parse(savedBudgets) } : defaultBudgets;
    } catch (error) {
      console.error("Error loading budgets from localStorage:", error);
      return defaultBudgets;
    }
  });

  const [isEditing, setIsEditing] = useState({
    [BUDGET_TYPES.FOOD]: false,
    [BUDGET_TYPES.MISC]: false,
  });
  const [tempBudgets, setTempBudgets] = useState({
     [BUDGET_TYPES.FOOD]: budgets[BUDGET_TYPES.FOOD].toString(),
     [BUDGET_TYPES.MISC]: budgets[BUDGET_TYPES.MISC].toString(),
  });
  const { toast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgets));
    } catch (error) {
      console.error("Error saving budgets to localStorage:", error);
      toast({
        title: "Error al guardar presupuestos",
        description: "No se pudieron guardar los presupuestos localmente.",
        variant: "destructive",
      });
    }
     // Update tempBudgets whenever budgets change from external source (though less likely with localStorage)
     setTempBudgets({
         [BUDGET_TYPES.FOOD]: budgets[BUDGET_TYPES.FOOD].toString(),
         [BUDGET_TYPES.MISC]: budgets[BUDGET_TYPES.MISC].toString(),
     });
  }, [budgets, toast]);


  const handleEditToggle = useCallback((budgetType, editState) => {
    setIsEditing(prev => ({ ...prev, [budgetType]: editState }));
    if (!editState) {
       // Reset temp value if cancelling edit
       setTempBudgets(prev => ({ ...prev, [budgetType]: budgets[budgetType].toString() }));
    }
  }, [budgets]);


  const handleTempBudgetChange = useCallback((budgetType, value) => {
    setTempBudgets(prev => ({ ...prev, [budgetType]: value }));
  }, []);

  const handleBudgetSave = useCallback((budgetType) => {
    const tempValue = tempBudgets[budgetType];
    const newBudgetAmount = parseFloat(tempValue);

    if (isNaN(newBudgetAmount) || newBudgetAmount < 0) {
       toast({
         title: "Error",
         description: "Por favor, ingresa un monto de presupuesto válido.",
         variant: "destructive",
       });
       return;
    }

    setBudgets(prev => ({...prev, [budgetType]: newBudgetAmount}));
    handleEditToggle(budgetType, false);
    toast({
        title: `Presupuesto de ${budgetType} actualizado`,
        description: `Tu presupuesto mensual es ahora S/ ${newBudgetAmount.toFixed(2)}`,
    });

  }, [tempBudgets, handleEditToggle, toast]);


  return {
    budgets,
    loading: false, // No loading state needed for localStorage
    isEditing,
    tempBudgets,
    handleEditToggle,
    handleTempBudgetChange,
    handleBudgetSave,
    // fetchBudgets is no longer needed
  };
}
