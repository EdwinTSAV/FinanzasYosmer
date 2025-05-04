
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Target, Edit, TrendingUp, TrendingDown, Utensils, ShoppingBag, Loader2 } from 'lucide-react';
import { BUDGET_TYPES } from '@/lib/constants';

function BudgetCard({
  title,
  icon,
  budgetType,
  budgetAmount,
  spentAmount,
  isEditing,
  tempAmount,
  onEditClick, // Changed name for clarity
  // onCancelClick, // Removed, handled by onEditClick(false)
  onSaveClick,
  onTempChange
}) {
  const remaining = budgetAmount - spentAmount;
  return (
     <motion.div
       initial={{ opacity: 0, scale: 0.9 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ duration: 0.5 }}
     >
      <Card className="shadow-xl border-none bg-card/80 backdrop-blur-sm h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            {icon} {title}
          </CardTitle>
          {!isEditing && (
            <Button variant="ghost" size="icon" onClick={() => onEditClick(budgetType, true)}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          {isEditing ? (
            <div className="flex items-center space-x-2 mt-2">
              <Label htmlFor={`budget-input-${budgetType}`} className="sr-only">Presupuesto</Label>
              <Input
                id={`budget-input-${budgetType}`}
                type="number"
                value={tempAmount}
                onChange={(e) => onTempChange(budgetType, e.target.value)}
                placeholder="Ej: 500"
                className="flex-grow"
              />
              <Button size="sm" onClick={() => onSaveClick(budgetType)}>Guardar</Button>
              <Button size="sm" variant="outline" onClick={() => onEditClick(budgetType, false)}>Cancelar</Button>
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold text-primary">S/ {(Number(budgetAmount) || 0).toFixed(2)}</p>
              <CardDescription className="text-xs">Presupuesto mensual</CardDescription>
            </>
          )}
        </CardContent>
         {(Number(budgetAmount) || 0) > 0 && !isEditing && (
            <CardFooter className="flex flex-col items-start pt-4 border-t">
                 <p className="text-sm font-medium">Gastado: <span className="text-red-600">S/ {(Number(spentAmount) || 0).toFixed(2)}</span></p>
                 <p className={`text-sm font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                   Restante: S/ {remaining.toFixed(2)}
                 </p>
            </CardFooter>
         )}
      </Card>
     </motion.div>
  );
}


function SummaryCards({
  balance,
  budgets,
  currentMonthIncome,
  currentMonthFoodExpenses,
  currentMonthMiscExpenses,
  isEditing,
  tempBudgets,
  onEditBudgetToggle, // Renamed prop
  onTempBudgetChange,
  onBudgetSave,
}) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="shadow-xl border-none bg-card/80 backdrop-blur-sm h-full flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-xl text-center font-semibold">Balance General</CardTitle>
          </CardHeader>
          <CardContent className="text-center flex-grow flex items-center justify-center">
            <p className={`text-4xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              S/ {(Number(balance) || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly Stats Card */}
       <motion.div
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.5, delay: 0.2 }}
       >
         <Card className="shadow-xl border-none bg-card/80 backdrop-blur-sm h-full flex flex-col">
           <CardHeader className="pb-2">
             <CardTitle className="text-lg font-semibold flex items-center">
               <TrendingDown className="mr-2 h-5 w-5 text-red-500" /> Gastos Totales (Mes)
             </CardTitle>
           </CardHeader>
           <CardContent className="flex-grow">
             <p className="text-3xl font-bold text-red-600">S/ {(Number(currentMonthFoodExpenses + currentMonthMiscExpenses) || 0).toFixed(2)}</p>
             <CardDescription className="text-xs mt-1">Total gastado este mes.</CardDescription>
           </CardContent>
           <CardFooter className="flex flex-col items-start pt-4 border-t">
              <p className="text-sm font-medium flex items-center">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500"/> Ingresos del mes: <span className="text-green-600 ml-1">S/ {(Number(currentMonthIncome) || 0).toFixed(2)}</span>
              </p>
           </CardFooter>
         </Card>
       </motion.div>

       {/* Food Budget Card */}
        <BudgetCard
           title="Ppto. Alimentación"
           icon={<Utensils className="mr-2 h-5 w-5 text-orange-500" />}
           budgetType={BUDGET_TYPES.FOOD}
           budgetAmount={budgets[BUDGET_TYPES.FOOD]}
           spentAmount={currentMonthFoodExpenses}
           isEditing={isEditing[BUDGET_TYPES.FOOD]}
           tempAmount={tempBudgets[BUDGET_TYPES.FOOD]}
           onEditClick={onEditBudgetToggle}
           onSaveClick={onBudgetSave}
           onTempChange={onTempBudgetChange}
        />

        {/* Misc Budget Card */}
        <BudgetCard
           title="Ppto. Gastos Diversos"
           icon={<ShoppingBag className="mr-2 h-5 w-5 text-indigo-500" />}
           budgetType={BUDGET_TYPES.MISC}
           budgetAmount={budgets[BUDGET_TYPES.MISC]}
           spentAmount={currentMonthMiscExpenses}
           isEditing={isEditing[BUDGET_TYPES.MISC]}
           tempAmount={tempBudgets[BUDGET_TYPES.MISC]}
           onEditClick={onEditBudgetToggle}
           onSaveClick={onBudgetSave}
           onTempChange={onTempBudgetChange}
        />

    </div>
  );
}

export default SummaryCards;
