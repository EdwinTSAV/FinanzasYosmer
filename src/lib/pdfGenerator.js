
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { expenseCategories, BUDGET_TYPES, getCategoryDetails } from './constants'; // Import constants

export const generateMonthlySummaryPDF = (transactions, budgets) => {
  const doc = new jsPDF();
  const now = new Date();
  const monthName = format(now, 'MMMM yyyy', { locale: es });
  const startDate = startOfMonth(now);
  const endDate = endOfMonth(now);

  // Filter transactions for the current month
  const monthlyTransactions = transactions.filter(t =>
    isWithinInterval(parseISO(t.date), { start: startDate, end: endDate })
  );

  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryTotals = {};
  let foodExpenses = 0;
  let miscExpenses = 0;

  expenseCategories.forEach(cat => {
    categoryTotals[cat.value] = 0;
  });

  monthlyTransactions.forEach(t => {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else {
      totalExpenses += t.amount;
      const categoryDetails = getCategoryDetails(t.category);
       if (categoryTotals[categoryDetails.value] !== undefined) {
          categoryTotals[categoryDetails.value] += t.amount;
       }
      if (categoryDetails.budgetType === BUDGET_TYPES.FOOD) {
        foodExpenses += t.amount;
      } else {
        miscExpenses += t.amount;
      }
    }
  });

  // --- PDF Content ---
  doc.setFontSize(18);
  doc.text(`Resumen Financiero Mensual - ${monthName}`, 14, 22);

  doc.setFontSize(12);
  doc.text(`Balance General: S/ ${(totalIncome - totalExpenses).toFixed(2)}`, 14, 35);
  doc.text(`Ingresos Totales: S/ ${totalIncome.toFixed(2)}`, 14, 42);
  doc.text(`Gastos Totales: S/ ${totalExpenses.toFixed(2)}`, 14, 49);

  // Budget Summary
  doc.setFontSize(14);
  doc.text('Resumen de Presupuestos', 14, 65);
  doc.setFontSize(11);

  const foodBudget = budgets[BUDGET_TYPES.FOOD];
  const foodRemaining = foodBudget - foodExpenses;
  doc.text(`- Presupuesto Alimentación: S/ ${foodBudget.toFixed(2)}`, 16, 72);
  doc.text(`  Gastado: S/ ${foodExpenses.toFixed(2)}`, 20, 79);
  doc.text(`  Restante: S/ ${foodRemaining.toFixed(2)}`, 20, 86);

  const miscBudget = budgets[BUDGET_TYPES.MISC];
  const miscRemaining = miscBudget - miscExpenses;
   doc.text(`- Presupuesto Gastos Diversos: S/ ${miscBudget.toFixed(2)}`, 16, 96);
   doc.text(`  Gastado: S/ ${miscExpenses.toFixed(2)}`, 20, 103);
   doc.text(`  Restante: S/ ${miscRemaining.toFixed(2)}`, 20, 110);


  // Expense Breakdown by Category Table
  const tableColumn = ["Categoría", "Gasto Total (S/)"];
  const tableRows = [];

  Object.entries(categoryTotals)
    .filter(([, total]) => total > 0) // Only include categories with spending
    .sort(([, a], [, b]) => b - a) // Sort by amount descending
    .forEach(([category, total]) => {
       const categoryLabel = getCategoryDetails(category).label; // Get proper label
      tableRows.push([categoryLabel, total.toFixed(2)]);
    });

   if (tableRows.length > 0) {
       autoTable(doc, {
         startY: 125,
         head: [tableColumn],
         body: tableRows,
         headStyles: { fillColor: [22, 160, 133] }, // Theme color
         theme: 'grid'
       });
   } else {
       doc.text("No hay gastos registrados este mes.", 14, 125);
   }


  // Transaction Details Table (Optional - can make PDF long)
  // Add this section if you want detailed transactions
   const transactionColumns = ["Fecha", "Tipo", "Nota", "Categoría", "Método", "Monto (S/)"];
   const transactionRows = monthlyTransactions
      .sort((a, b) => parseISO(a.date) - parseISO(b.date)) // Sort by date asc
      .map(t => {
        const categoryLabel = t.type === 'expense' ? getCategoryDetails(t.category).label : '-';
        const amountPrefix = t.type === 'income' ? '+' : '-';
        return [
            format(parseISO(t.date), "dd/MM/yy"),
            t.type === 'income' ? 'Ingreso' : 'Gasto',
            t.note,
            categoryLabel,
            t.paymentMethod,
            `${amountPrefix} ${t.amount.toFixed(2)}`
        ];
   });

   if (transactionRows.length > 0) {
        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 15, // Position after previous table
          head: [transactionColumns],
          body: transactionRows,
          theme: 'striped',
          headStyles: { fillColor: [52, 73, 94] }, // Darker header
          columnStyles: { 5: { halign: 'right' } } // Align amount right
        });
   } else if (tableRows.length === 0) { // Only if no expenses table AND no transactions
        doc.text("No hay transacciones registradas este mes.", 14, 135);
   }


  doc.save(`resumen_financiero_${format(now, 'yyyy_MM')}.pdf`);
};
