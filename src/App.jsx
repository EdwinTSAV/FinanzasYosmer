
import React, { useState, useCallback } from "react";
import Layout from "@/components/Layout";
import TransactionModal from "@/components/TransactionModal";
import AppHeader from "@/components/AppHeader";
import DashboardContent from "@/components/DashboardContent"; // Import the new component
import CategoryStatsModal from "@/components/CategoryStatsModal";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { useTransactions } from "@/hooks/useTransactions";
import { useBudget } from "@/hooks/useBudget";
import { generateMonthlySummaryPDF } from '@/lib/pdfGenerator';
import { generateTransactionsExcel } from '@/lib/excelGenerator'; // Import Excel generator

function App() {
  const {
    transactions,
    editingTransaction,
    transactionToDelete,
    isModalOpen,
    balance,
    currentMonthIncome,
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
  } = useTransactions();

  const {
    budgets,
    isEditing,
    tempBudgets,
    handleEditToggle,
    handleTempBudgetChange,
    handleBudgetSave,
  } = useBudget();

  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  const handleOpenStatsModal = () => setIsStatsModalOpen(true);
  const handleCloseStatsModal = () => setIsStatsModalOpen(false);

  const handleExportPDF = useCallback(() => {
     generateMonthlySummaryPDF(transactions, budgets);
  }, [transactions, budgets]);

  const handleExportExcel = useCallback(() => { // Added Excel export handler
     generateTransactionsExcel(transactions);
  }, [transactions]);

  const confirmDeleteTransaction = useCallback((id) => {
      deleteTransaction(id);
  }, [deleteTransaction]);

  const cancelDeleteTransaction = useCallback(() => {
      setTransactionToDelete(null);
  }, [setTransactionToDelete]);

  return (
    <Layout>
      <AppHeader onAddClick={handleOpenModal} />

      {/* Use the new DashboardContent component */}
      <DashboardContent
        balance={balance}
        budgets={budgets}
        currentMonthIncome={currentMonthIncome}
        currentMonthFoodExpenses={currentMonthFoodExpenses}
        currentMonthMiscExpenses={currentMonthMiscExpenses}
        isEditing={isEditing}
        tempBudgets={tempBudgets}
        onEditBudgetToggle={handleEditToggle}
        onTempBudgetChange={handleTempBudgetChange}
        onBudgetSave={handleBudgetSave}
        onStatsClick={handleOpenStatsModal}
        onPdfClick={handleExportPDF}
        onExcelClick={handleExportExcel} // Pass Excel handler
        transactions={transactions}
        onEditTransaction={handleEditTransaction}
        onDeleteTransactionClick={handleDeleteClick}
      />

      {/* Modals and Dialogs remain here */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddTransaction={addTransaction}
        onUpdateTransaction={updateTransaction}
        editingTransaction={editingTransaction}
      />

      <CategoryStatsModal
        isOpen={isStatsModalOpen}
        onClose={handleCloseStatsModal}
        transactions={transactions}
      />

      <DeleteConfirmationDialog
         isOpen={!!transactionToDelete}
         onCancel={cancelDeleteTransaction}
         onConfirm={confirmDeleteTransaction}
         transactionId={transactionToDelete?.id}
       />

    </Layout>
  );
}

export default App;
