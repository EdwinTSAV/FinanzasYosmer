
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parseISO } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { expenseCategories } from '@/lib/constants';

function TransactionModal({ isOpen, onClose, onAddTransaction, onUpdateTransaction, editingTransaction }) {
  const [type, setType] = useState('expense');
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Transferencia'); // Renamed internal state for clarity
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [category, setCategory] = useState(expenseCategories[0].value);
  const { toast } = useToast();

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setNote(editingTransaction.note);
      setAmount(Number(editingTransaction.amount).toString()); // Ensure it's a string for input value
      setPaymentMethod(editingTransaction.payment_method); // Match DB column name
      // Use parseISO since date from hook is ISO string
      setDate(format(parseISO(editingTransaction.date), 'yyyy-MM-dd'));
      setCategory(editingTransaction.category || expenseCategories[0].value);
    } else {
      // Reset to defaults when adding new
      setType('expense');
      setNote('');
      setAmount('');
      setPaymentMethod('Transferencia');
      setDate(format(new Date(), 'yyyy-MM-dd'));
      setCategory(expenseCategories[0].value);
    }
  }, [editingTransaction, isOpen]); // Rerun effect when modal opens or editing target changes

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!note || !amount || isNaN(parsedAmount) || parsedAmount <= 0 || !date || (type === 'expense' && !category)) {
       toast({
         title: "Error de validación",
         description: "Por favor, completa todos los campos correctamente, incluyendo la categoría para gastos.",
         variant: "destructive",
       });
      return;
    }

    const transactionData = {
        type,
        note,
        amount: parsedAmount,
        payment_method: paymentMethod, // Match DB column name
        // Convert date to ISO string (start of the day in UTC) before passing to hook
        date: new Date(date + 'T00:00:00Z').toISOString(),
        category: type === 'expense' ? category : null,
      };

    if (editingTransaction) {
        onUpdateTransaction({ ...transactionData, id: editingTransaction.id });
    } else {
        onAddTransaction(transactionData);
    }
    // No need to call onClose here, the hooks handle it on success
  };

  // Prevents modal closure on background click if needed, but default radix behavior is fine
  // const handleOpenChange = (open) => {
  //   if (!open) {
  //     onClose();
  //   }
  // }

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}> {/* Use onClose for Radix onOpenChange */}
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle>{editingTransaction ? 'Editar Transacción' : 'Añadir Nueva Transacción'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de Transacción</Label>
              <RadioGroup value={type} onValueChange={setType} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense">Gasto</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income">Ingreso</Label>
                </div>
              </RadioGroup>
            </div>
             <div className="space-y-2">
               <Label htmlFor="note">Nota</Label>
               <Input
                 id="note"
                 value={note}
                 onChange={(e) => setNote(e.target.value)}
                 placeholder="Ej: Compra supermercado"
                 required
               />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Monto (S/)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ej: 50.00"
                required
              />
            </div>
             <div className="space-y-2">
               <Label htmlFor="date">Fecha</Label>
               <Input
                 id="date"
                 type="date"
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
                 required
               />
             </div>
            <div className="space-y-2">
               <Label htmlFor="paymentMethod">Método de Pago</Label>
               <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                 <SelectTrigger id="paymentMethod">
                   <SelectValue placeholder="Selecciona un método" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="Transferencia">Transferencia</SelectItem>
                   <SelectItem value="Yape">Yape</SelectItem>
                   <SelectItem value="Plin">Plin</SelectItem>
                   <SelectItem value="Efectivo">Efectivo</SelectItem>
                   <SelectItem value="Tarjeta Crédito">Tarjeta Crédito</SelectItem>
                   <SelectItem value="Tarjeta Débito">Tarjeta Débito</SelectItem>
                   <SelectItem value="Otro">Otro</SelectItem>
                 </SelectContent>
               </Select>
             </div>
             {type === 'expense' && (
               <div className="space-y-2">
                 <Label htmlFor="category">Categoría de Gasto</Label>
                 <Select value={category} onValueChange={setCategory} required>
                   <SelectTrigger id="category">
                     <SelectValue placeholder="Selecciona una categoría" />
                   </SelectTrigger>
                   <SelectContent>
                     {expenseCategories.map((cat) => (
                       <SelectItem key={cat.value} value={cat.value}>
                         <div className="flex items-center">
                           {cat.icon}
                           {cat.label}
                         </div>
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
             )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
               <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">{editingTransaction ? 'Guardar Cambios' : 'Guardar Transacción'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TransactionModal;
