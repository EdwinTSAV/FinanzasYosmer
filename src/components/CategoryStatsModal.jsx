
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { expenseCategories, getCategoryDetails } from '@/lib/constants'; // Use updated helper
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function CategoryStatsModal({ isOpen, onClose, transactions }) {

  const calculateCategoryTotals = () => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const totals = {};

    // Initialize totals for all defined categories
    expenseCategories.forEach(cat => {
      totals[cat.value] = { total: 0, icon: cat.icon, label: cat.label };
    });

    transactions.forEach(t => {
      if (
        t.type === 'expense' &&
        t.category &&
        isWithinInterval(parseISO(t.date), { start, end })
      ) {
        if (totals[t.category]) { // Check if category exists in our defined list
          totals[t.category].total += t.amount;
        } else {
          // Optionally handle uncategorized or old categories if needed
          // e.g., create an 'Uncategorized' entry
        }
      }
    });

    // Convert to array and sort by amount descending
    return Object.entries(totals)
                 .map(([category, data]) => ({ category, ...data }))
                 .filter(item => item.total > 0) // Only show categories with spending
                 .sort((a, b) => b.total - a.total);
  };

  const categoryTotals = calculateCategoryTotals();
  const currentMonthName = format(new Date(), 'MMMM yyyy', { locale: es });


  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Estadísticas de Gastos por Categoría</DialogTitle>
          <DialogDescription>
            Resumen de gastos para {currentMonthName}.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="grid gap-4 py-4">
            {categoryTotals.length > 0 ? categoryTotals.map(({ category, total, icon, label }) => (
                <Card key={category} className="shadow-sm border bg-background/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                    <CardTitle className="text-sm font-medium flex items-center">
                      {icon}
                      <span className="ml-2">{label}</span>
                    </CardTitle>
                    <span className="text-lg font-bold text-red-600">
                      S/ {total.toFixed(2)}
                    </span>
                  </CardHeader>
                </Card>
            )) : (
              <p className="text-center text-muted-foreground py-4">No hay gastos registrados este mes.</p>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryStatsModal;
