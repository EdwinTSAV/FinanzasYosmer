
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { getCategoryDetails, BUDGET_TYPES } from '@/lib/constants';

const TRANSACTIONS_STORAGE_KEY = 'transactions_data';

export function useTransactions() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const savedTransactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      return savedTransactions ? JSON.parse(savedTransactions) : [];
    } catch (error) {
      console.error("Error loading transactions from localStorage:", error);
      return [];
    }
  });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error("Error saving transactions to localStorage:", error);
      toast({
        title: "Error al guardar",
        description: "No se pudieron guardar las transacciones localmente.",
        variant: "destructive",
      });
    }
  }, [transactions, toast]);

  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      ...transaction,
      // Ensure amount is number, generate local ID
      amount: Number(transaction.amount),
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(), // Use crypto.randomUUID if available
    };

    setTransactions(prev =>
        [newTransaction, ...prev].sort((a, b) => parseISO(b.date) - parseISO(a.date))
    );
    toast({
      title: "Transacción añadida",
      description: "La nueva transacción ha sido registrada localmente.",
    });
    setIsModalOpen(false);
  }, [toast]);

  const updateTransaction = useCallback((updatedTransaction) => {
    const transactionData = {
        ...updatedTransaction,
        amount: Number(updatedTransaction.amount),
    };

    setTransactions(prev =>
        prev.map(t => (t.id === transactionData.id ? transactionData : t))
           .sort((a, b) => parseISO(b.date) - parseISO(a.date))
    );
    toast({
      title: "Transacción actualizada",
      description: "Los cambios en la transacción han sido guardados localmente.",
    });
    setIsModalOpen(false);
    setEditingTransaction(null);
  }, [toast]);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transacción eliminada",
      description: "La transacción ha sido eliminada localmente.",
    });
    setTransactionToDelete(null);
  }, [toast]);

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
  };

  const handleOpenModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const calculateBalance = () => {
    return transactions.reduce((acc, transaction) => {
      const amount = Number(transaction.amount) || 0;
      return transaction.type === 'income' ? acc + amount : acc - amount;
    }, 0);
  };

  const calculateMonthlyTotals = () => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    let totalIncome = 0;
    let totalExpenses = 0;
    let foodExpenses = 0;
    let miscExpenses = 0;

    transactions.forEach(t => {
      // Ensure date is parsed correctly, might be string from localStorage
      const transactionDate = typeof t.date === 'string' ? parseISO(t.date) : t.date;
      if (isWithinInterval(transactionDate, { start, end })) {
         const amount = Number(t.amount) || 0;
        if (t.type === 'income') {
          totalIncome += amount;
        } else {
          totalExpenses += amount;
          const categoryDetails = getCategoryDetails(t.category);
          if (categoryDetails.budgetType === BUDGET_TYPES.FOOD) {
            foodExpenses += amount;
          } else {
            miscExpenses += amount;
          }
        }
      }
    });

    return { totalIncome, totalExpenses, foodExpenses, miscExpenses };
  };

  const balance = calculateBalance();
  const {
      totalIncome: currentMonthIncome,
      totalExpenses: currentMonthExpenses,
      foodExpenses: currentMonthFoodExpenses,
      miscExpenses: currentMonthMiscExpenses
  } = calculateMonthlyTotals();


  return {
    transactions,
    loading: false, // No loading state needed for localStorage
    editingTransaction,
    transactionToDelete,
    isModalOpen,
    balance,
    currentMonthIncome,
    currentMonthExpenses,
    currentMonthFoodExpenses,
    currentMonthMiscExpenses,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    handleEditTransaction,
    handleDeleteClick,
    handleOpenModal,
    handleCloseModal,
    setTransactionToDelete,
    // fetchTransactions is no longer needed
  };
}
