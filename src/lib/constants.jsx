
import React from 'react';
import { ShoppingCart, SprayCan, Utensils, Package, HelpCircle, School, Home, User } from 'lucide-react';

export const BUDGET_TYPES = {
  FOOD: 'Alimentación',
  MISC: 'Gastos Diversos',
};

export const expenseCategories = [
  { value: 'Alimentación', label: 'Alimentación', icon: <Utensils className="h-4 w-4 mr-2" />, budgetType: BUDGET_TYPES.FOOD },
  { value: 'Útiles de aseo', label: 'Útiles de aseo', icon: <SprayCan className="h-4 w-4 mr-2" />, budgetType: BUDGET_TYPES.FOOD }, // Changed to FOOD
  { value: 'Pedidos por delivery', label: 'Pedidos por delivery', icon: <Package className="h-4 w-4 mr-2" />, budgetType: BUDGET_TYPES.FOOD }, // Changed to FOOD
  { value: 'Compras', label: 'Compras', icon: <ShoppingCart className="h-4 w-4 mr-2" />, budgetType: BUDGET_TYPES.MISC },
  { value: 'Colegio', label: 'Colegio', icon: <School className="h-4 w-4 mr-2" />, budgetType: BUDGET_TYPES.MISC },
  { value: 'Casa', label: 'Casa', icon: <Home className="h-4 w-4 mr-2" />, budgetType: BUDGET_TYPES.MISC },
  { value: 'Propios', label: 'Propios', icon: <User className="h-4 w-4 mr-2" />, budgetType: BUDGET_TYPES.MISC },
  { value: 'Otros', label: 'Otros', icon: <HelpCircle className="h-4 w-4 mr-2" />, budgetType: BUDGET_TYPES.MISC },
];

export const getCategoryDetails = (categoryValue) => {
  const category = expenseCategories.find(cat => cat.value === categoryValue);
  // Ensure default still exists for potential old/uncategorized data
  return category || { value: categoryValue, label: categoryValue, icon: <HelpCircle className="h-4 w-4 text-gray-500" />, budgetType: BUDGET_TYPES.MISC };
};
