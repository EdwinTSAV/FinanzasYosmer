
import React from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, ArrowDownCircle, CreditCard, Smartphone, Banknote, HelpCircle, Edit, Trash2 } from 'lucide-react';
import { getCategoryDetails } from '@/lib/constants';

function TransactionList({ transactions, onEdit, onDelete }) {

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'Transferencia': return <Banknote className="h-4 w-4 text-blue-500" />;
      case 'Yape':
      case 'Plin': return <Smartphone className="h-4 w-4 text-purple-500" />;
      case 'Efectivo': return <Banknote className="h-4 w-4 text-green-500" />;
      case 'Tarjeta Crédito':
      case 'Tarjeta Débito': return <CreditCard className="h-4 w-4 text-orange-500" />;
      default: return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Sorting is now handled within the hook after fetching/updating

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="shadow-lg border-none bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No hay transacciones registradas aún.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nota</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Monto (S/)</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                   const categoryDetails = transaction.type === 'expense' ? getCategoryDetails(transaction.category) : null;
                   const amount = Number(transaction.amount) || 0; // Ensure amount is a number
                   return (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {transaction.type === 'income' ? (
                            <ArrowUpCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <ArrowDownCircle className="h-5 w-5 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{transaction.note}</TableCell>
                        <TableCell>
                          {categoryDetails ? (
                            <div className="flex items-center gap-1">
                               {categoryDetails.icon}
                               <span className="text-xs text-muted-foreground">{categoryDetails.label}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="flex items-center gap-1">
                          {getPaymentMethodIcon(transaction.payment_method)}
                          <span className="text-xs text-muted-foreground">{transaction.payment_method}</span>
                         </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {/* Use parseISO since dates from hook are ISO strings */}
                          {format(parseISO(transaction.date), "dd MMM yyyy", { locale: es })}
                        </TableCell>
                        <TableCell className={`text-right font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'} {amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center space-x-1">
                           <Button variant="ghost" size="icon" onClick={() => onEdit(transaction)}>
                             <Edit className="h-4 w-4" />
                           </Button>
                           <Button variant="ghost" size="icon" onClick={() => onDelete(transaction)}>
                             <Trash2 className="h-4 w-4 text-destructive" />
                           </Button>
                        </TableCell>
                      </TableRow>
                   );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default TransactionList;
