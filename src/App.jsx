
import React, { useState, useCallback } from "react";
import Layout from "@/components/Layout";
import TransactionModal from "@/components/TransactionModal";
import TransactionList from "@/components/TransactionList";
import AppHeader from "@/components/AppHeader";
import SummaryCards from "@/components/SummaryCards";
import CategoryStatsModal from "@/components/CategoryStatsModal";
import ActionButtons from "@/components/ActionButtons";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { useTransactions } from "@/hooks/useTransactions";
import { useBudget } from "@/hooks/useBudget";
import { generateMonthlySummaryPDF } from '@/lib/pdfGenerator';
// Removed Loader2 import as loading state is removed

function App() {
  const {
    transactions,
    // loading: transactionsLoading, // Removed loading state
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
    // loading: budgetsLoading, // Removed loading state
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
     // No need to check loading state for localStorage
     generateMonthlySummaryPDF(transactions, budgets);
  }, [transactions, budgets]);

  const confirmDeleteTransaction = useCallback((id) => {
      deleteTransaction(id);
  }, [deleteTransaction]);

  const cancelDeleteTransaction = useCallback(() => {
      setTransactionToDelete(null);
  }, [setTransactionToDelete]);

  // const isLoading = transactionsLoading || budgetsLoading; // Removed loading logic

  return (
    <Layout>
      <AppHeader onAddClick={handleOpenModal} />

      {/* Removed loading spinner conditional rendering */}
      <>
        <SummaryCards
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
        />

        <ActionButtons
          onStatsClick={handleOpenStatsModal}
          onPdfClick={handleExportPDF}
        />

        <TransactionList
          transactions={transactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteClick}
        />
      </>


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
