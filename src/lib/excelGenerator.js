
import * as XLSX from 'xlsx';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { getCategoryDetails } from '@/lib/constants';

export const generateTransactionsExcel = (transactions) => {
  if (!transactions || transactions.length === 0) {
    console.warn("No transactions data to export.");
    // Optionally show a toast message to the user
    return;
  }

  // Prepare data for Excel sheet
  const dataForExcel = transactions.map(t => {
    const categoryDetails = t.type === 'expense' ? getCategoryDetails(t.category) : null;
    const amount = Number(t.amount) || 0;
    const formattedDate = format(parseISO(t.date), "dd/MM/yyyy", { locale: es });

    return {
      'Tipo': t.type === 'income' ? 'Ingreso' : 'Gasto',
      'Nota': t.note,
      'Categoría': categoryDetails ? categoryDetails.label : '-',
      'Método de Pago': t.payment_method,
      'Fecha': formattedDate, // Use formatted date
      'Monto (S/)': amount,
    };
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

  // Optional: Adjust column widths (example)
  worksheet['!cols'] = [
    { wch: 10 }, // Tipo
    { wch: 30 }, // Nota
    { wch: 20 }, // Categoría
    { wch: 20 }, // Método de Pago
    { wch: 12 }, // Fecha
    { wch: 15 }, // Monto
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transacciones');

  // Generate filename with current date
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  const filename = `Reporte_Transacciones_${dateStr}.xlsx`;

  // Trigger download
  XLSX.writeFile(workbook, filename);
};
